import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authenticateUserHook } from "../hooks/authenticate-user";
import { getUser } from "../../functions/get-user";

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/profile",
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ["auth"],
        description: "Get authenticated user's profile",
        operationId: "getProfile",
        response: {
          201: z.object({
            profile: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string().nullable(),
              avatarUrl: z.string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, replay) => {
      const userId = request.user.sub;

      const { user } = await getUser({
        userId,
      });

      return replay.status(200).send({ profile: user });
    }
  );
};
