import type { AiDiagnosis, OptimizationResult } from "../types";

export interface DiagnoseInput {
  firstAnswer: string;
}

export interface OptimizeInput {
  secondAnswer: string;
}

export async function diagnoseFirstAnswer(_input: DiagnoseInput): Promise<AiDiagnosis> {
  return {
    summary: "你的表达已经能传达大概意思，但信息还可以更具体，结构也可以更容易被对方接住。",
    problems: [
      {
        title: "核心意图还不够靠前",
        description: "开头如果先铺背景，对方需要自己猜你的重点。可以先把你想表达的核心意思放到第一句。",
        exampleFromUser: "我也不知道怎么说，就是最近这件事有点复杂。"
      },
      {
        title: "边界和程度不够清楚",
        description: "只说感受或态度时，对方不容易判断你希望对方理解、配合、反馈，还是只是听你说明情况。"
      },
      {
        title: "缺少下一步或可回应点",
        description: "结尾如果没有落到行动、请求或问题，对方容易只能安慰、沉默，或继续追问。"
      }
    ],
    suggestions: [
      {
        title: "先说一句核心判断",
        description: "先用一句话说明你真正想表达什么，再补背景和原因。"
      },
      {
        title: "补上具体边界",
        description: "说明这件事到什么程度、你能做到什么、不能做到什么，避免对方误解。"
      },
      {
        title: "给一个可回应的出口",
        description: "最后落到下一步、具体请求或需要确认的问题，让对方知道怎么接。"
      }
    ],
    rewriteDirection: "第二次重写时，尽量按“核心意思 + 具体说明 + 边界/理由 + 下一步或请求”的结构来写。"
  };
}

export async function optimizeSecondAnswer(_input: OptimizeInput): Promise<OptimizationResult> {
  return {
    optimizedAnswer:
      "我先直接说核心：这件事我现在需要把重点和边界讲清楚。我的情况是____，所以暂时不能只用一句模糊的话带过。比较准确的说法是____。接下来我会先____，也想请你帮我确认____。",
    whyBetter: [
      "开头先给核心意思，减少对方猜重点的成本。",
      "中间补上情况和边界，让表达更具体。",
      "结尾给出下一步或请求，让对方更容易回应。"
    ],
    dailyFormula: "核心意思 + 具体说明 + 边界/理由 + 下一步或请求",
    reusableSentences: [
      "我先直接说核心：____。",
      "比较准确的说法是____。",
      "接下来我会先____，也想请你帮我确认____。"
    ]
  };
}
