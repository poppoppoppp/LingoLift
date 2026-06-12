import { useMemo, useState } from "react";
import { getTodayTraining, trainings } from "./data/demoTraining";
import { HomePage } from "./pages/HomePage";
import { TrainingPage } from "./pages/TrainingPage";
import { RecordsPage } from "./pages/RecordsPage";
import { ResultPage } from "./pages/ResultPage";
import { GrowthPage } from "./pages/GrowthPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LibraryPage } from "./pages/LibraryPage";
import {
  clearTrainingData,
  deleteSavedExpression,
  getGrowthStats,
  getOrCreateSession,
  listSavedExpressions,
  listSessions,
  saveSession
} from "./services/storage";
import type { DailyTraining, TrainingSession } from "./types";

type Page = "home" | "training" | "result" | "library" | "records" | "growth" | "settings";

export const navItems: { page: Exclude<Page, "training" | "result">; label: string }[] = [
  { page: "home", label: "今日" },
  { page: "library", label: "训练库" },
  { page: "records", label: "记录" },
  { page: "growth", label: "成长" },
  { page: "settings", label: "设置" }
];

export default function App() {
  const todayTraining = useMemo(() => getTodayTraining(), []);
  const [page, setPage] = useState<Page>("home");
  const [currentTraining, setCurrentTraining] = useState<DailyTraining>(todayTraining);
  const [session, setSession] = useState<TrainingSession>(() => getOrCreateSession(todayTraining));
  const [revision, setRevision] = useState(0);

  const sessions = useMemo(() => listSessions(), [revision]);
  const todaySession = useMemo(() => getOrCreateSession(todayTraining), [todayTraining, revision]);
  const records = useMemo(() => listSavedExpressions(), [revision]);
  const growthStats = useMemo(() => getGrowthStats(), [revision]);

  function refresh(nextSession?: TrainingSession) {
    setSession(nextSession ?? getOrCreateSession(currentTraining));
    setRevision((value) => value + 1);
  }

  function resetData() {
    clearTrainingData();
    const fresh = getOrCreateSession(todayTraining);
    setCurrentTraining(todayTraining);
    refresh(fresh);
    setPage("home");
  }

  function startTraining(training: DailyTraining) {
    setCurrentTraining(training);
    setSession(getOrCreateSession(training));
    setPage("training");
  }

  function startTodayTraining() {
    setCurrentTraining(todayTraining);
    setSession(todaySession);
    setPage(todaySession.status === "completed" ? "result" : "training");
  }

  function viewTodayResult() {
    setCurrentTraining(todayTraining);
    setSession(todaySession);
    setPage("result");
  }

  function restartTodayTraining() {
    if (!window.confirm("重新开始今日训练会覆盖当前今日 session 和已保存的今日最佳表达，确认继续吗？")) return;
    const fresh: TrainingSession = {
      id: `${todayTraining.id}-${todayTraining.date}`,
      trainingId: todayTraining.id,
      date: todayTraining.date,
      status: "not_started",
      currentStep: 0
    };
    saveSession(fresh);
    deleteSavedExpression(`${fresh.id}-best`);
    setCurrentTraining(todayTraining);
    refresh(fresh);
    setPage("training");
  }

  const showBottomNav = page !== "training";

  return (
    <div className={showBottomNav ? "app-shell" : "app-shell app-shell-training"}>
      <main className="app-main">
        {page === "home" ? (
          <HomePage
            training={todayTraining}
            session={todaySession}
            onStart={startTodayTraining}
            onViewResult={viewTodayResult}
            onRestart={restartTodayTraining}
            onOpenLibrary={() => setPage("library")}
          />
        ) : null}
        {page === "training" ? (
          <TrainingPage training={currentTraining} session={session} onSessionChange={refresh} onViewResult={() => setPage("result")} />
        ) : null}
        {page === "result" ? (
          <ResultPage
            training={currentTraining}
            session={session}
            onBackHome={() => setPage("home")}
            onViewRecords={() => setPage("records")}
            onOpenLibrary={() => setPage("library")}
          />
        ) : null}
        {page === "library" ? <LibraryPage trainings={trainings} sessions={sessions} onSelectTraining={startTraining} /> : null}
        {page === "records" ? <RecordsPage records={records} /> : null}
        {page === "growth" ? <GrowthPage stats={growthStats} onStartTraining={startTodayTraining} /> : null}
        {page === "settings" ? <SettingsPage onClearData={resetData} /> : null}
      </main>

      {showBottomNav ? (
        <nav className="bottom-nav" aria-label="主导航">
          {navItems.map((item) => (
            <button
              className={item.page === page ? "nav-button is-active" : "nav-button"}
              key={item.page}
              onClick={() => setPage(item.page)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
