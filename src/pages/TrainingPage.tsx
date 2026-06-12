import { useEffect, useState } from "react";
import { abilityTagLabels } from "../labels";
import { diagnoseFirstAnswer, optimizeSecondAnswer } from "../services/aiCoach";
import { saveExpression, saveSession } from "../services/storage";
import type { DailyTraining, TrainingSession } from "../types";

interface TrainingPageProps {
  training: DailyTraining;
  session: TrainingSession;
  onSessionChange: (session: TrainingSession) => void;
  onViewResult: () => void;
}

const steps = [
  "今日片段",
  "理解",
  "技巧",
  "词句",
  "真实场景",
  "第一次作答",
  "AI 诊断",
  "表达框架",
  "第二次重写",
  "AI 优化",
  "今日沉淀",
  "保存结果"
];

const stages = [
  { name: "输入", range: "今日片段 / 理解 / 技巧 / 词句", start: 0, end: 3 },
  { name: "场景", range: "真实场景 / 第一次作答", start: 4, end: 5 },
  { name: "反馈", range: "AI 诊断 / 表达框架", start: 6, end: 7 },
  { name: "重写", range: "第二次重写 / AI 优化", start: 8, end: 9 },
  { name: "沉淀", range: "今日沉淀 / 保存结果", start: 10, end: 11 }
];

const nextLabels = [
  "读完了，继续拆解",
  "看懂了，学习技巧",
  "记住技巧，积累词句",
  "进入场景",
  "开始第一次表达",
  "提交第一次表达",
  "学习表达框架",
  "开始重写",
  "提交第二次表达",
  "整理今日沉淀",
  "保存今日表达",
  "完成训练，查看结果"
];

