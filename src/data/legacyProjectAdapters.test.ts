import { describe, expect, it } from 'vitest';
import {
  aiProjects,
  legacyWorkCategories,
  legacyWorkDetails,
  webProjects,
} from './legacyProjectAdapters';

describe('legacy project adapters', () => {
  it('preserves the current detail section groups', () => {
    expect(legacyWorkDetails.map((group) => [group.id, group.projects.length])).toEqual([
      ['work-design', 6],
      ['work-game', 5],
      ['work-code', 11],
    ]);
    expect(legacyWorkDetails[0].projects[0]).toMatchObject({
      id: 'design-001',
      title: '《StoneCity》 石之城',
      videoUrl: '/videos/002.mp4',
    });
  });

  it('preserves the compact works index structure', () => {
    expect(legacyWorkCategories.map((category) => category.subItems.length)).toEqual([6, 5, 2]);
    expect(legacyWorkCategories[1].subItems[0]).toMatchObject({
      targetId: 'game-001',
    });
  });

  it('derives web and AI cards from the canonical source', () => {
    expect(webProjects).toHaveLength(10);
    expect(aiProjects).toHaveLength(1);
    expect(webProjects[0]).toMatchObject({
      id: 'frontend-001',
      title: 'Synthwave OS',
      iframeUrl: '/embed/frontend-001/index.html',
    });
    expect(aiProjects[0].id).toBe('ai-001');
  });
});
