import fastify from "fastify";
import { z } from "zod";

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../functions/get-week-pending-goals";
import { createGoalCompletion } from "../functions/create-goal-completion";
import { createGoalRoute } from "./routes/create-goal";
import { createCompletionRoute } from "./routes/create-completion";
import { pendingGoalsRoute } from "./routes/get-pending-goals";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute);
app.register(createCompletionRoute);
app.register(pendingGoalsRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333");
  });
