import { useState } from "react";
import { abilityTagLabels } from "../labels";
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
            <article className="record-card" key={record.id}>
              <div className="card-topline">
                <span>{record.date}</span>
                <span>{record.theme}</span>
              </div>
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
                {record.abilityTags.map((tag) => (
                  <span className="tag" key={tag}>
                    {abilityTagLabels[tag]}
                  </span>
                ))}
              </div>
              <button
                className="secondary-button full-width-button"
                type="button"
                onClick={() => setSelectedId(selectedId === record.id ? null : record.id)}
              >
                {selectedId === record.id ? "收起详情" : "查看详情"}
              </button>
              {selectedId === record.id ? <RecordDetail record={record} /> : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function RecordDetail({ record }: { record: SavedExpression }) {
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
