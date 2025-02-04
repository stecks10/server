import { InferSelectModel } from "drizzle-orm";
import { db } from "../../src/db";

import { users } from "../../src/db/schema";
import { faker } from "@faker-js/faker";

export async function makeUser(
  override: Partial<InferSelectModel<typeof users>> = {}
) {
  const [row] = await db
    .insert(users)
    .values({
      id: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatar(),
      externalAccountId: faker.number.int({ min: 1, max: 100000 }),
      ...override,
    })
    .returning();

  return row;
}
