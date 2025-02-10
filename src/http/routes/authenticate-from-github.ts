import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authenticateFromGitHubCode } from "../../functions/authenticate-from-github.code";

export const authenticateFromGithubRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.post(
    "/auth/github",
    {
      schema: {
        tags: ["auth"],
        description: "Authenticate user from GitHub code",
        operationId: "authenticateFromGitHub",
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({ token: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body;

      const { token } = await authenticateFromGitHubCode({ code });

      return reply.status(201).send({ token });
    }
  );
};
