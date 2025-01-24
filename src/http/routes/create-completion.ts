import z from "zod";
import type { FastifyPluginAsync } from "fastify";
import { createGoalCompletion } from "../../functions/create-goal-completion";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const createCompletionRoute: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/completions",
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (request) => {
      const { goalId } = request.body;

      await createGoalCompletion({
        goalId: goalId,
      });

      return {
        message: `Conclusão da meta com ID ${goalId} criada com sucesso!`,
      };
    }
  );
};
