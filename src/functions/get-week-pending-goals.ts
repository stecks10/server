import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

dayjs.extend(weekOfYear);
export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  const goalsCreateUpToWeek = db.$with("goals_created_up_to_week").as(
    db
      .select({
        goalId: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  );

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
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const pendingGoals = await db
    .with(goalsCreateUpToWeek, goalCompletionsCounts)
    .select({
      id: goalsCreateUpToWeek.goalId,
      title: goalsCreateUpToWeek.title,
      desiredWeeklyFrequency: goalsCreateUpToWeek.desiredWeeklyFrequency,
      goalCompletionsCounts: sql`
      COALESCE(${goalCompletionsCounts.completionsCount}, 0)  
    `.mapWith(Number),
    })
    .from(goalsCreateUpToWeek)
    .leftJoin(
      goalCompletionsCounts,
      eq(goalCompletionsCounts.goalId, goalsCreateUpToWeek.goalId)
    );

  return { pendingGoals };
}