export function TrainingPage({ training, session, onSessionChange, onViewResult }: TrainingPageProps) {
  const [busy, setBusy] = useState(false);
  const [busyText, setBusyText] = useState("");
  const [aiNotice, setAiNotice] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [manualDraft, setManualDraft] = useState(() => getBestDraft(session));
  const currentStep = Math.min(session.currentStep ?? 0, steps.length - 1);
  const currentStage = stages.find((stage) => currentStep >= stage.start && currentStep <= stage.end) ?? stages[0];
  const currentStageIndex = stages.indexOf(currentStage) + 1;

  useEffect(() => {
    if (currentStep === 11) {
      setManualDraft(getBestDraft(session));
    }
  }, [currentStep, session.aiOptimizedAnswer, session.secondAnswer, session.savedBestExpression?.content]);

  function persist(patch: Partial<TrainingSession>): TrainingSession {
    const next: TrainingSession = {
      ...session,
      ...patch,
      status: patch.status ?? (session.status === "completed" ? "completed" : "in_progress")
    };
    saveSession(next);
    onSessionChange(next);
    return next;
  }

  function goTo(step: number) {
    setSaveMessage("");
    persist({ currentStep: Math.max(0, Math.min(step, steps.length - 1)) });
  }

  async function runDiagnosis() {
    if (!session.firstAnswer?.trim()) return;
    setBusy(true);
    setBusyText("正在诊断表达...");
    setAiNotice("");
    try {
      const aiDiagnosis = await diagnoseFirstAnswer({ training, firstAnswer: session.firstAnswer, onFallback: setAiNotice });
      persist({ aiDiagnosis, currentStep: 6 });
    } finally {
      setBusy(false);
      setBusyText("");
    }
  }

  async function runOptimization() {
    if (!session.secondAnswer?.trim()) return;
    setBusy(true);
    setBusyText("正在优化表达...");
    setAiNotice("");
    try {
      const result = await optimizeSecondAnswer({
        training,
        firstAnswer: session.firstAnswer,
        secondAnswer: session.secondAnswer,
        onFallback: setAiNotice
      });
      persist({
        aiOptimizedAnswer: result.optimizedAnswer,
        optimizationNotes: result.whyBetter,
        currentStep: 9
      });
    } finally {
      setBusy(false);
      setBusyText("");
    }
  }

  function saveBest(source: "user_second_answer" | "ai_optimized" | "manual", manualContent?: string): TrainingSession | undefined {
    const content =
      source === "manual" ? manualContent : source === "ai_optimized" ? session.aiOptimizedAnswer : session.secondAnswer;
    if (!content?.trim()) return;

    const now = new Date().toISOString();
    const savedBestExpression = { content: content.trim(), source, savedAt: now };
    saveExpression({
      id: `${session.id}-best`,
      trainingId: training.id,
      date: training.date,
      theme: training.theme,
      scenarioTitle: training.scenario.title,
      formula: training.dailyTakeaway.formula,
      content: savedBestExpression.content,
      abilityTags: training.abilityTags,
      createdAt: session.savedBestExpression?.savedAt ?? now,
      updatedAt: now
    });
    setSaveMessage("已保存为今日最佳表达。");
    return persist({ savedBestExpression });
  }

  function completeTraining() {
    if (!session.savedBestExpression?.content.trim()) return;
    const now = new Date().toISOString();
    const next = persist({ status: "completed", completedAt: session.completedAt ?? now, currentStep: 11 });
    onSessionChange(next);
    onViewResult();
  }

  function handlePrimaryAction() {
    if (currentStep === 5) {
      void runDiagnosis();
      return;
    }
    if (currentStep === 8) {
      void runOptimization();
      return;
    }
    if (currentStep === 11) {
      completeTraining();
      return;
    }
    goTo(currentStep + 1);
  }

  const primaryDisabled =
    busy ||
    (currentStep === 5 && !session.firstAnswer?.trim()) ||
    (currentStep === 6 && !session.aiDiagnosis) ||
    (currentStep === 8 && !session.secondAnswer?.trim()) ||
    (currentStep === 9 && !session.aiOptimizedAnswer?.trim()) ||
    (currentStep === 11 && !session.savedBestExpression?.content.trim());

  return (
    <section className="page">
      <header className="training-header">
        <div className="stage-meta">
          <p className="step-count">
            {currentStage.name} · 第 {currentStageIndex} / {stages.length} 阶段 · 总进度 {currentStep + 1} / {steps.length}
          </p>
          <h1>{steps[currentStep]}</h1>
          <p>{currentStage.range}</p>
        </div>
        <div className="progress-track" aria-label="训练进度">
          <span style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
      </header>

      <div className="stage-strip" aria-label="训练阶段">
        {stages.map((stage, index) => (
          <span className={stage === currentStage ? "is-active" : ""} key={stage.name}>
            {index + 1}. {stage.name}
          </span>
        ))}
      </div>

      <div className="step-panel">{renderStep(currentStep)}</div>
      {busy && busyText ? <p className="notice-state">{busyText}</p> : null}
      {aiNotice ? <p className="notice-state">{aiNotice}</p> : null}

      <div className="step-actions">
        <button className="secondary-button" type="button" onClick={() => goTo(currentStep - 1)} disabled={currentStep === 0}>
          上一步
        </button>
        <button className="primary-button is-inline" type="button" onClick={handlePrimaryAction} disabled={primaryDisabled}>
          {busy ? "处理中..." : nextLabels[currentStep]}
        </button>
      </div>
    </section>
  );

  function renderStep(step: number) {
    switch (step) {
      case 0:
        return (
          <ContentBlock title={training.fragment.title ?? training.title} subtitle={training.fragment.author}>
            <p className="reading-text">{training.fragment.content}</p>
          </ContentBlock>
        );
      case 1:
        return (
          <ContentBlock title={training.interpretation.oneSentence}>
            <p>{training.interpretation.explanation}</p>
          </ContentBlock>
        );
      case 2:
        return (
          <ContentBlock title={training.skill.name}>
            <p>{training.skill.description}</p>
            <div className="formula">{training.skill.formula}</div>
            <ul className="compact-list">
              {training.skill.examples.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ContentBlock>
        );
      case 3:
        return (
          <ContentBlock title="可复用句式">
            <ul className="sentence-list">
              {training.sentenceBank.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ContentBlock>
        );
      case 4:
        return (
          <ContentBlock title={training.scenario.title}>
            <p>{training.scenario.background}</p>
            <div className="message-box">{training.scenario.otherPersonMessage}</div>
            <p className="muted-text">{training.scenario.userIntent}</p>
          </ContentBlock>
        );
      case 5:
        return (
          <ContentBlock title="先按本能回答一次">
            <Textarea
              label="第一次作答"
              value={session.firstAnswer ?? ""}
              onChange={(value) => persist({ firstAnswer: value })}
              placeholder="直接写你会怎么回复朋友。"
              requiredHint="写下第一版后才能提交诊断。"
            />
          </ContentBlock>
        );
      case 6:
        return (
          <ContentBlock title="AI 诊断">
            {session.aiDiagnosis ? (
              <div className="stack">
                <InfoCard title="总评">{session.aiDiagnosis.summary}</InfoCard>
                <CardList title="主要问题" items={session.aiDiagnosis.problems} />
                <CardList title="修改建议" items={session.aiDiagnosis.suggestions} />
                <InfoCard title="重写方向">{session.aiDiagnosis.rewriteDirection}</InfoCard>
              </div>
            ) : (
              <EmptyState text="先完成第一次作答，再生成诊断。" />
            )}
          </ContentBlock>
        );
      case 7:
        return (
          <ContentBlock title={training.rewriteFramework.title}>
            <ol className="compact-list">
              {training.rewriteFramework.steps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <div className="formula">{training.rewriteFramework.template}</div>
          </ContentBlock>
        );
      case 8:
        return (
          <ContentBlock title="按框架重写">
            <Textarea
              label="第二次重写"
              value={session.secondAnswer ?? ""}
              onChange={(value) => persist({ secondAnswer: value })}
              placeholder={`按“${training.rewriteFramework.title}”重写。`}
              requiredHint="写下第二版后才能生成优化版。"
            />
          </ContentBlock>
        );
      case 9:
        return (
          <ContentBlock title="AI 优化">
            {session.aiOptimizedAnswer ? (
              <div className="stack">
                <InfoCard title="优化版表达">
                  <span className="preserve-lines">{session.aiOptimizedAnswer}</span>
                </InfoCard>
                <ListCard title="为什么更好" items={session.optimizationNotes ?? []} />
                <InfoCard title="今日表达公式">{training.dailyTakeaway.formula}</InfoCard>
                <ListCard title="可复用句式" items={training.dailyTakeaway.reusableSentences} />
              </div>
            ) : (
              <EmptyState text="先完成第二次重写，再生成优化版。" />
            )}
          </ContentBlock>
        );
      case 10:
        return (
          <ContentBlock title="今日沉淀">
            <div className="formula">{training.dailyTakeaway.formula}</div>
            <ul className="sentence-list">
              {training.dailyTakeaway.reusableSentences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="tag-row">
              {training.abilityTags.map((tag) => (
                <span className="tag" key={tag}>
                  {abilityTagLabels[tag]}
                </span>
              ))}
            </div>
          </ContentBlock>
        );
      default:
        return (
          <ContentBlock title="保存结果">
            <div className="save-options">
              <button className="secondary-button" type="button" onClick={() => saveBest("user_second_answer")} disabled={!session.secondAnswer?.trim()}>
                保存我的第二版
              </button>
              <button className="secondary-button" type="button" onClick={() => saveBest("ai_optimized")} disabled={!session.aiOptimizedAnswer?.trim()}>
                保存 AI 优化版
              </button>
            </div>
            <Textarea
              label="手动编辑后保存"
              value={manualDraft}
              onChange={setManualDraft}
              placeholder="可以基于第二版或 AI 优化版再微调。"
              requiredHint="有内容后才能手动保存。"
            />
            <button className="secondary-button" type="button" onClick={() => saveBest("manual", manualDraft)} disabled={!manualDraft.trim()}>
              保存手动编辑版
            </button>
            {saveMessage ? <p className="success-state">{saveMessage}</p> : null}
            {session.savedBestExpression ? (
              <div className="answer-box">
                <strong>当前今日最佳表达</strong>
                <small>保存来源：{getSourceLabel(session.savedBestExpression.source)}</small>
                <span>{session.savedBestExpression.content}</span>
              </div>
            ) : (
              <EmptyState text="请选择一个版本保存为今日最佳表达。" />
            )}
          </ContentBlock>
        );
    }
  }
}

function getBestDraft(session: TrainingSession): string {
  return session.savedBestExpression?.content ?? session.aiOptimizedAnswer ?? session.secondAnswer ?? "";
}

function getSourceLabel(source: NonNullable<TrainingSession["savedBestExpression"]>["source"]): string {
  if (source === "user_second_answer") return "我的第二版";
  if (source === "ai_optimized") return "AI 优化版";
  return "手动编辑版";
}

function ContentBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <article className="content-block">
      {subtitle ? <p className="eyebrow">{subtitle}</p> : null}
      <h2>{title}</h2>
      {children}
    </article>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  requiredHint
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  requiredHint: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      <span className="field-meta">
        <span>{value.trim().length === 0 ? requiredHint : "内容已自动保存到本地。"}</span>
        <span>{value.trim().length} 字</span>
      </span>
    </label>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="info-card">
      <h3>{title}</h3>
      <p>{children}</p>
    </section>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="info-card">
      <h3>{title}</h3>
      <ul className="compact-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function CardList({
  title,
  items
}: {
  title: string;
  items: { title: string; description: string; exampleFromUser?: string }[];
}) {
  return (
    <section className="info-card">
      <h3>{title}</h3>
      <div className="mini-card-list">
        {items.map((item) => (
          <article className="mini-card" key={item.title}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            {item.exampleFromUser ? <p className="quote-text">例：{item.exampleFromUser}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}
