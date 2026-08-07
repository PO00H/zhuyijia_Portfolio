export const sitePaths = {
  home: '/',
  works: '/works',
  about: '/about',
  legacy: '/legacy',
} as const;

export const siteNavigation = [
  { label: 'Home', to: sitePaths.home },
  { label: 'Works', to: sitePaths.works },
  { label: 'About', to: sitePaths.about },
] as const;

export function getProjectPath(slug: string): string {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    throw new Error('Project slug is required');
  }

  return `${sitePaths.works}/${encodeURIComponent(normalizedSlug)}`;
}
