import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('reference-source motion contract', () => {
  it('matches the supplied hero entrance and parallax timeline', () => {
    const hero = source('../components/archive/Hero.tsx');

    expect(hero).toContain("clipPath: 'inset(100% 0% 0% 0%)', y: 40");
    expect(hero).toContain("{ opacity: 0, y: 20 }");
    expect(hero).toContain("duration: 0.8 }, 0.2");
    expect(hero).toContain("duration: 1 }, 0.4");
    expect(hero).toContain("duration: 1 }, 0.55");
    expect(hero).toContain("duration: 0.8 }, 0.9");
    expect(hero).toContain("duration: 0.8 }, 1.1");
    expect(hero).toContain('yPercent: 30');
    expect(hero).toContain('scrub: true');
  });

  it('matches the supplied section and list reveal timings', () => {
    const heading = source('../components/archive/SectionHeading.tsx');
    const reveal = source('../components/motion/Reveal.tsx');
    const selected = source('../components/archive/SelectedGames.tsx');
    const contact = source('../components/archive/ContactPanel.tsx');

    expect(heading).toContain('y: 30');
    expect(heading).toContain('duration: 0.8');
    expect(heading).toContain("start: 'top 80%'");
    expect(reveal).toContain('y: 40');
    expect(reveal).toContain('duration: 0.8');
    expect(reveal).toContain("start: 'top 85%'");
    expect(selected).toContain('stagger: 0.15');
    expect(contact).toContain('duration: 1');
    expect(contact).toContain("start: 'top 85%'");
  });

  it('matches the supplied nav, cursor, and floating preview response', () => {
    const header = source('../components/layout/SiteHeader.tsx');
    const cursor = source('../components/CustomCursor.tsx');
    const row = source('../components/archive/ProjectRow.tsx');
    const css = source('../styles/archive-design.css');

    expect(header).toContain('nextY > 100');
    expect(header).toContain('yPercent: shouldHide ? -100 : 0');
    expect(header).toContain('duration: 0.4');
    expect(cursor).toContain("duration: 0.1, ease: 'power3'");
    expect(cursor).toContain("duration: 0.25, ease: 'power3'");
    expect(cursor).toContain('scale: 2.5');
    expect(cursor).toContain("delay: 0.1");
    expect(row).toContain("duration: 0.4, ease: 'power3.out'");
    expect(row).toContain('event.clientX + 20');
    expect(row).toContain('event.clientY - 60');
    expect(row).toContain("ease: 'back.out(1.2)'");
    expect(css).toContain('width: 240px');
    expect(css).toContain('aspect-ratio: 16 / 9');
  });

  it('matches the supplied Works, About, and project page entrances', () => {
    const works = source('../pages/WorksPage.tsx');
    const about = source('../pages/AboutPage.tsx');
    const project = source('../pages/ProjectPage.tsx');

    expect(works).toContain('y: 40');
    expect(works).toContain('duration: 1');
    expect(works).toContain('delay: 0.1');
    expect(works).toContain('duration: 0.5');
    expect(works).toContain('stagger: 0.05');
    expect(works).toContain("ease: 'power2.out'");
    expect(about).toContain('delay: 0.3');
    expect(about).toContain('delay: 0.5');
    expect(about).toContain('stagger: 0.15');
    expect(project).toContain('scale: 0.95');
    expect(project).toContain('duration: 1.2');
    expect(project).toContain('delay: 0.4');
  });
});
