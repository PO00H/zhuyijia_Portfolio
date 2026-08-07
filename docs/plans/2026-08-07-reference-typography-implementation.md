# Reference-led Chinese Typography Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the new portfolio homepage around the approved reference-site structure and a Chinese-first typography system while preserving the flat hero and direct links to the two original game websites.

**Architecture:** Keep React Router and the centralized project data. Add typography tokens, restore existing smooth-scroll and cursor infrastructure in the new layout, and replace the repeated featured-card markup with two scroll-linked editorial project stories. Preserve `public/embed/echoflash-detail/` and `public/embed/eraser-odyssey/` byte-for-byte.

**Tech Stack:** React 19, TypeScript, React Router, Framer Motion, Lenis, CSS custom properties, Vitest, ESLint.

### Task 1: Lock the typography and layout contract

**Files:**
- Create: `src/styles/typography.test.ts`
- Modify: `src/app/AppRouter.test.tsx`

**Step 1: Write the failing typography test**

Read `tokens.css`, `shell.css`, and `phase3.css`; assert that the CSS defines a Chinese-first font stack, separate Latin and mono stacks, fluid display/section/project/body sizes, body line-height `1.75`, restrained display tracking, strict CJK line breaking, and progressive `text-autospace`.

**Step 2: Write the failing homepage structure test**

Render `/` and assert that the page includes the editorial hero character group, two `project-story` sections, project information rails, direct embed links, and `data-cursor="view"`. Assert that the old `featured-game__copy` structure is absent.

**Step 3: Run tests to verify RED**

Run: `npm test -- src/styles/typography.test.ts src/app/AppRouter.test.tsx`

Expected: FAIL because the new tokens and editorial structure do not exist.

### Task 2: Add Chinese-first typography tokens

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/shell.css`

**Step 1: Add font-family variables**

Define `--site-font-sans-zh`, `--site-font-latin`, and `--site-font-mono`. Use the Chinese stack for `.site-shell`, Latin only for explicit English labels, and mono only for numeric metadata.

**Step 2: Add relative typography scale variables**

Define display, section, project, role, body, navigation, and metadata sizes plus line-height and tracking variables from the design record.

**Step 3: Add Chinese reading behavior**

Use `font-kerning: normal`, `font-optical-sizing: auto`, `line-break: strict`, `word-break: normal`, `overflow-wrap: break-word`, `text-spacing-trim: normal`, and `text-autospace: ideograph-alpha ideograph-numeric` as progressive enhancements.

**Step 4: Run the typography test**

Run: `npm test -- src/styles/typography.test.ts`

Expected: PASS.

### Task 3: Restore continuous interaction in the new shell

**Files:**
- Modify: `src/components/layout/SiteLayout.tsx`
- Modify: `src/components/SmoothScroll.tsx`
- Modify: `src/components/CustomCursor.tsx`
- Test: `src/app/AppRouter.test.tsx`

**Step 1: Mount existing interaction components**

Render `SmoothScroll` and `CustomCursor` inside the new site shell. Mark the cursor with a stable data attribute for testing.

**Step 2: Respect user input and motion settings**

Skip Lenis on coarse pointers and when `prefers-reduced-motion: reduce` matches. Initialize touch state without synchronously setting state inside an effect.

**Step 3: Add a shared route transition**

Wrap routed content in a keyed Framer Motion main element using the shared easing curve. Keep main content available without animation.

**Step 4: Run the router test**

Run: `npm test -- src/app/AppRouter.test.tsx`

Expected: cursor and route-shell assertions PASS; project-story assertions remain FAIL.

### Task 4: Replace repeated project cards with editorial stories

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Test: `src/app/AppRouter.test.tsx`

**Step 1: Build the hero character group**

Render the three Chinese name characters as individually animated visual spans inside one accessible heading. Keep the hero flat and media-free.

**Step 2: Extract `FeaturedGameStory`**

Create a local component that uses `useScroll`, `useTransform`, and `useSpring` for subtle media movement. Use different class modifiers for the second project rather than duplicating markup.

**Step 3: Preserve direct project navigation**

Continue deriving `projectHref` from `iframeUrl` and use normal anchors so the two project websites open directly.

**Step 4: Add the project information rail**

Expose number, year, ownership, role, and format in predictable positions while changing the media/title composition between stories.

**Step 5: Run the router test**

Run: `npm test -- src/app/AppRouter.test.tsx`

Expected: PASS.

### Task 5: Implement the reference-led layout and motion styles

**Files:**
- Modify: `src/styles/phase3.css`
- Modify: `src/styles/shell.css`
- Test: `src/styles/typography.test.ts`

**Step 1: Restyle the hero**

Use a twelve-column editorial grid, balanced Chinese title wrapping, restrained negative tracking, and a separate information rail. Do not add background media.

**Step 2: Style two distinct project compositions**

Make the first project media-led from the left and the second project reverse and narrower. Let titles overlap media boundaries only where contrast remains readable.

**Step 3: Add reveal, hover, and focus feedback**

Use clip-path reveal, small image scale, title translation, visible keyboard focus, and the shared easing token. Disable non-essential changes under reduced motion.

**Step 4: Tune mobile typography and layout**

Collapse to one column, keep project titles below media, show the project action without hover, and preserve at least `1.65` body line-height.

**Step 5: Run focused tests and lint**

Run: `npm test -- src/styles/typography.test.ts src/app/AppRouter.test.tsx`

Run: `npx eslint src/pages/HomePage.tsx src/components/layout/SiteLayout.tsx src/components/SmoothScroll.tsx src/components/CustomCursor.tsx src/app/AppRouter.test.tsx src/styles/typography.test.ts`

Expected: all focused tests PASS and targeted lint exits 0.

### Task 6: Verify scope and build

**Files:**
- Verify only; do not modify embed directories.

**Step 1: Run the full suite**

Run: `npm test`

Expected: all tests PASS.

**Step 2: Build production assets**

Run: `npm run build`

Expected: exit 0.

**Step 3: Check the full lint baseline**

Run: `npm run lint`

Expected: no new errors; document any pre-existing errors separately.

**Step 4: Confirm game websites are untouched**

Run: `git diff --name-only -- public/embed/echoflash-detail public/embed/eraser-odyssey`

Expected: no output.

**Step 5: Check local responses**

Verify `/`, `/embed/echoflash-detail/index.html`, and `/embed/eraser-odyssey/index.html` return HTTP 200.

**Step 6: Commit and push the current branch**

Stage only the planned source, test, style, and documentation files. Do not stage `echoflash-detail-index.html.bak`.

Commit: `feat: refine Chinese typography and portfolio motion`

Push: `origin codex/redesign/game-focused`
