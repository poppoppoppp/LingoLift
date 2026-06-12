import { describe, expect, it } from "vitest";
import { trainings } from "../data/demoTraining";
import { buildDiagnosisPrompt, buildOptimizationPrompt } from "./prompts";

describe("AI prompts", () => {
  it("builds diagnosis prompts from the current training context", () => {
    const firstTraining = trainings[0];
    const secondTraining = trainings[1];

    const firstPrompt = buildDiagnosisPrompt({
      training: firstTraining,
      firstAnswer: "first answer A"
    });
    const secondPrompt = buildDiagnosisPrompt({
      training: secondTraining,
      firstAnswer: "first answer B"
    });

    expect(firstPrompt).toContain(firstTraining.theme);
    expect(firstPrompt).toContain(firstTraining.target);
    expect(firstPrompt).toContain(firstTraining.scenario.title);
    expect(firstPrompt).toContain(firstTraining.scenario.userIntent);
    expect(firstPrompt).toContain("first answer A");
    expect(firstPrompt).not.toBe(secondPrompt);
    expect(secondPrompt).toContain(secondTraining.theme);
    expect(secondPrompt).toContain(secondTraining.target);
    expect(secondPrompt).toContain(secondTraining.scenario.title);
  });

  it("builds optimization prompts from both answers and the training context", () => {
    const training = trainings[2];

    const prompt = buildOptimizationPrompt({
      training,
      firstAnswer: "first draft",
      secondAnswer: "second draft"
    });

    expect(prompt).toContain(training.theme);
    expect(prompt).toContain(training.target);
    expect(prompt).toContain(training.skill.name);
    expect(prompt).toContain(training.scenario.title);
    expect(prompt).toContain(training.scenario.userIntent);
    expect(prompt).toContain("first draft");
    expect(prompt).toContain("second draft");
  });
});
