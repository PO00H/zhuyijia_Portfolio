import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('motion lifecycle contract', () => {
  it('tracks the first render independently of browser history keys', () => {
    const transition = source('../components/motion/RouteTransition.tsx');
    expect(transition).toContain('transitionsReadyRef');
    expect(transition).not.toContain("location.key === 'default'");
  });

  it('reverts project tweens before animating a different slug', () => {
    const project = source('../pages/ProjectPage.tsx');
    expect(project).toContain('revertOnUpdate: true');
  });

  it('keeps the floating project preview pointer-driven', () => {
    const row = source('../components/archive/ProjectRow.tsx');
    expect(row).not.toContain('onFocus: showPreview');
    expect(row).not.toContain('onBlur: hidePreview');
  });
});
