import { getPublicProjects } from '../data/projects';

export interface RouteMetadataValue {
  title: string;
  description: string;
}

const homeMetadata: RouteMetadataValue = {
  title: 'Zhu Yijia — Game Designer',
  description: 'Zhu Yijia is a game designer creating playable systems, prototypes, and technical art.',
};

export function getRouteMetadata(pathname: string): RouteMetadataValue {
  if (pathname === '/') {
    return homeMetadata;
  }

  if (pathname === '/works') {
    return {
      title: 'All Works — Zhu Yijia',
      description: 'Games, interactive systems, technical art, and selected web work by Zhu Yijia.',
    };
  }

  if (pathname === '/about') {
    return {
      title: 'About — Zhu Yijia',
      description: 'About Zhu Yijia, a game designer working across mechanics, prototypes, and technical art.',
    };
  }

  if (pathname.startsWith('/works/')) {
    const slug = decodeURIComponent(pathname.slice('/works/'.length));
    const project = getPublicProjects().find((candidate) => candidate.slug === slug);

    if (project) {
      return {
        title: `${project.title} — Zhu Yijia`,
        description: project.summary,
      };
    }

    return {
      title: 'Project Not Found — Zhu Yijia',
      description: homeMetadata.description,
    };
  }

  if (pathname === '/legacy') {
    return {
      title: 'Previous Portfolio — Zhu Yijia',
      description: 'Previous version of Zhu Yijia’s portfolio.',
    };
  }

  return {
    title: 'Page Not Found — Zhu Yijia',
    description: homeMetadata.description,
  };
}
