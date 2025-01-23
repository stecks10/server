import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import dayjs from "dayjs";

interface CreateGoalCompletionRequest {
  goalId: string;
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  // Conta as completions da semana atual para o goalId
  const goalCompletionsCounts = db.$with("goal_completions_counts").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionsCount: count(goalCompletions.id).as("completionsCount"),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  // Recupera a desiredWeeklyFrequency e o completionsCount
  const result = await db
    .with(goalCompletionsCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionsCount:
        sql`COALESCE(${goalCompletionsCounts.completionsCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goals)
    .leftJoin(goalCompletionsCounts, eq(goalCompletionsCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1);

  // Verifica se o goalId existe
  if (result.length === 0) {
    throw new Error("Goal not found!");
  }

  const { completionsCount, desiredWeeklyFrequency } = result[0];

  // Verifica se o goal já foi completado o suficiente nesta semana
  if (completionsCount >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed this week!");
  }

  // Insere uma nova completion
  const insertResult = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning();

  const goalCompletion = insertResult[0];

  return goalCompletion;
}
