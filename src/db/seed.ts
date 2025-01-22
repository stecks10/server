import { client, db } from ".";
import { goalCompletions, goals } from "./schema";
import dayjs from "dayjs";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      {
        id: "1",
        title: "Learn TypeScript",
        desiredWeeklyFrequency: 3,
      },
      {
        id: "2",
        title: " TypeScript",
        desiredWeeklyFrequency: 2,
      },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(2, "days").toDate() },
  ]);
}

seed().finally(() => {
  client.end();
});
