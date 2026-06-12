import { beforeEach, describe, expect, it } from "vitest";
import { demoTraining, trainings } from "../data/demoTraining";
import {
  clearTrainingData,
  deleteSavedExpression,
  getGrowthStats,
  getOrCreateSession,
  listSavedExpressions,
  saveExpression,
  saveSession
} from "./storage";

describe("training storage", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    globalThis.localStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      get length() {
        return store.size;
      }
    } as Storage;
    localStorage.clear();
  });

  it("creates and reuses today's session", () => {
    const first = getOrCreateSession(demoTraining);
    const second = getOrCreateSession(demoTraining);

    expect(first.status).toBe("not_started");
    expect(second.id).toBe(first.id);
    expect(second.trainingId).toBe(demoTraining.id);
  });

  it("persists session changes", () => {
    const session = getOrCreateSession(demoTraining);
    saveSession({
      ...session,
      status: "completed",
      currentStep: 8,
      firstAnswer: "第一次表达",
      secondAnswer: "第二次表达",
      completedAt: "2026-06-12T10:00:00.000Z"
    });

    const persisted = getOrCreateSession(demoTraining);
    expect(persisted.status).toBe("completed");
    expect(persisted.currentStep).toBe(8);
    expect(persisted.firstAnswer).toBe("第一次表达");
    expect(persisted.secondAnswer).toBe("第二次表达");
  });

  it("keeps progress isolated by training id", () => {
    const firstTraining = trainings[0];
    const secondTraining = trainings[1];
    const firstSession = getOrCreateSession(firstTraining);
    const secondSession = getOrCreateSession(secondTraining);

    saveSession({
      ...firstSession,
      status: "in_progress",
      currentStep: 5,
      firstAnswer: "我需要把节奏说明清楚。"
    });

    expect(getOrCreateSession(firstTraining).firstAnswer).toBe("我需要把节奏说明清楚。");
    expect(getOrCreateSession(firstTraining).currentStep).toBe(5);
    expect(getOrCreateSession(secondTraining).id).toBe(secondSession.id);
    expect(getOrCreateSession(secondTraining).firstAnswer).toBeUndefined();
    expect(getOrCreateSession(secondTraining).currentStep).toBe(0);
  });

  it("lists saved expressions by save time newest first", () => {
    saveExpression({
      id: "old",
      trainingId: "daily-001",
      date: "2026-06-12",
      theme: "old",
      scenarioTitle: "old",
      formula: "old",
      content: "old",
      abilityTags: ["say_out"],
      createdAt: "2026-06-12T10:00:00.000Z",
      updatedAt: "2026-06-12T10:00:00.000Z"
    });
    saveExpression({
      id: "new",
      trainingId: "daily-001",
      date: "2026-06-11",
      theme: "new",
      scenarioTitle: "new",
      formula: "new",
      content: "new",
      abilityTags: ["say_clearly"],
      createdAt: "2026-06-11T12:00:00.000Z",
      updatedAt: "2026-06-12T12:00:00.000Z"
    });

    expect(listSavedExpressions().map((item) => item.id)).toEqual(["new", "old"]);
  });

  it("updates the same saved expression instead of duplicating it", () => {
    saveExpression({
      id: "daily-001-2026-06-12-best",
      trainingId: "daily-001",
      date: "2026-06-12",
      theme: "表达边界",
      scenarioTitle: "朋友临时求助",
      formula: "先共情，再说明边界",
      content: "旧表达",
      abilityTags: ["say_clearly"],
      createdAt: "2026-06-12T10:00:00.000Z",
      updatedAt: "2026-06-12T10:00:00.000Z"
    });
    saveExpression({
      id: "daily-001-2026-06-12-best",
      trainingId: "daily-001",
      date: "2026-06-12",
      theme: "表达边界",
      scenarioTitle: "朋友临时求助",
      formula: "先共情，再说明边界",
      content: "新表达",
      abilityTags: ["say_clearly"],
      createdAt: "2026-06-12T10:00:00.000Z",
      updatedAt: "2026-06-12T11:00:00.000Z"
    });

    const records = listSavedExpressions();
    expect(records).toHaveLength(1);
    expect(records[0].content).toBe("新表达");
    expect(records[0].createdAt).toBe("2026-06-12T10:00:00.000Z");
    expect(records[0].updatedAt).toBe("2026-06-12T11:00:00.000Z");
  });

  it("deletes a saved expression by id without touching other records", () => {
    saveExpression({
      id: "keep",
      trainingId: "daily-001",
      date: "2026-06-12",
      theme: "keep",
      scenarioTitle: "keep",
      formula: "keep",
      content: "keep",
      abilityTags: ["say_out"],
      createdAt: "2026-06-12T10:00:00.000Z",
      updatedAt: "2026-06-12T10:00:00.000Z"
    });
    saveExpression({
      id: "remove",
      trainingId: "daily-002",
      date: "2026-06-12",
      theme: "remove",
      scenarioTitle: "remove",
      formula: "remove",
      content: "remove",
      abilityTags: ["say_clearly"],
      createdAt: "2026-06-12T11:00:00.000Z",
      updatedAt: "2026-06-12T11:00:00.000Z"
    });

    deleteSavedExpression("remove");

    expect(listSavedExpressions().map((item) => item.id)).toEqual(["keep"]);
  });

  it("derives growth stats from sessions and saved expressions", () => {
    const session = getOrCreateSession(demoTraining);
    saveSession({ ...session, status: "completed", completedAt: "2026-06-12T10:00:00.000Z" });
    saveExpression({
      id: "saved",
      trainingId: demoTraining.id,
      date: demoTraining.date,
      theme: demoTraining.theme,
      scenarioTitle: demoTraining.scenario.title,
      formula: demoTraining.dailyTakeaway.formula,
      content: "最佳表达",
      abilityTags: demoTraining.abilityTags,
      createdAt: "2026-06-12T10:00:00.000Z",
      updatedAt: "2026-06-12T10:00:00.000Z"
    });

    expect(getGrowthStats()).toEqual({
      streakDays: 1,
      completedCount: 1,
      savedExpressionCount: 1,
      abilityTags: demoTraining.abilityTags
    });
  });

  it("clears all local training data", () => {
    getOrCreateSession(demoTraining);
    clearTrainingData();

    expect(listSavedExpressions()).toEqual([]);
    expect(getGrowthStats().completedCount).toBe(0);
  });
});
