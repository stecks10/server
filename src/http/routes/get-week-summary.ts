import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekSummary } from "../../functions/get-week-summary";

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  app.get("/summary", async (request, reply) => {
    try {
      const { summary } = await getWeekSummary();
      return { summary };
    } catch (error) {
      console.error("Erro ao obter resumo da semana:", error);
      reply.status(500).send({ error: "Erro interno do servidor" });
    }
  });
};
