import { useState } from "react";
import { abilityTagLabels, difficultyLabels, trainingCategoryLabels } from "../labels";
import { buildTrainingResult } from "../services/resultData";
import type { DailyTraining, TrainingSession } from "../types";

interface ResultPageProps {
  training: DailyTraining;
  session: TrainingSession;
  onViewRecords: () => void;
}

const sourceLabels: Record<NonNullable<TrainingSession["savedBestExpression"]>["source"], string> = {
  user_second_answer: "我的第二版",
  ai_optimized: "AI 优化版",
  manual: "手动编辑版"
};

export function ResultPage({ training, session, onViewRecords }: ResultPageProps) {
  const result = buildTrainingResult(training, session);
  const [copyMessage, setCopyMessage] = useState("");

  async function copyText(text: string) {
    if (!text.trim()) return;
    if (!navigator.clipboard?.writeText) {
      setCopyMessage("当前浏览器不支持复制");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("已复制");
    } catch {
      setCopyMessage("复制失败，请手动选择文本");
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>训练结果</h1>
        <p>回看这次训练的完整成果，直接复制可复用表达。</p>
      </header>

      <section className="result-hero">
        <div>
          <p className="eyebrow">今日主题</p>
          <h2>{result.theme}</h2>
          <p>{result.title}</p>
        </div>
        <dl className="result-meta">
          <div>
            <dt>场景</dt>
            <dd>{result.scenarioTitle}</dd>
          </div>
          <div>
            <dt>分类</dt>
            <dd>{trainingCategoryLabels[training.category]}</dd>
          </div>
          <div>
            <dt>难度</dt>
            <dd>{difficultyLabels[training.difficulty]}</dd>
          </div>
          <div>
            <dt>核心技巧</dt>
            <dd>{training.quality.coreSkill}</dd>
          </div>
          <div>
            <dt>保存来源</dt>
            <dd>{result.bestExpressionSource ? sourceLabels[result.bestExpressionSource] : "尚未保存"}</dd>
          </div>
        </dl>
      </section>

      <section className="plain-section">
        <h2>表达前后对比</h2>
        <div className="comparison-grid">
          <ResultText title="第一次回答" text={result.firstAnswer} />
          <ResultText title="最终最佳表达" text={result.bestExpression} />
        </div>
        <div className="improvement-note">
          <strong>表达变清楚在哪里</strong>
          {result.whyBetter.length > 0 ? (
            <ul className="compact-list">
              {result.whyBetter.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{result.diagnosisSummary || "最终表达比第一版更聚焦场景、边界和行动。 "}</p>
          )}
        </div>
      </section>

      <section className="plain-section">
        <h2>完整成果</h2>
        <div className="stack">
          <ResultText title="用户第一次回答" text={result.firstAnswer} />
          <ResultText title="AI 诊断摘要" text={result.diagnosisSummary} />
          <ResultText title="用户第二次重写" text={result.secondAnswer} />
          <CopyBlock title="AI 优化版" text={result.aiOptimizedAnswer} onCopy={copyText} />
          <CopyBlock title="最终保存的最佳表达" text={result.bestExpression} onCopy={copyText} />
          <CopyBlock title="今日表达公式" text={result.formula} onCopy={copyText} />
          <CopyBlock title="可复用句式" text={result.reusableSentences.join("\n")} onCopy={copyText} />
        </div>
        {copyMessage ? <p className={copyMessage === "已复制" ? "success-state" : "notice-state"}>{copyMessage}</p> : null}
      </section>

      <section className="plain-section">
        <h2>训练标签</h2>
        <div className="tag-row">
          {training.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
          {result.abilityTags.map((tag) => (
            <span className="tag" key={tag}>
              {abilityTagLabels[tag]}
            </span>
          ))}
        </div>
      </section>

      <button className="secondary-button full-width-button" type="button" onClick={onViewRecords}>
        查看全部记录
      </button>
    </section>
  );
}

function ResultText({ title, text }: { title: string; text: string }) {
  return (
    <section className="answer-box">
      <strong>{title}</strong>
      <span>{text || "暂无内容"}</span>
    </section>
  );
}

function CopyBlock({ title, text, onCopy }: { title: string; text: string; onCopy: (text: string) => void }) {
  return (
    <section className="copy-block">
      <div className="copy-block-header">
        <strong>{title}</strong>
        <button className="copy-button" type="button" onClick={() => onCopy(text)} disabled={!text.trim()}>
          复制
        </button>
      </div>
      <p>{text || "暂无内容"}</p>
    </section>
  );
}
