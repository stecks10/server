import type { FastifyPluginAsync } from "fastify";
import { getWeekPendingGoals } from "../../functions/get-week-pending-goals";
import { z } from "zod";

export const getPendingGoalsRoute: FastifyPluginAsync = async (app) => {
  app.get(
    "/pending-goals",
    {
      schema: {
        tags: ["goals"],
        description: "Get pending goals",
        response: {
          200: z.object({
            id: z.string(),
            title: z.string(),
            desiredWeeklyFrequency: z.number(),
            completionCount: z.number(),
          }),
        },
      },
    },
    async () => {
      const { pendingGoals } = await getWeekPendingGoals();

      return pendingGoals;
    }
  );
};
