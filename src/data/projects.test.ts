import { describe, expect, it } from 'vitest';
import {
  getFeaturedProjects,
  getLegacyWorkGroups,
  getPublicProjects,
  portfolioProjects,
} from './projects';

describe('portfolio project data', () => {
  it('keeps every project id and slug unique', () => {
    const ids = portfolioProjects.map((project) => project.id);
    const slugs = portfolioProjects.map((project) => project.slug);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('derives the 22 currently public projects from one source', () => {
    expect(getPublicProjects()).toHaveLength(22);
  });

  it('marks both selected games as featured personal projects', () => {
    const selectedGames = getFeaturedProjects('selected-games');

    expect(selectedGames.map((project) => project.slug)).toEqual([
      'echoflash',
      'erasers-odyssey',
    ]);
    expect(selectedGames.every((project) => project.ownership === 'personal')).toBe(true);
    expect(selectedGames.every((project) => project.primaryCategory === 'game')).toBe(true);
  });

  it('derives the legacy groups without duplicate project lists', () => {
    const groups = getLegacyWorkGroups();

    expect(groups.map((group) => [group.id, group.projects.length])).toEqual([
      ['work-design', 6],
      ['work-game', 5],
      ['work-code', 11],
    ]);
  });
});
