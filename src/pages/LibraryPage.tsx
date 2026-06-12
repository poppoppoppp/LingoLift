import { abilityTagLabels, statusLabels } from "../labels";
import type { DailyTraining, TrainingSession } from "../types";

interface LibraryPageProps {
  trainings: DailyTraining[];
  sessions: TrainingSession[];
  onSelectTraining: (training: DailyTraining) => void;
}

export function LibraryPage({ trainings, sessions, onSelectTraining }: LibraryPageProps) {
  return (
    <section className="page">
      <header className="page-header">
        <h1>训练库</h1>
        <p>选择一个内置主题，进入对应表达训练。</p>
      </header>

      <div className="library-list">
        {trainings.map((training) => {
          const session = sessions.find((item) => item.trainingId === training.id && item.date === training.date);
          const status = session?.status ?? "not_started";

          return (
            <button className="library-card" key={training.id} type="button" onClick={() => onSelectTraining(training)}>
              <div className="card-topline">
                <span>{training.theme}</span>
                <span className={`status status-${status}`}>{statusLabels[status]}</span>
              </div>
              <h2>{training.title}</h2>
              <p>{training.target}</p>
              <div className="tag-row">
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
    </section>
  );
}
