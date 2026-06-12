import { describe, expect, it } from "vitest";
import { trainings } from "../data/demoTraining";
import { diagnoseFirstAnswer, optimizeSecondAnswer } from "./mockAi";

describe("mock AI service", () => {
  it("returns a structured diagnosis for the first answer", async () => {
    const diagnosis = await diagnoseFirstAnswer({ firstAnswer: "我也不知道怎么说，就是有点复杂。" });

    expect(diagnosis.summary).toContain("更具体");
    expect(diagnosis.problems.length).toBeGreaterThan(0);
    expect(diagnosis.suggestions.length).toBeGreaterThan(0);
    expect(diagnosis.rewriteDirection).toContain("核心意思");
  });

  it("uses the current training context in diagnosis", async () => {
    const training = trainings[4];
    const diagnosis = await diagnoseFirstAnswer({ training, firstAnswer: "我觉得我的判断还是有依据的。" });

    expect(diagnosis.summary).toContain(training.scenario.title);
    expect(diagnosis.rewriteDirection).toContain(training.skill.formula);
  });

  it("returns an optimized answer for the second answer", async () => {
    const result = await optimizeSecondAnswer({ secondAnswer: "我想把这件事说清楚。" });

    expect(result.optimizedAnswer).toContain("我先直接说核心");
    expect(result.whyBetter.length).toBe(3);
    expect(result.dailyFormula).toContain("核心意思");
  });

  it("uses the training framework for optimization", async () => {
    const training = trainings[10];
    const result = await optimizeSecondAnswer({ training, secondAnswer: "我不同意直接上线。" });

    expect(result.optimizedAnswer).toContain(training.rewriteFramework.template);
    expect(result.dailyFormula).toBe(training.dailyTakeaway.formula);
    expect(result.reusableSentences).toEqual(training.dailyTakeaway.reusableSentences);
  });
});
