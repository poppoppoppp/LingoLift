export type AbilityTag =
  | "say_out"
  | "say_smoothly"
  | "say_clearly"
  | "say_precisely"
  | "easy_to_respond";

export interface DailyTraining {
  id: string;
  date: string;
  title: string;
  theme: string;
  target: string;
  fragment: {
    title?: string;
    author?: string;
    content: string;
    sourceType: "original" | "public_domain" | "licensed";
  };
  interpretation: {
    oneSentence: string;
    explanation: string;
  };
  skill: {
    name: string;
    description: string;
    formula: string;
    examples: string[];
  };
  sentenceBank: string[];
  scenario: {
    title: string;
    background: string;
    otherPersonMessage: string;
    userIntent: string;
  };
  rewriteFramework: {
    title: string;
    steps: string[];
    template: string;
  };
  dailyTakeaway: {
    formula: string;
    reusableSentences: string[];
  };
  abilityTags: AbilityTag[];
}

export interface AiDiagnosis {
  summary: string;
  problems: {
    title: string;
    description: string;
    exampleFromUser?: string;
  }[];
  suggestions: {
    title: string;
    description: string;
  }[];
  rewriteDirection: string;
}

export interface TrainingSession {
  id: string;
  trainingId: string;
  date: string;
  status: "not_started" | "in_progress" | "completed";
  currentStep?: number;
  firstAnswer?: string;
  aiDiagnosis?: AiDiagnosis;
  secondAnswer?: string;
  aiOptimizedAnswer?: string;
  optimizationNotes?: string[];
  savedBestExpression?: {
    content: string;
    source: "user_second_answer" | "ai_optimized" | "manual";
    savedAt: string;
  };
  completedAt?: string;
}

export interface SavedExpression {
  id: string;
  trainingId: string;
  date: string;
  theme: string;
  scenarioTitle: string;
  formula: string;
  content: string;
  abilityTags: AbilityTag[];
  createdAt: string;
  updatedAt: string;
}

export interface OptimizationResult {
  optimizedAnswer: string;
  whyBetter: string[];
  dailyFormula: string;
  reusableSentences: string[];
}

export interface GrowthStats {
  streakDays: number;
  completedCount: number;
  savedExpressionCount: number;
  abilityTags: AbilityTag[];
}
