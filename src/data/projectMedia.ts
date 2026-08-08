import { getProjectPath } from '../app/routes';
import type { PortfolioProject } from './projects';

const archivePosters: Record<string, string> = {
  stonecity: '/posters/stonecity.jpg',
  peak: '/posters/peak.jpg',
  'ik-retargeting': '/posters/ik-retargeting.jpg',
  'iterative-shrink': '/posters/iterative-shrink.jpg',
  'follow-pointer': '/posters/follow-pointer.jpg',
  'tajima-cutter': '/textures/T_TAJIMA_BC.png',
};

export function getProjectPreview(project: PortfolioProject): string | undefined {
  return project.cover ?? archivePosters[project.slug];
}

export function getProjectHref(project: PortfolioProject): string {
  return project.iframeUrl ?? getProjectPath(project.slug);
}
