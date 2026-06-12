import { abilityTagLabels, statusLabels } from "../labels";
import type { DailyTraining, TrainingSession } from "../types";

interface HomePageProps {
  training: DailyTraining;
  session: TrainingSession;
  onStart: () => void;
  onViewResult: () => void;
  onRestart: () => void;
  onOpenLibrary: () => void;
}

export function HomePage({ training, session, onStart, onViewResult, onRestart, onOpenLibrary }: HomePageProps) {
  const actionLabel =
    session.status === "not_started" ? "开始训练" : session.status === "in_progress" ? "继续训练" : "查看今日结果";
  const progress =
    session.status === "not_started" ? 0 : session.status === "completed" ? 100 : Math.round((((session.currentStep ?? 0) + 1) / 12) * 100);

  return (
    <section className="page">
      <header className="page-header">
        <h1>表达训练</h1>
        <p>每日一次，把模糊表达练成可复用的结构。</p>
      </header>

      <article className="task-card">
        <div className="card-topline">
          <span>今日训练</span>
          <span className={`status status-${session.status}`}>{statusLabels[session.status]}</span>
        </div>
        <h2>{training.title}</h2>
        <dl className="meta-list">
          <div>
            <dt>当前状态</dt>
            <dd>{statusLabels[session.status]}</dd>
          </div>
          <div>
            <dt>当前进度</dt>
            <dd>{progress}%</dd>
          </div>
          <div>
            <dt>主题</dt>
            <dd>{training.theme}</dd>
          </div>
          <div>
            <dt>目标</dt>
            <dd>{training.target}</dd>
          </div>
        </dl>
        <div className="tag-row">
          {training.abilityTags.map((tag) => (
            <span className="tag" key={tag}>
              {abilityTagLabels[tag]}
            </span>
          ))}
        </div>
        {session.status === "completed" && session.savedBestExpression ? (
          <div className="saved-summary">
            <strong>今日最佳表达</strong>
            <p>{session.savedBestExpression.content}</p>
          </div>
        ) : null}
        {session.status === "completed" ? (
          <div className="split-actions home-complete-actions">
            <button className="primary-button is-inline" type="button" onClick={onViewResult}>
              查看今日结果
            </button>
            <button className="secondary-button" type="button" onClick={onRestart}>
              再练一次
            </button>
          </div>
        ) : (
          <button className="primary-button" type="button" onClick={onStart}>
            {actionLabel}
          </button>
        )}
        <button className="secondary-button full-width-button" type="button" onClick={onOpenLibrary}>
          查看训练库
        </button>
      </article>

      <section className="plain-section">
        <h2>今日闭环</h2>
        <ol className="compact-list">
          <li>读片段，抓技巧。</li>
          <li>进入真实场景，先表达一次。</li>
          <li>看诊断，按框架重写。</li>
          <li>保存今日最佳表达。</li>
        </ol>
      </section>
    </section>
  );
}
