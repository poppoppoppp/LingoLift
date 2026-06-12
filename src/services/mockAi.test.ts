import { describe, expect, it } from "vitest";
import { diagnoseFirstAnswer, optimizeSecondAnswer } from "./mockAi";

describe("mock AI service", () => {
  it("returns a structured diagnosis for the first answer", async () => {
    const diagnosis = await diagnoseFirstAnswer({ firstAnswer: "我也不知道怎么说，就是有点复杂。" });

    expect(diagnosis.summary).toContain("更具体");
    expect(diagnosis.problems.length).toBeGreaterThan(0);
    expect(diagnosis.suggestions.length).toBeGreaterThan(0);
    expect(diagnosis.rewriteDirection).toContain("核心意思");
  });

  it("returns an optimized answer for the second answer", async () => {
    const result = await optimizeSecondAnswer({ secondAnswer: "我想把这件事说清楚。" });

    expect(result.optimizedAnswer).toContain("我先直接说核心");
    expect(result.whyBetter.length).toBe(3);
    expect(result.dailyFormula).toContain("核心意思");
  });
});
