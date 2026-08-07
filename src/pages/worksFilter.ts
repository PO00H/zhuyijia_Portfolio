import type { PortfolioProject, PrimaryCategory } from '../data/projects';

export type WorksFilterId = 'all' | PrimaryCategory;

export const worksFilters: Array<{ id: WorksFilterId; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'game', label: '游戏' },
  { id: 'technical-art', label: '技术美术' },
  { id: 'tools', label: '工具与系统' },
  { id: 'web', label: '网页实验' },
];

const visibilityOrder: Record<PortfolioProject['visibility'], number> = {
  featured: 0,
  secondary: 1,
  'all-works': 2,
  draft: 3,
  private: 4,
  hidden: 5,
};

export function filterWorks(
  filter: WorksFilterId | string,
  projects: PortfolioProject[],
): PortfolioProject[] {
  return projects
    .filter((project) => filter === 'all' || project.primaryCategory === filter)
    .sort((a, b) =>
      b.year - a.year
      || visibilityOrder[a.visibility] - visibilityOrder[b.visibility]
      || a.order - b.order
      || a.title.localeCompare(b.title, 'zh-CN'));
}
