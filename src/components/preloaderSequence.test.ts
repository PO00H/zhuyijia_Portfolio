import { describe, expect, it } from 'vitest';

import { preloaderCopy } from './preloaderSequence';

describe('preloader copy', () => {
  it('moves from the English brand to the Chinese portfolio identity', () => {
    expect(preloaderCopy.sequence).toEqual(['ZHU YIJIA', '朱翊嘉', '个人作品集']);
  });

  it('uses Chinese loading labels', () => {
    expect(preloaderCopy.loading).toBe('正在载入');
    expect(preloaderCopy.context).toBe('游戏设计作品集');
  });
});
