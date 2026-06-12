import { useMemo, useState } from "react";
import { abilityTagLabels, difficultyLabels, statusLabels, trainingCategoryLabels } from "../labels";
import type { AbilityTag, DailyTraining, TrainingCategory, TrainingDifficulty, TrainingSession } from "../types";
import { getTodayTraining } from "../data/demoTraining";

interface LibraryPageProps {
  trainings: DailyTraining[];
  sessions: TrainingSession[];
  onSelectTraining: (training: DailyTraining) => void;
}

type CategoryFilter = TrainingCategory | "all";
type DifficultyFilter = TrainingDifficulty | "all";
type AbilityFilter = AbilityTag | "all";

export function LibraryPage({ trainings, sessions, onSelectTraining }: LibraryPageProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [abilityFilter, setAbilityFilter] = useState<AbilityFilter>("all");
  const todayTraining = useMemo(() => getTodayTraining(), []);

  const categories = useMemo(() => Array.from(new Set(trainings.map((training) => training.category))), [trainings]);
  const difficulties = useMemo(() => Array.from(new Set(trainings.map((training) => training.difficulty))), [trainings]);
  const abilityTags = useMemo(
    () => Array.from(new Set(trainings.flatMap((training) => training.abilityTags))),
    [trainings]
  );

  const filteredTrainings = trainings.filter((training) => {
    const matchesCategory = categoryFilter === "all" || training.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || training.difficulty === difficultyFilter;
    const matchesAbility = abilityFilter === "all" || training.abilityTags.includes(abilityFilter);
    return matchesCategory && matchesDifficulty && matchesAbility;
  });

  return (
    <section className="page">
      <header className="page-header">
        <h1>训练库</h1>
        <p>选择一个内置主题，进入对应表达训练。</p>
      </header>

      <section className="filter-panel" aria-label="训练库筛选">
        <FilterSelect
          label="分类"
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value as CategoryFilter)}
          options={[
            { value: "all", label: "全部" },
            ...categories.map((category) => ({ value: category, label: trainingCategoryLabels[category] })),
          ]}
        />
        <FilterSelect
          label="难度"
          value={difficultyFilter}
          onChange={(value) => setDifficultyFilter(value as DifficultyFilter)}
          options={[
            { value: "all", label: "全部" },
            ...difficulties.map((difficulty) => ({ value: difficulty, label: difficultyLabels[difficulty] })),
          ]}
        />
        <FilterSelect
          label="能力"
          value={abilityFilter}
          onChange={(value) => setAbilityFilter(value as AbilityFilter)}
          options={[
            { value: "all", label: "全部" },
            ...abilityTags.map((tag) => ({ value: tag, label: abilityTagLabels[tag] })),
          ]}
        />
      </section>

      <div className="library-list">
        {filteredTrainings.map((training) => {
          const session = sessions.find((item) => item.trainingId === training.id && item.date === training.date);
          const status = session?.status ?? "not_started";
          const isToday = training.id === todayTraining.id && training.date === todayTraining.date;

          return (
            <button className="library-card" key={training.id} type="button" onClick={() => onSelectTraining(training)}>
              <div className="card-topline">
                <span>{training.theme}</span>
                <span className={`status status-${status}`}>{statusLabels[status]}</span>
              </div>
              <h2>{training.title}</h2>
              <p>{training.target}</p>
              <div className="training-meta-row">
                {isToday ? <span className="meta-pill is-today">今日训练</span> : null}
                <span className="meta-pill">{trainingCategoryLabels[training.category]}</span>
                <span className="meta-pill">{difficultyLabels[training.difficulty]}</span>
                <span className="meta-pill">{training.estimatedMinutes} 分钟</span>
              </div>
              <div className="tag-row compact-tags">
                {training.abilityTags.map((tag) => (
                  <span className="tag" key={tag}>
                    {abilityTagLabels[tag]}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      {filteredTrainings.length === 0 ? <p className="empty-state">当前筛选下没有训练内容。</p> : null}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
