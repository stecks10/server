import type { FastifyPluginAsync } from "fastify";
import { getWeekSummary } from "../../functions/get-week-summary";
import { z } from "zod";
import { authenticateUserHook } from "../hooks/authenticate-user";
import dayjs from "dayjs";

interface QueryString {
  weekStart: Date;
}

const WeekSummarySchema = z.object({
  completed: z.number(),
  total: z.number().nullable(),
  goalsPerDay: z
    .record(
      z.string(),
      z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          completedAt: z.string(),
        })
      )
    )
    .nullable(),
});

const QueryStringSchema = z.object({
  weekStart: z.coerce
    .date()
    .optional()
    .default(dayjs().startOf("week").toDate()),
});

export const getWeekSummaryRoute: FastifyPluginAsync = async (app) => {
  app.get(
    "/summary",
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ["goals"],
        description: "Get week summary",
        operationId: "getWeekSummary",
        querystring: QueryStringSchema,
        response: {
          200: WeekSummarySchema,
        },
      },
    },
    async (request) => {
      const userId = request.user.sub;

      const { weekStart } = request.query as QueryString;
      try {
        const summary = await getWeekSummary({
          userId,
          weekStart,
        });

        return summary;
      } catch (error) {
        return { message: "Failed to fetch week summary" };
      }
    }
  );
};
