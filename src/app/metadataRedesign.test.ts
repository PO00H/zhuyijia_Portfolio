import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { getRouteMetadata } from './routeMetadata';

describe('redesign metadata', () => {
  it('uses the requested professional title and Chinese-first description', () => {
    expect(getRouteMetadata('/')).toEqual({
      title: 'Zhu Yijia — Game Designer & Technical Artist',
      description: '朱翊嘉的游戏作品集，聚焦玩法系统、交互体验、实时世界与技术实现。',
    });
  });

  it('keeps the static document metadata aligned with route metadata', () => {
    const documentSource = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

    expect(documentSource).toContain('<html lang="zh-CN">');
    expect(documentSource).toContain('<title>Zhu Yijia — Game Designer &amp; Technical Artist</title>');
    expect(documentSource).toContain('content="朱翊嘉的游戏作品集，聚焦玩法系统、交互体验、实时世界与技术实现。"');
    expect(documentSource).toContain('name="theme-color" content="#11110f"');
  });
});
