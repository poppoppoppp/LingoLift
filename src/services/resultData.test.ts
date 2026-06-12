import { describe, expect, it } from "vitest";
import { demoTraining } from "../data/demoTraining";
import type { TrainingSession } from "../types";
import { buildTrainingResult } from "./resultData";

describe("buildTrainingResult", () => {
  it("assembles the complete training outcome from training and session data", () => {
    const session: TrainingSession = {
      id: "daily-001-2026-06-12",
      trainingId: demoTraining.id,
      date: demoTraining.date,
      status: "completed",
      firstAnswer: "第一版回答",
      aiDiagnosis: {
        summary: "需要更清楚地交代边界。",
        problems: [],
        suggestions: [{ title: "补充限制", description: "说明能做什么和不能做什么。" }],
        rewriteDirection: "先确认需求，再给出选择。"
      },
      secondAnswer: "第二版重写",
      aiOptimizedAnswer: "AI 优化表达",
      optimizationNotes: ["把模糊态度改成明确选择。"],
      savedBestExpression: {
        content: "最终最佳表达",
        source: "manual",
        savedAt: "2026-06-12T10:00:00.000Z"
      },
      completedAt: "2026-06-12T10:01:00.000Z"
    };

    expect(buildTrainingResult(demoTraining, session)).toEqual({
      title: demoTraining.title,
      theme: demoTraining.theme,
      scenarioTitle: demoTraining.scenario.title,
      firstAnswer: "第一版回答",
      diagnosisSummary: "需要更清楚地交代边界。",
      secondAnswer: "第二版重写",
      aiOptimizedAnswer: "AI 优化表达",
      bestExpression: "最终最佳表达",
      bestExpressionSource: "manual",
      formula: demoTraining.dailyTakeaway.formula,
      reusableSentences: demoTraining.dailyTakeaway.reusableSentences,
      abilityTags: demoTraining.abilityTags,
      whyBetter: ["把模糊态度改成明确选择。"]
    });
  });
});
