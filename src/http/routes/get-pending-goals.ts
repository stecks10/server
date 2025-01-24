import { z } from "zod";
import type { FastifyPluginAsync } from "fastify";
import { getWeekPendingGoals } from "../../functions/get-week-pending-goals";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const pendingGoalsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/pending-goals",
    {
      schema: {
        response: {
          200: z.object({
            pendingGoals: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                desiredWeeklyFrequency: z.number().int().min(1).max(7),
                currentWeeklyProgress: z.number().int().min(0),
                goalCompletionsCounts: z.number().int().min(0),
              })
            ),
          }),
        },
      },
    },
    async () => {
      const { pendingGoals } = await getWeekPendingGoals();

      const mappedPendingGoals = pendingGoals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
        currentWeeklyProgress: goal.desiredWeeklyFrequency,
        goalCompletionsCounts: goal.desiredWeeklyFrequency,
      }));

      return { pendingGoals: mappedPendingGoals };
    }
  );
};
