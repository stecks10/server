import { expect, test } from "vitest";
import {
  calculateExperienceToLevel,
  calculateLevelFromExperience,
} from "./gamification";

test("experience to level", () => {
  const exp1 = calculateExperienceToLevel(1);
  const exp2 = calculateExperienceToLevel(2);
  const exp4 = calculateExperienceToLevel(4);

  expect(exp1).toBe(0);
  expect(exp2).toBe(26);
  expect(exp4).toBe(43);
});

test("leve from experience", () => {
  const level1 = calculateLevelFromExperience(10);
  const level2 = calculateLevelFromExperience(27);
  const level5 = calculateLevelFromExperience(26 + 33 + 43);

  expect(level1).toEqual(1);
  expect(level2).toEqual(2);
  expect(level5).toEqual(4);
});
