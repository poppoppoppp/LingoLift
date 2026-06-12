import { describe, expect, it } from "vitest";
import { trainings } from "./demoTraining";
import { validateTrainings } from "./trainingValidation";

describe("validateTrainings", () => {
  it("accepts the current built-in training content", () => {
    expect(validateTrainings(trainings)).toEqual([]);
  });

  it("reports duplicate ids", () => {
    const duplicate = [{ ...trainings[0] }, { ...trainings[0] }];

    expect(validateTrainings(duplicate)).toContain("duplicate id: daily-001");
  });

  it("reports missing required content", () => {
    const invalid = {
      ...trainings[0],
      title: "",
      fragment: { ...trainings[0].fragment, content: "太短" },
      sentenceBank: trainings[0].sentenceBank.slice(0, 2),
      abilityTags: [],
      category: "unknown",
      difficulty: "extreme",
      estimatedMinutes: 30,
      scenario: { ...trainings[0].scenario, otherPersonMessage: "" },
      rewriteFramework: { ...trainings[0].rewriteFramework, steps: trainings[0].rewriteFramework.steps.slice(0, 2) }
    };

    const errors = validateTrainings([invalid]);

    expect(errors).toEqual(
      expect.arrayContaining([
        "daily-001 title is required",
        "daily-001 fragment.content must be longer than 200 characters",
        "daily-001 sentenceBank must contain at least 3 items",
        "daily-001 abilityTags must contain at least 1 item",
        "daily-001 category is invalid",
        "daily-001 difficulty is invalid",
        "daily-001 estimatedMinutes must be between 3 and 20",
        "daily-001 scenario.otherPersonMessage is required",
        "daily-001 rewriteFramework.steps must contain at least 3 items"
      ])
    );
  });
});
