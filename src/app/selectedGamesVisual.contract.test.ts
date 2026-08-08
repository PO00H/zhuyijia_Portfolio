import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('selected games visual contract', () => {
  it('gives selected games a dedicated Chinese-led section instead of the generic heading', () => {
    const selected = source('../components/archive/SelectedGames.tsx');

    expect(selected).not.toContain('<SectionHeading');
    expect(selected).toContain('archive-selected__header');
    expect(selected).toContain('精选游戏');
    expect(selected).toContain("String(games.length + 1).padStart(2, '0')");
    expect(selected).toContain('<ProjectRow');
    expect(selected).toContain('selected');
  });

  it('uses the real game brand as the display title with a Chinese subtitle', () => {
    const row = source('../components/archive/ProjectRow.tsx');

    expect(row).toContain("project.title.split(' — ')[0]");
    expect(row).toContain("className={`archive-project-row${selected ? ' is-selected' : ''}`}");
    expect(row).toContain("selected ? project.titleZh : project.title");
    expect(row).toContain('data-selected-game');
  });

  it('makes the two selected games the visual focus while preserving the supplied hover preview', () => {
    const css = source('../styles/archive-design.css') + source('../styles/selected-games.css');

    expect(css).toContain('.archive-selected__header');
    expect(css).toContain('.archive-project-row.is-selected');
    expect(css).toMatch(/\.archive-project-row\.is-selected[^}]+min-height:\s*clamp\(/s);
    expect(css).toMatch(/\.archive-project-row\.is-selected \.archive-project-row__title b[^}]+font-size:\s*clamp\(3rem,/s);
    expect(css).toContain('.archive-project-row__preview');
    expect(css).toContain('width: 240px');
  });
});
