import { sourcePortfolioProjects } from '@/data/portfolioProjects';

export type AssetKind = 'image' | 'video';

export interface AssetLabItem {
  id: string;
  projectId: string;
  projectTitle: string;
  path: string;
  filename: string;
  extension: string;
  kind: AssetKind;
}

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif']);
const videoExtensions = new Set(['mp4', 'webm', 'mov', 'm4v']);

const getExtension = (path: string) => {
  const cleanPath = path.split('?')[0];
  return cleanPath.split('.').pop()?.toLowerCase() ?? '';
};

const getFilename = (path: string) => {
  const cleanPath = path.split('?')[0];
  return decodeURIComponent(cleanPath.split('/').pop() ?? cleanPath);
};

export const assetLabItems: AssetLabItem[] = (() => {
  const seenPaths = new Set<string>();
  const items: AssetLabItem[] = [];

  sourcePortfolioProjects.forEach((project) => {
    if (project.entryKind !== 'project') return;

    const candidates = [project.cover, project.preview, ...project.assetPaths].filter(
      (path): path is string => Boolean(path?.startsWith('/')),
    );

    candidates.forEach((path) => {
      if (seenPaths.has(path)) return;

      const extension = getExtension(path);
      const kind = videoExtensions.has(extension)
        ? 'video'
        : imageExtensions.has(extension)
          ? 'image'
          : null;

      if (!kind) return;

      seenPaths.add(path);
      items.push({
        id: `${project.id}:${path}`,
        projectId: project.id,
        projectTitle: project.title,
        path,
        filename: getFilename(path),
        extension: extension.toUpperCase(),
        kind,
      });
    });
  });

  return items;
})();
