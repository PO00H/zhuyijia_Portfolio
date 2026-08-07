import { describe, expect, it } from 'vitest';

import { preloaderCopy } from './preloaderSequence';

describe('preloader copy', () => {
  it('uses a short Chinese-first identity sequence', () => {
    expect(preloaderCopy.sequence).toEqual(['朱翊嘉', '游戏作品集']);
  });

  it('uses restrained Chinese loading labels', () => {
    expect(preloaderCopy.loading).toBe('载入');
    expect(preloaderCopy.context).toBe('GAME DESIGN PORTFOLIO');
  });
});
