# Expression Training MVP Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build the approved mobile-first expression training MVP in an empty Vite React TypeScript project.

**Architecture:** A single React app owns the current page and selected training step. Local persistence is isolated in `src/services/storage.ts`, mock AI in `src/services/mockAi.ts`, and stats are derived instead of separately stored.

**Tech Stack:** React, Vite, TypeScript, plain CSS, LocalStorage, Vitest for focused unit tests.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`
- Create: `src/main.tsx`, `src/App.tsx`, `src/styles.css`

**Steps:**
1. Add minimal Vite React TypeScript configuration.
2. Add build and test scripts.
3. Add root React mount.

### Task 2: Domain Data and Tests

**Files:**
- Create: `src/types.ts`
- Create: `src/data/demoTraining.ts`
- Create: `src/services/storage.ts`
- Create: `src/services/storage.test.ts`

**Steps:**
1. Write tests for initial session creation, persistence, saved expression sorting, clearing data, and derived stats.
2. Run tests and verify failures.
3. Implement storage helpers and stats.
4. Run tests and verify pass.

### Task 3: Mock AI

**Files:**
- Create: `src/services/mockAi.ts`
- Create: `src/services/mockAi.test.ts`

**Steps:**
1. Write tests for diagnosis and optimization output shape.
2. Run tests and verify failures.
3. Implement mock AI functions with future API-shaped async interfaces.
4. Run tests and verify pass.

### Task 4: Pages and Workflow

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/TrainingPage.tsx`
- Create: `src/pages/RecordsPage.tsx`
- Create: `src/pages/GrowthPage.tsx`
- Create: `src/pages/SettingsPage.tsx`
- Modify: `src/App.tsx`, `src/styles.css`

**Steps:**
1. Implement page components and app navigation.
2. Wire all state changes through storage helpers.
3. Keep inputs and AI results persisted across refresh.
4. Implement responsive CSS and no-overflow layout.

### Task 5: Verification

**Commands:**
- `npm install`
- `npm test`
- `npm run build`
- `npm run dev -- --host 127.0.0.1`

**Manual Checks:**
- Home shows today's training.
- Training can progress through all 12 steps.
- First answer generates mock diagnosis.
- Second answer generates mock optimization.
- Best expression saves and appears in Records.
- Completion changes Home status.
- Growth stats derive from saved/completed data.
- Settings clears local data.
- Mobile viewport has no horizontal overflow.
