import { describe, expect, it } from 'vitest';

import { getRouteMetadata } from './routeMetadata';

describe('route metadata', () => {
  it('describes the game-design positioning on the home page', () => {
    expect(getRouteMetadata('/')).toEqual({
      title: 'Zhu Yijia — Game Designer',
      description: 'Zhu Yijia is a game designer creating playable systems, prototypes, and technical art.',
    });
  });

  it('uses distinct titles for works and about', () => {
    expect(getRouteMetadata('/works').title).toBe('All Works — Zhu Yijia');
    expect(getRouteMetadata('/about').title).toBe('About — Zhu Yijia');
  });

  it('uses public project data for a project title', () => {
    expect(getRouteMetadata('/works/echoflash').title).toContain('ECHOFLASH');
  });

  it('falls back safely for an unknown route', () => {
    expect(getRouteMetadata('/missing-page').title).toBe('Page Not Found — Zhu Yijia');
  });
});
