import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

const referenceMotionSources = [
  '../components/archive/Hero.tsx',
  '../components/archive/SelectedGames.tsx',
  '../components/archive/SectionHeading.tsx',
  '../components/archive/ContactPanel.tsx',
  '../components/archive/ProjectRow.tsx',
  '../components/archive/ProjectCard.tsx',
  '../components/layout/SiteHeader.tsx',
  '../components/motion/Reveal.tsx',
  '../components/motion/RouteTransition.tsx',
  '../pages/WorksPage.tsx',
  '../pages/AboutPage.tsx',
  '../pages/ProjectPage.tsx',
];

describe('supplied-reference interaction contract', () => {
  it('does not let the operating-system animation preference remove the supplied motion', () => {
    referenceMotionSources.forEach((path) => {
      expect(source(path), path).not.toContain('useReducedMotion');
    });

    expect(source('../components/Preloader.tsx')).not.toContain('prefers-reduced-motion: reduce');
    expect(source('../index.css')).not.toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('disables the desktop cursor only for a coarse pointer, as the reference does', () => {
    const cursor = source('../components/CustomCursor.tsx');
    const css = source('../styles/archive-design.css');

    expect(cursor).toContain("window.matchMedia('(pointer: coarse)')");
    expect(cursor).not.toContain('(hover: none)');
    expect(cursor).not.toContain('prefers-reduced-motion: reduce');
    expect(css).toContain('@media (pointer: coarse)');
    expect(css).not.toContain('@media (hover: none), (pointer: coarse)');
  });

  it('keeps the floating project preview available to desktop pointer events', () => {
    const row = source('../components/archive/ProjectRow.tsx');

    expect(row).not.toContain('finePointer');
    expect(row).toContain('onPointerEnter={showPreview}');
    expect(row).toContain('onPointerMove={movePreview}');
  });

  it('treats the entire project card as a VIEW cursor target', () => {
    const card = source('../components/archive/ProjectCard.tsx');
    expect(card).toMatch(/<article[^>]+data-cursor="view"/s);
    expect(card).toContain('onClick={handleCardClick}');
    expect(card).toContain('onKeyDown={handleCardKeyDown}');
  });
});
