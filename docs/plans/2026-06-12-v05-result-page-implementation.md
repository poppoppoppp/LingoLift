# V0.5 Result Page Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Add a post-training result view, copy/reuse affordances, record details, and completed-home actions without changing the app architecture.

**Architecture:** Keep the current single-page React state machine. Add a small result data assembler so result and record views can reuse existing `DailyTraining`, `TrainingSession`, and `SavedExpression` data without a storage migration.

**Tech Stack:** React, TypeScript, localStorage, Vitest, Vite.

---

### Task 1: Result Data and Storage Tests

**Files:**
- Create: `src/services/resultData.test.ts`
- Create: `src/services/resultData.ts`
- Modify: `src/services/storage.test.ts`

**Steps:**
1. Add a failing test for result data assembly from a completed session.
2. Add a failing/pinning storage test that saving the same expression id updates one record.
3. Implement the result data helper and confirm the focused tests pass.

### Task 2: Result View and Training Completion

**Files:**
- Create: `src/pages/ResultPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/TrainingPage.tsx`
- Modify: `src/styles.css`

**Steps:**
1. Add a `result` page state and wire completion to it.
2. Render full training output, before/after comparison, source label, and copy buttons.
3. Keep responsive comparison as two columns on larger screens and stacked on mobile.

### Task 3: Records Details and Home Completed State

**Files:**
- Modify: `src/pages/RecordsPage.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/App.tsx`

**Steps:**
1. Let record cards open an inline detail view.
2. Add home completed actions: view result and restart with confirmation.
3. Restart only resets the current daily session and saved expression, avoiding a version history system.

### Task 4: Settings Copy and Verification

**Files:**
- Modify: `src/pages/SettingsPage.tsx`
- Modify: `src/styles.css`

**Steps:**
1. Add the local API key safety note.
2. Run `npm test`.
3. Run `npm run build`.
4. Run local browser QA at desktop and 390px mobile width.
