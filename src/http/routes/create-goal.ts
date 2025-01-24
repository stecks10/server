import { z } from "zod";
import type { FastifyPluginAsync } from "fastify";
import { createGoal } from "../../functions/create-goal";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const createGoalRoute: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/goals",
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
      },
    },
    async (request) => {
      const { title, desiredWeeklyFrequency } = request.body;

      await createGoal({
        title,
        desiredWeeklyFrequency,
      });

      return { message: "Meta criada com sucesso!" };
    }
  );
};
