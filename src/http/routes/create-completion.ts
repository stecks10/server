import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createGoalCompletion } from "../../functions/create-goal-completion";
import { authenticateUserHook } from "../hooks/authenticate-user";

export const createCompletionRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/completions",
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ["goals"],
        description: "Create a goal completion",
        operationId: "createCompletion",
        body: z.object({
          goalId: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, replay) => {
      const userId = request.user.sub;
      const { goalId } = request.body;

      await createGoalCompletion({
        goalId,
        userId,
      });

      return replay.status(201).send();
    }
  );
};
