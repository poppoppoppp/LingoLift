import type { AbilityTag, TrainingSession } from "./types";

export const abilityTagLabels: Record<AbilityTag, string> = {
  say_out: "说得出",
  say_smoothly: "说得顺",
  say_clearly: "说得清",
  say_precisely: "说得准",
  easy_to_respond: "说得能被接住"
};

export const statusLabels: Record<TrainingSession["status"], string> = {
  not_started: "未开始",
  in_progress: "进行中",
  completed: "已完成"
};
