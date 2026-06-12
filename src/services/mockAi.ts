import type { AiDiagnosis, DailyTraining, OptimizationResult } from "../types";

export interface DiagnoseInput {
  training?: DailyTraining;
  firstAnswer: string;
}

export interface OptimizeInput {
  training?: DailyTraining;
  firstAnswer?: string;
  secondAnswer: string;
}

export async function diagnoseFirstAnswer(input: DiagnoseInput): Promise<AiDiagnosis> {
  const training = input.training;
  const skillName = training?.skill.name ?? "核心表达结构";
  const formula = training?.skill.formula ?? "核心意思 + 具体说明 + 边界/理由 + 下一步或请求";
  const scenario = training?.scenario.title ?? "当前场景";
  const userExample = input.firstAnswer.trim().slice(0, 28);

  return {
    summary: `你的表达已经能传达大概意思，但在“${scenario}”里还可以更具体，并更贴近「${skillName}」。`,
    problems: [
      {
        title: "核心意图还不够靠前",
        description: `开头可以先放出你真正想表达的重点，再按「${formula}」补足信息。`,
        exampleFromUser: userExample || undefined,
      },
      {
        title: "场景边界还可以更清楚",
        description: training
          ? `这次要回应的是“${training.scenario.otherPersonMessage}”。可以更明确你希望对方理解、确认或配合什么。`
          : "只说感受或态度时，对方不容易判断你希望他理解、配合、反馈，还是只是听你说明情况。",
      },
      {
        title: "缺少可回应的出口",
        description: "结尾如果没有落到下一步、请求或确认点，对方容易只能安慰、沉默，或继续追问。",
      },
    ],
    suggestions: [
      {
        title: `使用「${skillName}」`,
        description: `第二版按这个公式重写：${formula}。`,
      },
      {
        title: "补上具体场景信息",
        description: training
          ? `围绕“${training.scenario.userIntent}”写，不要泛泛表达态度。`
          : "说明这件事到什么程度、你能做什么、不能做什么，避免对方误解。",
      },
      {
        title: "给一个可回应出口",
        description: "最后落到下一步、具体请求或需要确认的问题，让对方知道怎么接。",
      },
    ],
    rewriteDirection: `第二次重写时，尽量按「${formula}」组织，并贴合“${scenario}”。`,
  };
}

export async function optimizeSecondAnswer(input: OptimizeInput): Promise<OptimizationResult> {
  const training = input.training;
  const formula = training?.dailyTakeaway.formula ?? "核心意思 + 具体说明 + 边界/理由 + 下一步或请求";
  const reusableSentences = training?.dailyTakeaway.reusableSentences ?? [
    "我先直接说核心：____。",
    "比较准确的说法是____。",
    "接下来我会先____，也想请你确认____。",
  ];
  const template = training?.rewriteFramework.template ?? "我先直接说核心：____。我的情况是____。接下来我会____。";

  return {
    optimizedAnswer: training
      ? `${template}（可把空白处替换成你的真实信息，语气保持自然。）`
      : "我先直接说核心：这件事我现在需要把重点和边界讲清楚。我的情况是____，所以暂时不能只用一句模糊的话带过。接下来我会先____，也想请你确认____。",
    whyBetter: [
      "开头先给核心意思，减少对方猜重点的成本。",
      `中间贴合「${formula}」，让表达更具体。`,
      "结尾给出下一步或请求，让对方更容易回应。",
    ],
    dailyFormula: formula,
    reusableSentences,
  };
}
