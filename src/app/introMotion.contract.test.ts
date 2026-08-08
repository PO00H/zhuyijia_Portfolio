import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('intro and reference hero sequencing', () => {
  it('starts the supplied hero timeline only after the retained intro exits', () => {
    const preloader = source('../components/Preloader.tsx');
    const hero = source('../components/archive/Hero.tsx');

    expect(preloader).toContain("window.dispatchEvent(new Event('portfolio:intro-complete'))");
    expect(hero).toContain('introReady');
    expect(hero).toContain("window.addEventListener('portfolio:intro-complete'");
  });

  it('does not cover the supplied hero entrance with a route mask on first load', () => {
    const transition = source('../components/motion/RouteTransition.tsx');
    expect(transition).toContain('transitionsReadyRef');
    expect(transition).not.toContain("location.key === 'default'");
  });
});
