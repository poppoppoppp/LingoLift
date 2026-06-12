import type { AbilityTag, TrainingCategory, TrainingDifficulty, TrainingSession } from "./types";

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

export const trainingCategoryLabels: Record<TrainingCategory, string> = {
  daily_chat: "日常聊天",
  academic: "学术沟通",
  relationship: "关系沟通",
  self_expression: "自我表达",
  conflict: "分歧冲突",
  work_report: "工作汇报",
  request: "请求协作",
  explanation: "解释说明"
};

export const difficultyLabels: Record<TrainingDifficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "较难"
};
