import type { AiDiagnosis, OptimizationResult } from "../types";
import * as mockAi from "./mockAi";
import { getAiApiKey } from "./storage";
import { diagnoseWithRealAi, optimizeWithRealAi } from "./realAi";
import type { DiagnosisPromptInput, OptimizationPromptInput } from "./prompts";

interface FallbackAware {
  onFallback?: (message: string) => void;
}

const FALLBACK_MESSAGE = "真实 AI 暂不可用，已使用本地训练反馈。";

export async function diagnoseFirstAnswer(input: DiagnosisPromptInput & FallbackAware): Promise<AiDiagnosis> {
  const apiKey = getAiApiKey();
  if (!apiKey) {
    return mockAi.diagnoseFirstAnswer(input);
  }

  try {
    return await diagnoseWithRealAi({ ...input, apiKey });
  } catch (error) {
    console.warn("Real AI diagnosis failed; falling back to mock AI.", error);
    input.onFallback?.(FALLBACK_MESSAGE);
    return mockAi.diagnoseFirstAnswer(input);
  }
}

export async function optimizeSecondAnswer(input: OptimizationPromptInput & FallbackAware): Promise<OptimizationResult> {
  const apiKey = getAiApiKey();
  if (!apiKey) {
    return mockAi.optimizeSecondAnswer(input);
  }

  try {
    return await optimizeWithRealAi({ ...input, apiKey });
  } catch (error) {
    console.warn("Real AI optimization failed; falling back to mock AI.", error);
    input.onFallback?.(FALLBACK_MESSAGE);
    return mockAi.optimizeSecondAnswer(input);
  }
}
