import type { AbilityTag, DailyTraining, GrowthStats, SavedExpression, TrainingSession } from "../types";

const SESSION_KEY = "lingolift.trainingSessions";
const SAVED_KEY = "lingolift.savedExpressions";
const AI_API_KEY = "lingolift.aiApiKey";

function readJson<T>(key: string, fallback: T): T {
  const raw = globalThis.localStorage?.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  globalThis.localStorage?.setItem(key, JSON.stringify(value));
}

export function listSessions(): TrainingSession[] {
  return readJson<TrainingSession[]>(SESSION_KEY, []);
}

export function getOrCreateSession(training: DailyTraining): TrainingSession {
  const sessions = listSessions();
  const existing = sessions.find((item) => item.trainingId === training.id && item.date === training.date);
  if (existing) return existing;

  const session: TrainingSession = {
    id: `${training.id}-${training.date}`,
    trainingId: training.id,
    date: training.date,
    status: "not_started",
    currentStep: 0
  };
  saveSession(session);
  return session;
}

export function saveSession(session: TrainingSession): void {
  const sessions = listSessions();
  const next = [session, ...sessions.filter((item) => item.id !== session.id)];
  writeJson(SESSION_KEY, next);
}

export function listSavedExpressions(): SavedExpression[] {
  return readJson<SavedExpression[]>(SAVED_KEY, []).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function saveExpression(expression: SavedExpression): void {
  const expressions = listSavedExpressions();
  const next = [expression, ...expressions.filter((item) => item.id !== expression.id)];
  writeJson(SAVED_KEY, next);
}

export function deleteSavedExpression(id: string): void {
  const expressions = listSavedExpressions();
  writeJson(
    SAVED_KEY,
    expressions.filter((item) => item.id !== id)
  );
}

export function clearTrainingData(): void {
  globalThis.localStorage?.removeItem(SESSION_KEY);
  globalThis.localStorage?.removeItem(SAVED_KEY);
}

export function getAiApiKey(): string {
  return globalThis.localStorage?.getItem(AI_API_KEY)?.trim() ?? "";
}

export function saveAiApiKey(apiKey: string): void {
  const trimmed = apiKey.trim();
  if (trimmed) {
    globalThis.localStorage?.setItem(AI_API_KEY, trimmed);
  } else {
    clearAiApiKey();
  }
}

export function clearAiApiKey(): void {
  globalThis.localStorage?.removeItem(AI_API_KEY);
}

export function maskAiApiKey(apiKey = getAiApiKey()): string {
  if (!apiKey) return "未配置";
  if (apiKey.length <= 8) return `${apiKey.slice(0, 2)}••••${apiKey.slice(-2)}`;
  return `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}`;
}

export function getGrowthStats(): GrowthStats {
  const completedSessions = listSessions().filter((item) => item.status === "completed");
  const expressions = listSavedExpressions();
  const tagSet = new Set<AbilityTag>();

  for (const expression of expressions) {
    for (const tag of expression.abilityTags) {
      tagSet.add(tag);
    }
  }

  return {
    streakDays: getStreakDays(completedSessions.map((item) => item.date)),
    completedCount: completedSessions.length,
    savedExpressionCount: expressions.length,
    abilityTags: Array.from(tagSet)
  };
}

function getStreakDays(dates: string[]): number {
  const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
  if (uniqueDates.length === 0) return 0;

  let streak = 1;
  let previous = toUtcDate(uniqueDates[0]);

  for (const date of uniqueDates.slice(1)) {
    const current = toUtcDate(date);
    const dayDiff = Math.round((previous.getTime() - current.getTime()) / 86_400_000);
    if (dayDiff !== 1) break;
    streak += 1;
    previous = current;
  }

  return streak;
}

function toUtcDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
