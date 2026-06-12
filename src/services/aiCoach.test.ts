import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoTraining } from "../data/demoTraining";
import { clearAiApiKey, saveAiApiKey } from "./storage";
import { diagnoseFirstAnswer, optimizeSecondAnswer } from "./aiCoach";

function installLocalStorage() {
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
}

describe("AI coach fallback", () => {
  beforeEach(() => {
    installLocalStorage();
    clearAiApiKey();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses mock AI when no API key is configured", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const diagnosis = await diagnoseFirstAnswer({
      training: demoTraining,
      firstAnswer: "plain first answer"
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(diagnosis.summary).toContain("更具体");
  });

  it("falls back to mock AI when real AI throws", async () => {
    saveAiApiKey("test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      })
    );

    const result = await optimizeSecondAnswer({
      training: demoTraining,
      firstAnswer: "first answer",
      secondAnswer: "second answer"
    });

    expect(result.optimizedAnswer).toContain("我先直接说核心");
  });

  it("falls back to mock AI when real AI returns invalid JSON", async () => {
    saveAiApiKey("test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "not json" } }]
        })
      }))
    );

    const diagnosis = await diagnoseFirstAnswer({
      training: demoTraining,
      firstAnswer: "plain first answer"
    });

    expect(diagnosis.summary).toContain("更具体");
  });
});
