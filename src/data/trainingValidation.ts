import type { DailyTraining, TrainingCategory, TrainingDifficulty } from "../types";

type TrainingCandidate = Partial<Omit<DailyTraining, "category" | "difficulty" | "estimatedMinutes">> & {
  category?: unknown;
  difficulty?: unknown;
  estimatedMinutes?: unknown;
};

const validCategories: TrainingCategory[] = [
  "daily_chat",
  "academic",
  "relationship",
  "self_expression",
  "conflict",
  "work_report",
  "request",
  "explanation"
];

const validDifficulties: TrainingDifficulty[] = ["easy", "medium", "hard"];

export function validateTrainings(trainings: TrainingCandidate[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const training of trainings) {
    const id = training.id || "unknown";

    if (ids.has(id)) {
      errors.push(`duplicate id: ${id}`);
    }
    ids.add(id);

    if (!training.title?.trim()) errors.push(`${id} title is required`);
    if ((training.fragment?.content?.trim().length ?? 0) <= 200) {
      errors.push(`${id} fragment.content must be longer than 200 characters`);
    }
    if ((training.sentenceBank?.length ?? 0) < 3) {
      errors.push(`${id} sentenceBank must contain at least 3 items`);
    }
    if ((training.abilityTags?.length ?? 0) < 1) {
      errors.push(`${id} abilityTags must contain at least 1 item`);
    }
    if (!validCategories.includes(training.category as TrainingCategory)) {
      errors.push(`${id} category is invalid`);
    }
    if (!validDifficulties.includes(training.difficulty as TrainingDifficulty)) {
      errors.push(`${id} difficulty is invalid`);
    }
    if (
      typeof training.estimatedMinutes !== "number" ||
      training.estimatedMinutes < 3 ||
      training.estimatedMinutes > 20
    ) {
      errors.push(`${id} estimatedMinutes must be between 3 and 20`);
    }
    if (!training.scenario?.otherPersonMessage?.trim()) {
      errors.push(`${id} scenario.otherPersonMessage is required`);
    }
    if ((training.rewriteFramework?.steps?.length ?? 0) < 3) {
      errors.push(`${id} rewriteFramework.steps must contain at least 3 items`);
    }
  }

  return errors;
}
