import { abilityTagLabels } from "../labels";
import type { GrowthStats } from "../types";

interface GrowthPageProps {
  stats: GrowthStats;
  onStartTraining: () => void;
}

export function GrowthPage({ stats, onStartTraining }: GrowthPageProps) {
  const hasData = stats.completedCount > 0 || stats.savedExpressionCount > 0;

  return (
    <section className="page">
      <header className="page-header">
        <h1>成长</h1>
        <p>统计从已完成训练和保存表达推导，不重复存储。</p>
      </header>

      <div className="stats-grid">
        <StatCard label="连续训练" value={`${stats.streakDays} 天`} />
        <StatCard label="完成次数" value={`${stats.completedCount} 次`} />
        <StatCard label="保存表达" value={`${stats.savedExpressionCount} 条`} />
      </div>

      {!hasData ? (
        <section className="plain-section">
          <h2>还没有成长数据</h2>
          <p>完成一次今日训练并保存表达后，这里会显示连续天数、完成次数和能力标签。</p>
          <button className="primary-button" type="button" onClick={onStartTraining}>
            去完成今日训练
          </button>
        </section>
      ) : null}

      <section className="plain-section">
        <h2>已训练能力</h2>
        {stats.abilityTags.length === 0 ? (
          <p className="empty-state">完成训练并保存表达后会生成能力标签。</p>
        ) : (
          <div className="tag-row">
            {stats.abilityTags.map((tag) => (
              <span className="tag" key={tag}>
                {abilityTagLabels[tag]}
              </span>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
