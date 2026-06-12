# Expression Training MVP Design

**Goal:** Build a mobile-first daily expression training MVP that runs the full local training loop.

**Approach:** Use a lightweight Vite + React + TypeScript single page app. Keep navigation in React state, store sessions and saved expressions in `localStorage`, and derive growth stats from completed sessions plus saved expressions.

**Visual Direction:** Clean light background, white surfaces, restrained blue accent, compact training-tool density, 8px-or-less radius, clear progress and primary actions. The generated concept established the visual reference: strong app title, today's task card, explicit status, step progress, and structured AI diagnosis cards.

**Pages:**
- Home: today's training, status, target, start/continue/result action.
- Training: 12-step flow with persisted inputs, mock diagnosis, mock optimization, save best expression, and completion.
- Records: saved expressions sorted by date descending.
- Growth: derived streak, completed count, saved count, trained tags.
- Settings: app intro, version, clear local data.

**Data:** `DailyTraining`, `TrainingSession`, `SavedExpression`, `AiDiagnosis`, and `OptimizationResult` live in `src/types.ts`. Demo content lives in `src/data/demoTraining.ts`.

**Out of Scope:** Real backend, real AI key configuration, auth, community, ranking, membership, complex levels, Redux, routing library, UI kit.
