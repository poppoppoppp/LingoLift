import { useState } from "react";
import { trainings } from "../data/demoTraining";
import { abilityTagLabels, difficultyLabels, trainingCategoryLabels } from "../labels";
import type { SavedExpression } from "../types";

interface RecordsPageProps {
  records: SavedExpression[];
}

export function RecordsPage({ records }: RecordsPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section className="page">
      <header className="page-header">
        <h1>表达记录</h1>
        <p>只保留已保存的最佳表达，按保存时间倒序排列。</p>
      </header>

      {records.length === 0 ? (
        <p className="empty-state">还没有保存记录。完成一次训练后会出现在这里。</p>
      ) : (
        <div className="record-list">
          {records.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              expanded={selectedId === record.id}
              onToggle={() => setSelectedId(selectedId === record.id ? null : record.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RecordCard({ record, expanded, onToggle }: { record: SavedExpression; expanded: boolean; onToggle: () => void }) {
  const training = trainings.find((item) => item.id === record.trainingId);

  return (
    <article className="record-card">
      <div className="card-topline">
        <span>{record.date}</span>
        <span>{record.theme}</span>
      </div>
      {training ? (
        <div className="training-meta-row">
          <span className="meta-pill">{trainingCategoryLabels[training.category]}</span>
          <span className="meta-pill">{difficultyLabels[training.difficulty]}</span>
          <span className="meta-pill">{training.estimatedMinutes} 分钟</span>
        </div>
      ) : null}
      <dl className="record-detail-list">
        <div>
          <dt>场景</dt>
          <dd>{record.scenarioTitle}</dd>
        </div>
        <div>
          <dt>表达公式</dt>
          <dd>{record.formula}</dd>
        </div>
      </dl>
      <div className="answer-box">
        <strong>最佳表达</strong>
        <span>{record.content}</span>
      </div>
      <div className="tag-row">
        {training?.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
        {record.abilityTags.map((tag) => (
          <span className="tag" key={tag}>
            {abilityTagLabels[tag]}
          </span>
        ))}
      </div>
      <button className="secondary-button full-width-button" type="button" onClick={onToggle}>
        {expanded ? "收起详情" : "查看详情"}
      </button>
      {expanded ? <RecordDetail record={record} /> : null}
    </article>
  );
}

function RecordDetail({ record }: { record: SavedExpression }) {
  const training = trainings.find((item) => item.id === record.trainingId);

  return (
    <section className="record-expanded">
      <h3>记录详情</h3>
      <dl className="record-detail-list">
        <div>
          <dt>主题</dt>
          <dd>{record.theme || "暂无主题"}</dd>
        </div>
        <div>
          <dt>场景</dt>
          <dd>{record.scenarioTitle || "暂无场景"}</dd>
        </div>
        <div>
          <dt>表达公式</dt>
          <dd>{record.formula || "暂无公式"}</dd>
        </div>
        {training ? (
          <>
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
          </>
        ) : null}
        <div>
          <dt>最佳表达</dt>
          <dd className="preserve-lines">{record.content || "暂无内容"}</dd>
        </div>
        <div>
          <dt>保存时间</dt>
          <dd>{formatSavedTime(record.updatedAt || record.createdAt)}</dd>
        </div>
      </dl>
      <div className="tag-row">
        {record.abilityTags.map((tag) => (
          <span className="tag" key={tag}>
            {abilityTagLabels[tag]}
          </span>
        ))}
      </div>
    </section>
  );
}

function formatSavedTime(value: string): string {
  if (!value) return "暂无时间";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}
