import type { AbilityTag, DailyTraining, TrainingSession } from "../types";

export interface TrainingResult {
  title: string;
  theme: string;
  scenarioTitle: string;
  firstAnswer: string;
  diagnosisSummary: string;
  secondAnswer: string;
  aiOptimizedAnswer: string;
  bestExpression: string;
  bestExpressionSource?: "user_second_answer" | "ai_optimized" | "manual";
  formula: string;
  reusableSentences: string[];
  abilityTags: AbilityTag[];
  whyBetter: string[];
}

export function buildTrainingResult(training: DailyTraining, session: TrainingSession): TrainingResult {
  return {
    title: training.title,
    theme: training.theme,
    scenarioTitle: training.scenario.title,
    firstAnswer: session.firstAnswer ?? "",
    diagnosisSummary: session.aiDiagnosis?.summary ?? "",
    secondAnswer: session.secondAnswer ?? "",
    aiOptimizedAnswer: session.aiOptimizedAnswer ?? "",
    bestExpression: session.savedBestExpression?.content ?? session.aiOptimizedAnswer ?? session.secondAnswer ?? "",
    bestExpressionSource: session.savedBestExpression?.source,
    formula: training.dailyTakeaway.formula,
    reusableSentences: training.dailyTakeaway.reusableSentences,
    abilityTags: training.abilityTags,
    whyBetter:
      session.optimizationNotes && session.optimizationNotes.length > 0
        ? session.optimizationNotes
        : session.aiDiagnosis?.suggestions.map((item) => item.description) ?? []
  };
}
