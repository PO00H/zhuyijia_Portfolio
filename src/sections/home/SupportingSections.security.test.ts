import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Phase 4 embedded model security', () => {
  it('limits the on-demand model iframe with an explicit sandbox', () => {
    const source = readFileSync(
      new URL('./SupportingSections.tsx', import.meta.url),
      'utf8',
    );

    expect(source).toContain(
      'sandbox="allow-scripts allow-same-origin allow-forms allow-popups"',
    );
  });
});
