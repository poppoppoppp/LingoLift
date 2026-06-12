import { describe, expect, it } from "vitest";
import { navItems } from "./App";

describe("app shell navigation", () => {
  it("uses the five mobile app tabs requested for v0.7", () => {
    expect(navItems.map((item) => item.label)).toEqual(["今日", "训练库", "记录", "成长", "设置"]);
    expect(navItems.map((item) => item.page)).toEqual(["home", "library", "records", "growth", "settings"]);
  });
});
