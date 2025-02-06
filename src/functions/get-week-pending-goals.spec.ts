import { describe, it, expect } from "vitest";
import { makeUser } from "../../tests/factories/make-user";
import { getWeekPendingGoals } from "./get-week-pending-goals";
import { makeGoalCompletion } from "../../tests/factories/make-goal-completion";
import { makeGoal } from "../../tests/factories/make-goal";

describe("get week pending goals", () => {
  it("should be able to create a new goal", async () => {
    const user = await makeUser();

    const goal1 = await makeGoal({
      userId: user.id,
      title: "Example Goal 1",
      desiredWeeklyFrequency: 5,
    });
    const goal2 = await makeGoal({
      userId: user.id,
      title: "Example Goal 2",
      desiredWeeklyFrequency: 5,
    });
    const goal3 = await makeGoal({
      userId: user.id,
      title: "Example Goal 3",
      desiredWeeklyFrequency: 5,
    });

    await makeGoalCompletion({
      goalId: goal1.id,
    });

    await makeGoalCompletion({
      goalId: goal1.id,
    });

    await makeGoalCompletion({
      goalId: goal2.id,
    });

    await makeGoalCompletion({
      goalId: goal3.id,
    });

    const result = await getWeekPendingGoals({
      userId: user.id,
    });

    expect(result).toEqual({
      pendingGoals: expect.arrayContaining([
        expect.objectContaining({
          id: goal2.id,
          title: "Example Goal 2",
          desiredWeeklyFrequency: 5,
        }),
        expect.objectContaining({
          id: goal3.id,
          title: "Example Goal 3",
          desiredWeeklyFrequency: 5,
        }),
        expect.objectContaining({
          id: goal1.id,
          title: "Example Goal 1",
          desiredWeeklyFrequency: 5,
        }),
      ]),
    });
  });
});
