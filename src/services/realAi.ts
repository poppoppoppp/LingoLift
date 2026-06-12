import type { AiDiagnosis, OptimizationResult } from "../types";
import { buildDiagnosisPrompt, buildOptimizationPrompt, type DiagnosisPromptInput, type OptimizationPromptInput } from "./prompts";

const DEFAULT_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL ?? "https://api.openai.com";
const DEFAULT_MODEL = import.meta.env.VITE_AI_MODEL ?? "gpt-4o-mini";

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export async function diagnoseWithRealAi(input: DiagnosisPromptInput & { apiKey: string }): Promise<AiDiagnosis> {
  const value = await requestJson(input.apiKey, buildDiagnosisPrompt(input));
  return normalizeDiagnosis(value);
}

export async function optimizeWithRealAi(input: OptimizationPromptInput & { apiKey: string }): Promise<OptimizationResult> {
  const value = await requestJson(input.apiKey, buildOptimizationPrompt(input));
  return normalizeOptimization(value);
}

async function requestJson(apiKey: string, prompt: string): Promise<unknown> {
  const response = await fetch(`${DEFAULT_BASE_URL.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a concise Chinese expression coach. Return valid JSON only."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI response did not include message content");
  }

  return parseJsonContent(content);
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fenced?.[1] ?? trimmed);
}

function normalizeDiagnosis(value: unknown): AiDiagnosis {
  if (!isRecord(value)) throw new Error("AI diagnosis JSON is not an object");

  return {
    summary: stringOr(value.summary, "这次表达已经能传达基本意思，但还需要结合场景补充结构和重点。"),
    problems: normalizeTitledList(value.problems, [
      { title: "表达重点还不够清晰", description: "可以先说核心意思，再补充原因和边界。" }
    ]),
    suggestions: normalizeTitledList(value.suggestions, [
      { title: "先给核心判断", description: "开头用一句话说明你真正想表达什么。" }
    ]),
    rewriteDirection: stringOr(value.rewriteDirection, "第二次重写时，按训练公式补齐核心意思、具体说明和下一步。")
  };
}

function normalizeOptimization(value: unknown): OptimizationResult {
  if (!isRecord(value)) throw new Error("AI optimization JSON is not an object");

  return {
    optimizedAnswer: stringOr(value.optimizedAnswer, "我先直接说核心：这件事我需要更清楚地表达重点、边界和下一步。"),
    whyBetter: normalizeStringList(value.whyBetter, ["重点更清晰。", "结构更完整。", "更方便对方回应。"]),
    dailyFormula: stringOr(value.dailyFormula, "核心意思 + 具体说明 + 下一步"),
    reusableSentences: normalizeStringList(value.reusableSentences, ["我先直接说核心：____。", "接下来我会先____。"])
  };
}

function normalizeTitledList(value: unknown, fallback: AiDiagnosis["problems"]): AiDiagnosis["problems"] {
  if (!Array.isArray(value)) return fallback;
  const items = value
    .filter(isRecord)
    .map((item) => ({
      title: stringOr(item.title, ""),
      description: stringOr(item.description, ""),
      exampleFromUser: typeof item.exampleFromUser === "string" ? item.exampleFromUser : undefined
    }))
    .filter((item) => item.title && item.description);
  return items.length > 0 ? items : fallback;
}

function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : fallback;
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
