import { describe, expect, it } from 'vitest';

import { getRouteMetadata } from './routeMetadata';

describe('route metadata', () => {
  it('describes the game-design positioning in Chinese on the home page', () => {
    expect(getRouteMetadata('/')).toEqual({
      title: '朱翊嘉｜游戏设计师',
      description: '朱翊嘉的个人作品集，聚焦游戏设计、玩法原型与技术美术。',
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
