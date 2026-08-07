import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readStyle(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('Chinese-first typography tokens', () => {
  const tokens = readStyle('./tokens.css');
  const typography = readStyle('./typography.css');

  it('defines separate Chinese, Latin, and numeric font roles', () => {
    expect(tokens).toContain('--site-font-sans-zh:');
    expect(tokens).toContain('--site-font-latin:');
    expect(tokens).toContain('--site-font-mono:');
    expect(tokens.indexOf('"PingFang SC"')).toBeLessThan(tokens.indexOf('Inter'));
  });

  it('defines a restrained display-to-body type scale', () => {
    expect(tokens).toContain('--site-type-display: clamp(4.5rem, 14vw, 13.5rem)');
    expect(tokens).toContain('--site-type-section: clamp(2.75rem, 5.8vw, 6.25rem)');
    expect(tokens).toContain('--site-type-project: clamp(3.25rem, 7vw, 7.5rem)');
    expect(tokens).toContain('--site-type-role: clamp(1.4rem, 3.6vw, 3.6rem)');
    expect(tokens).toContain('--site-type-body: clamp(1rem, 1.1vw, 1.125rem)');
    expect(tokens).toContain('--site-leading-body: 1.75');
    expect(tokens).toContain('--site-tracking-display: -0.045em');
  });

  it('applies Chinese line-breaking and progressive spacing rules', () => {
    expect(typography).toContain('font-family: var(--site-font-sans-zh)');
    expect(typography).toContain('line-break: strict');
    expect(typography).toContain('overflow-wrap: break-word');
    expect(typography).toContain('text-autospace: ideograph-alpha ideograph-numeric');
    expect(typography).toContain('text-spacing-trim: normal');
    expect(typography).toContain('text-wrap: pretty');
  });
});
