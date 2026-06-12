import { describe, expect, it } from "vitest";
import { getTodayTraining, trainings } from "./demoTraining";

describe("training content pool", () => {
  it("contains at least six complete built-in trainings", () => {
    expect(trainings.length).toBeGreaterThanOrEqual(6);
    expect(trainings.map((item) => item.theme)).toEqual([
      "表达低能量状态",
      "向导师汇报进度",
      "拒绝别人的请求",
      "解释复杂想法",
      "被质疑时回应",
      "提出自己的需求"
    ]);

    for (const training of trainings) {
      expect(training.id).toBeTruthy();
      expect(training.title).toBeTruthy();
      expect(training.target).toBeTruthy();
      expect(training.fragment.content.length).toBeGreaterThan(300);
      expect(training.interpretation.oneSentence).toBeTruthy();
      expect(training.skill.examples.length).toBeGreaterThan(0);
      expect(training.sentenceBank.length).toBeGreaterThan(0);
      expect(training.scenario.otherPersonMessage).toBeTruthy();
      expect(training.rewriteFramework.steps.length).toBeGreaterThan(0);
      expect(training.dailyTakeaway.reusableSentences.length).toBeGreaterThan(0);
      expect(training.abilityTags.length).toBeGreaterThan(0);
    }
  });

  it("selects a stable training for the same day and rotates by date", () => {
    const first = getTodayTraining(new Date("2026-06-12T01:00:00"));
    const sameDay = getTodayTraining(new Date("2026-06-12T23:59:00"));
    const nextDay = getTodayTraining(new Date("2026-06-13T01:00:00"));

    expect(sameDay.id).toBe(first.id);
    expect(nextDay.id).not.toBe(first.id);
  });
});
