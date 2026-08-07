import { describe, expect, it } from 'vitest';

import { getPublicProjects } from '../data/projects';

interface WorksFilterModule {
  filterWorks: (filter: string, projects: ReturnType<typeof getPublicProjects>) => ReturnType<typeof getPublicProjects>;
  worksFilters: Array<{ id: string; label: string }>;
}

async function loadWorksFilter(): Promise<WorksFilterModule | null> {
  const modulePath = './worksFilter';
  return import(modulePath).catch(() => null) as Promise<WorksFilterModule | null>;
}

describe('works archive filtering', () => {
  it('provides the five Chinese-first archive filters', async () => {
    const filterModule = await loadWorksFilter();

    expect(filterModule).not.toBeNull();
    if (!filterModule) return;
    expect(filterModule.worksFilters).toEqual([
      { id: 'all', label: '全部' },
      { id: 'game', label: '游戏' },
      { id: 'technical-art', label: '技术美术' },
      { id: 'tools', label: '工具与系统' },
      { id: 'web', label: '网页实验' },
    ]);
  });

  it('derives counts and keeps newest work first', async () => {
    const filterModule = await loadWorksFilter();

    expect(filterModule).not.toBeNull();
    if (!filterModule) return;
    const projects = getPublicProjects();

    expect(filterModule.filterWorks('all', projects)).toHaveLength(22);
    expect(filterModule.filterWorks('game', projects)).toHaveLength(5);
    expect(filterModule.filterWorks('technical-art', projects)).toHaveLength(6);
    expect(filterModule.filterWorks('tools', projects)).toHaveLength(1);
    expect(filterModule.filterWorks('web', projects)).toHaveLength(10);
    expect(filterModule.filterWorks('all', projects)[0].year).toBe(2026);
  });
});
