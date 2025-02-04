import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createGoalCompletion } from "../../functions/create-goal-completion";

export const createCompletionRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/completions",
    {
      schema: {
        tags: ["goals"],
        description: "Create a goal completion",
        body: z.object({
          goalId: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, replay) => {
      const { goalId } = request.body;

      await createGoalCompletion({
        goalId,
      });

      return replay.status(201).send();
    }
  );
};
