# Design Prototype Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current Codex-created portfolio presentation with the supplied design prototype, preserving its visual system and GSAP motion while filling it only with Zhu Yijia's verified Chinese-first profile, projects, media, and independent game pages.

**Architecture:** Keep the existing Vite, React Router, project data model, and public assets. Port the prototype's page hierarchy and interaction semantics into production React components, replace the previous style cascade with one archive design stylesheet and matching Tailwind tokens, and adapt prototype-only navigation bridges to React Router or direct document navigation. Preserve ECHOFLASH and Eraser's Odyssey as standalone pages under `public/embed`.

**Tech Stack:** React 19, TypeScript, React Router 7, GSAP 3 with `@gsap/react` and ScrollTrigger, Tailwind CSS 3, Vitest.

### Task 1: Freeze the visual and content contract

**Files:**
- Create: `src/app/designMigration.contract.test.tsx`
- Modify: `docs/plans/2026-08-08-design-prototype-migration.md`

1. Write failing tests for the seven-section home hierarchy, Chinese-first primary copy, two verified selected games plus a non-project placeholder, real contact data, and standalone game URLs.
2. Run `npm test -- src/app/designMigration.contract.test.tsx` and confirm the old presentation fails the new contract.
3. Record the source-to-production content mapping in the test fixtures without duplicating project data.
4. Commit the contract and plan.

### Task 2: Replace the visual foundation

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/main.tsx`
- Modify: `src/index.css`
- Create: `src/styles/archive-design.css`
- Create: `src/hooks/useReducedMotion.ts`
- Modify: `src/components/Preloader.tsx`

1. Add prototype theme tokens: near-black `#11110f`, raised black `#191916`, paper `#d7d3c8`, cream `#eeeae1`, muted `#aaa69d`, rule `#34332e`, and cinnabar `#d65336`.
2. Add Playfair Display, Space Grotesk, and GenWanMinTW-compatible Chinese fallbacks and the prototype type scale.
3. Remove previous redesign stylesheet imports from the production entry and load only the new visual foundation.
4. Retheme the retained session preloader to the new palette and reduced-motion behavior.
5. Run the contract test and build; commit the foundation.

### Task 3: Port global navigation, cursor, and transitions

**Files:**
- Modify: `src/components/layout/SiteLayout.tsx`
- Modify: `src/components/layout/SiteHeader.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/components/CustomCursor.tsx`
- Create: `src/components/motion/RouteTransition.tsx`
- Create: `src/components/motion/Reveal.tsx`

1. Write failing interaction tests for Chinese navigation labels, keyboard/escape menu behavior, cursor VIEW/PLAY states, and reduced motion.
2. Port the fixed scroll-aware navigation and mobile fullscreen menu using React Router.
3. Port the dot/ring cursor with `gsap.quickTo`, disabling it for touch and reduced motion.
4. Add a cinnabar route mask and GSAP reveal primitives using scoped `useGSAP` cleanup.
5. Run targeted tests and build; commit global interactions.

### Task 4: Rebuild the home page from the prototype

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Create: `src/components/archive/Hero.tsx`
- Create: `src/components/archive/SectionHeading.tsx`
- Create: `src/components/archive/ProjectRow.tsx`
- Create: `src/components/archive/ProjectCard.tsx`
- Create: `src/components/archive/SelectedGames.tsx`
- Create: `src/components/archive/GameplayLab.tsx`
- Create: `src/components/archive/WorldsVisual.tsx`
- Create: `src/components/archive/ToolsSystems.tsx`
- Create: `src/components/archive/ContactPanel.tsx`

1. Recreate the prototype's metadata strip, two-line oversized hero, direction tags, scroll marker, numbered section headers, list rows, card grids, paper section, and contact conclusion.
2. Use Chinese as primary reading order while retaining the prototype's English archival labels as secondary metadata.
3. Populate selected games with ECHOFLASH and Eraser's Odyssey; retain only a clearly labeled non-clickable future slot as the third row.
4. Populate Gameplay Lab, Worlds, Tools, and Web with actual `portfolioProjects` and local posters/videos/covers.
5. Keep selected-game links pointed directly at their existing standalone webpages.
6. Add title clip reveals, metadata stagger, card/list reveals, preview-follow, media hover playback, and limited hero parallax with reduced-motion fallbacks.
7. Run targeted tests and build; commit the home page.

### Task 5: Rebuild Works and About

**Files:**
- Modify: `src/pages/WorksPage.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/worksFilter.ts`
- Test: `src/pages/worksFilter.test.ts`

1. Port the warm-paper archive page, oversized title, Chinese filter labels, animated project list, and floating preview.
2. Keep all real public projects filterable by game, technical art, tools, and web.
3. Port the warm-paper two-column About layout and populate it from `profile.ts`, including real experience, education, capabilities, awards, and contact.
4. Add staggered reveals with reduced-motion fallbacks.
5. Run filter/page tests and build; commit Works and About.

### Task 6: Rebuild project details without replacing independent games

**Files:**
- Modify: `src/pages/ProjectPage.tsx`
- Test: `src/pages/ProjectPage.contract.test.tsx`

1. Keep direct redirects for ECHOFLASH and Eraser's Odyssey.
2. Port the prototype detail hero, ledger, title/meta grid, overview, role/tool sections, media blocks, materials, awards, and previous/next navigation for other projects.
3. Load videos and 3D embeds only after explicit user action.
4. Use actual project data and omit empty prototype sections instead of showing placeholder copy.
5. Run detail tests and build; commit project details.

### Task 7: Visual, motion, accessibility, and responsive verification

**Files:**
- Modify as needed: `src/styles/archive-design.css`
- Modify as needed: migrated components and pages

1. Run `npm test`, `npm run lint`, and `npm run build`.
2. Inspect `/`, `/works`, `/about`, representative project details, and both standalone game pages at desktop and mobile widths.
3. Verify hover preview tracking, one-video-at-a-time behavior, navigation hide/show, page mask, preloader, reduced motion, keyboard focus, menu escape, media lazy loading, and scroll restoration.
4. Compare section order, spacing, typography, line weights, colors, and transitions against the supplied prototype specification and wireframe.
5. Remove temporary reference images and ensure `echoflash-detail-index.html.bak` remains untouched and untracked.
6. Request code review, rerun verification, commit fixes, and push only `codex/redesign/game-focused`.
