import type { DailyTraining } from "../types";

export interface DiagnosisPromptInput {
  training: DailyTraining;
  firstAnswer: string;
}

export interface OptimizationPromptInput {
  training: DailyTraining;
  firstAnswer?: string;
  secondAnswer: string;
}

function trainingContext(training: DailyTraining): string {
  return [
    `theme: ${training.theme}`,
    `target: ${training.target}`,
    `skill: ${training.skill.name} - ${training.skill.description}`,
    `skillFormula: ${training.skill.formula}`,
    `scenario: ${training.scenario.title}`,
    `scenarioBackground: ${training.scenario.background}`,
    `otherPersonMessage: ${training.scenario.otherPersonMessage}`,
    `userIntent: ${training.scenario.userIntent}`
  ].join("\n");
}

export function buildDiagnosisPrompt(input: DiagnosisPromptInput): string {
  return [
    "你是 LingoLift 的表达训练教练。请基于当前训练内容诊断用户第一次作答。",
    "不要泛泛评价，必须贴合 theme、target、skill、scenario、userIntent。",
    "",
    "当前训练内容：",
    trainingContext(input.training),
    "",
    `firstAnswer: ${input.firstAnswer}`,
    "",
    "只输出 JSON，不要输出 Markdown。JSON 结构必须是：",
    `{
  "summary": "一句总体诊断",
  "problems": [
    { "title": "问题标题", "description": "问题说明", "exampleFromUser": "可选，引用用户表达中的短片段" }
  ],
  "suggestions": [
    { "title": "建议标题", "description": "建议说明" }
  ],
  "rewriteDirection": "第二次重写时的方向"
}`
  ].join("\n");
}

export function buildOptimizationPrompt(input: OptimizationPromptInput): string {
  return [
    "你是 LingoLift 的表达训练教练。请基于当前训练内容优化用户第二次重写。",
    "必须贴合 theme、target、skill、scenario、userIntent，并保留用户真实语气。",
    "",
    "当前训练内容：",
    trainingContext(input.training),
    "",
    `firstAnswer: ${input.firstAnswer ?? ""}`,
    `secondAnswer: ${input.secondAnswer}`,
    "",
    "只输出 JSON，不要输出 Markdown。JSON 结构必须是：",
    `{
  "optimizedAnswer": "优化后的表达",
  "whyBetter": ["为什么更好 1", "为什么更好 2", "为什么更好 3"],
  "dailyFormula": "本次表达公式",
  "reusableSentences": ["可复用句式 1", "可复用句式 2"]
}`
  ].join("\n");
}
