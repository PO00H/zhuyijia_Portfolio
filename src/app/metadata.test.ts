import { describe, expect, it } from 'vitest';

import { getRouteMetadata } from './routeMetadata';

describe('route metadata', () => {
  it('uses the requested professional title on the home page', () => {
    expect(getRouteMetadata('/')).toEqual({
      title: 'Zhu Yijia — Game Designer & Technical Artist',
      description: '朱翊嘉的游戏作品集，聚焦玩法系统、交互体验、实时世界与技术实现。',
    });
  });

  it('uses distinct Chinese titles for works and about', () => {
    expect(getRouteMetadata('/works').title).toBe('全部作品｜朱翊嘉');
    expect(getRouteMetadata('/about').title).toBe('关于｜朱翊嘉');
  });

  it('uses public project data for a project title', () => {
    expect(getRouteMetadata('/works/echoflash').title).toContain('ECHOFLASH');
  });

  it('falls back safely for an unknown route', () => {
    expect(getRouteMetadata('/missing-page').title).toBe('页面不存在｜朱翊嘉');
  });
});
