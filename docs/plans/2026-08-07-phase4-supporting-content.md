# Phase 4 Supporting Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add compact Gameplay Lab, Worlds & Visual Systems, and Tools & Interactive Systems sections to the Chinese-first homepage without competing with the two Selected Games.

**Architecture:** Keep `src/data/projects.ts` as the only content source. Build one home support-section component with a single active-media state so videos and the Sketchfab iframe load only after user input and only one dynamic preview exists at a time. Integrate the component between Selected Games and About, then style it in an isolated Phase 4 stylesheet loaded after the current editorial styles.

**Tech Stack:** React 19, TypeScript, Framer Motion, React Router, CSS custom properties, Vitest, ESLint.

### Task 1: Lock the Phase 4 content boundary

**Files:**
- Modify: `src/app/AppRouter.test.tsx`
- Create: `src/sections/home/SupportingSections.test.tsx`

**Step 1: Write the failing homepage structure test**

Render `/` and assert that the markup contains `#gameplay-lab`, `#worlds`, and `#tools`; exactly three gameplay experiments; StoneCity, Tajima, and NewFace; and section numbers `02` through `05`.

**Step 2: Assert the privacy and selection boundary**

Assert that Peak, Blade Runner, Meshy.ai, and all unselected web experiments are absent from the homepage markup.

**Step 3: Assert lazy dynamic media**

Render `SupportingSections` with `renderToStaticMarkup` and assert that the initial markup contains stable preview buttons and media source data attributes but no `<video>` or `<iframe>`.

**Step 4: Run tests to verify RED**

Run: `npm test -- --run src/app/AppRouter.test.tsx src/sections/home/SupportingSections.test.tsx`

Expected: FAIL because the support component and Phase 4 anchors do not exist.

### Task 2: Build the support-section component

**Files:**
- Create: `src/sections/home/SupportingSections.tsx`
- Test: `src/sections/home/SupportingSections.test.tsx`

**Step 1: Derive confirmed projects from data**

Use `getFeaturedProjects('gameplay-lab')`, `getFeaturedProjects('worlds')`, and `getFeaturedProjects('tools')`. Filter Worlds to `stonecity` and `tajima-cutter`; filter Tools to `newface`.

**Step 2: Add one active-media state**

Store `activeMediaId: string | null` in `SupportingSections`. Video and iframe preview buttons call one toggle handler, guaranteeing that opening one preview closes the previous preview.

**Step 3: Build the on-demand preview**

Before activation, render a semantic button containing the project title, media type, and `data-preview-src`. After activation, render either a controlled `<video autoPlay controls playsInline>` or sandboxed Sketchfab `<iframe>` plus a visible close button.

**Step 4: Build three semantic sections**

Render:

- Gameplay Lab with three compact experiment articles.
- Worlds with StoneCity as primary and Tajima as secondary.
- Tools with one NewFace cover link.

**Step 5: Run the component test**

Run: `npm test -- --run src/sections/home/SupportingSections.test.tsx`

Expected: PASS.

### Task 3: Integrate Phase 4 into the homepage

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/app/AppRouter.test.tsx`

**Step 1: Insert the support sections**

Render `SupportingSections` after Selected Games and before Short About / Contact.

**Step 2: Renumber About**

Change the About / Contact section number from `02` to `05`.

**Step 3: Run router tests**

Run: `npm test -- --run src/app/AppRouter.test.tsx`

Expected: PASS.

### Task 4: Add compact editorial styling

**Files:**
- Create: `src/styles/phase4-support.css`
- Modify: `src/main.tsx`

**Step 1: Style shared support headings**

Use the existing grid, typography tokens, border color, and shared easing. Keep support-section headings and media below Selected Games scale.

**Step 2: Style Gameplay Lab**

Use three equal compact columns on desktop, a clear play state, and fixed 4:3 media. Do not use oversized headings or accent blocks.

**Step 3: Style Worlds and Tools**

Give StoneCity more width than Tajima, use an explicit click-to-load surface for Sketchfab, and present NewFace as one horizontal cover-led link.

**Step 4: Add responsive and reduced-motion rules**

Collapse support content to one column on mobile and remove non-essential transforms when reduced motion is requested.

**Step 5: Run focused lint and tests**

Run: `npx eslint src/sections/home/SupportingSections.tsx src/sections/home/SupportingSections.test.tsx src/pages/HomePage.tsx src/app/AppRouter.test.tsx src/main.tsx`

Run: `npm test -- --run src/app/AppRouter.test.tsx src/sections/home/SupportingSections.test.tsx`

Expected: both exit 0.

### Task 5: Verify and push the current branch

**Files:**
- Verify only; never stage `echoflash-detail-index.html.bak`.

**Step 1: Run the full suite**

Run: `npm test -- --run`

Expected: all tests PASS.

**Step 2: Build production assets**

Run: `npm run build`

Expected: exit 0.

**Step 3: Check lint scope and full baseline**

Run focused ESLint for all Phase 4 files. Run `npm run lint` and record only the known legacy errors separately.

**Step 4: Check public routes and protected scope**

Verify `/`, `/embed/echoflash-detail/index.html`, `/embed/eraser-odyssey/index.html`, and `/embed/newface/index.html` return HTTP 200. Confirm no changes below the two original game embed directories.

**Step 5: Commit and push**

Commit: `feat: add phase 4 supporting content`

Push: `origin codex/redesign/game-focused`
