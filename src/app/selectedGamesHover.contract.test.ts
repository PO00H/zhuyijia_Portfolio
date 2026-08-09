import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('selected games hover correction', () => {
  it('keeps every real game fully legible while another row is hovered', () => {
    const css = source('../styles/archive-design.css');

    expect(css).not.toContain(
      '.archive-selected .archive-project-list:hover .archive-project-row-wrap:not(:hover)',
    );
  });

  it('renders the pointer preview outside the transformed route container', () => {
    const row = source('../components/archive/ProjectRow.tsx');

    expect(row).toContain("import { createPortal } from 'react-dom'");
    expect(row).toContain('createPortal(');
    expect(row).toContain('document.body');
  });

  it('places the preview beside the pointer and flips it inside viewport edges', async () => {
    const helperUrl = new URL('../components/archive/projectPreviewPosition.ts', import.meta.url);
    expect(existsSync(helperUrl)).toBe(true);
    if (!existsSync(helperUrl)) return;

    const { getProjectPreviewPosition } = await import('../components/archive/projectPreviewPosition');

    expect(getProjectPreviewPosition(400, 300, 1200, 800)).toEqual({ x: 424, y: 324 });
    expect(getProjectPreviewPosition(1180, 780, 1200, 800)).toEqual({ x: 916, y: 596 });
  });
});
