import { abilityTagLabels, difficultyLabels, statusLabels, trainingCategoryLabels } from "../labels";
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
    session.status === "not_started" ? "开始今日训练" : session.status === "in_progress" ? "继续今日训练" : "查看今日结果";
  const progress =
    session.status === "not_started" ? 0 : session.status === "completed" ? 100 : Math.round((((session.currentStep ?? 0) + 1) / 12) * 100);
  const todayLabel = new Date(`${training.date}T00:00:00`).toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long"
  });

  return (
    <section className="page">
      <header className="home-header">
        <div>
          <p className="app-name">LingoLift</p>
          <h1>今日训练</h1>
        </div>
        <time dateTime={training.date}>{todayLabel}</time>
      </header>

      <article className="task-card">
        <div className="card-topline">
          <span>{training.theme}</span>
          <span className={`status status-${session.status}`}>{statusLabels[session.status]}</span>
        </div>
        <div className="training-meta-row">
          <span className="meta-pill is-today">今日训练</span>
          <span className="meta-pill">{trainingCategoryLabels[training.category]}</span>
          <span className="meta-pill">{difficultyLabels[training.difficulty]}</span>
          <span className="meta-pill">{training.estimatedMinutes} 分钟</span>
        </div>
        <h2>{training.title}</h2>
        <dl className="meta-list">
          <div>
            <dt>目标</dt>
            <dd>{training.target}</dd>
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
            <dt>预计时长</dt>
            <dd>{training.estimatedMinutes} 分钟</dd>
          </div>
        </dl>
        <div className="progress-summary">
          <span>当前进度</span>
          <strong>{progress}%</strong>
          <div className="progress-track" aria-label="今日训练进度">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
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
              重新开始
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
    </section>
  );
}
