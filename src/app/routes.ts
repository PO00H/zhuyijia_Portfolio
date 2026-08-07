export const sitePaths = {
  home: '/',
  selectedGames: '/#selected-games',
  works: '/works',
  about: '/about',
  contact: '/#contact',
  legacy: '/legacy',
} as const;

export const siteNavigation = [
  { label: '首页', to: sitePaths.home },
  { label: '精选游戏', to: sitePaths.selectedGames },
  { label: '全部作品', to: sitePaths.works },
  { label: '关于', to: sitePaths.about },
  { label: '联系', to: sitePaths.contact },
] as const;

export function getProjectPath(slug: string): string {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    throw new Error('Project slug is required');
  }

  return `${sitePaths.works}/${encodeURIComponent(normalizedSlug)}`;
}
