import { describe, expect, it } from "vitest";
import { getTodayTraining, trainings } from "./demoTraining";
import { difficultyLabels, trainingCategoryLabels } from "../labels";

describe("training content pool", () => {
  it("contains at least twelve complete built-in trainings", () => {
    expect(trainings.length).toBeGreaterThanOrEqual(12);

    for (const training of trainings) {
      expect(training.id).toBeTruthy();
      expect(training.title).toBeTruthy();
      expect(training.target).toBeTruthy();
      expect(training.category).toSatisfy((value: string) => value in trainingCategoryLabels);
      expect(training.difficulty).toSatisfy((value: string) => value in difficultyLabels);
      expect(training.estimatedMinutes).toBeGreaterThanOrEqual(3);
      expect(training.estimatedMinutes).toBeLessThanOrEqual(20);
      expect(training.tags.length).toBeGreaterThan(0);
      expect(training.fragment.content.length).toBeGreaterThan(300);
      expect(training.fragment.content.length).toBeLessThan(700);
      expect(training.interpretation.oneSentence).toBeTruthy();
      expect(training.skill.examples.length).toBeGreaterThan(0);
      expect(training.sentenceBank.length).toBeGreaterThanOrEqual(3);
      expect(training.scenario.otherPersonMessage).toBeTruthy();
      expect(training.rewriteFramework.steps.length).toBeGreaterThanOrEqual(3);
      expect(training.dailyTakeaway.reusableSentences.length).toBeGreaterThan(0);
      expect(training.abilityTags.length).toBeGreaterThan(0);
      expect(training.quality.coreSkill).toBeTruthy();
      expect(training.quality.applicableScenes.length).toBeGreaterThan(0);
      expect(training.quality.antiPatterns.length).toBeGreaterThan(0);
    }
  });

  it("keeps training ids unique", () => {
    const ids = trainings.map((training) => training.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("selects a stable training for the same day and rotates by date", () => {
    const first = getTodayTraining(new Date("2026-06-12T01:00:00"));
    const sameDay = getTodayTraining(new Date("2026-06-12T23:59:00"));
    const nextDay = getTodayTraining(new Date("2026-06-13T01:00:00"));

    expect(sameDay.id).toBe(first.id);
    expect(nextDay.id).not.toBe(first.id);
  });
});
