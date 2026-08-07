import { getPublicProjects } from '../data/projects';

export interface RouteMetadataValue {
  title: string;
  description: string;
}

const homeMetadata: RouteMetadataValue = {
  title: '朱翊嘉｜游戏设计师',
  description: '朱翊嘉的个人作品集，聚焦游戏设计、玩法原型与技术美术。',
};

export function getRouteMetadata(pathname: string): RouteMetadataValue {
  if (pathname === '/') {
    return homeMetadata;
  }

  if (pathname === '/works') {
    return {
      title: '全部作品｜朱翊嘉',
      description: '浏览朱翊嘉的游戏、交互系统、技术美术与网页实验。',
    };
  }

  if (pathname === '/about') {
    return {
      title: '关于｜朱翊嘉',
      description: '了解游戏设计师朱翊嘉的主要方向与辅助能力。',
    };
  }

  if (pathname.startsWith('/works/')) {
    const slug = decodeURIComponent(pathname.slice('/works/'.length));
    const project = getPublicProjects().find((candidate) => candidate.slug === slug);

    if (project) {
      return {
        title: `${project.title}｜朱翊嘉`,
        description: project.summary || homeMetadata.description,
      };
    }

    return {
      title: '项目不存在｜朱翊嘉',
      description: homeMetadata.description,
    };
  }

  if (pathname === '/legacy') {
    return {
      title: '旧版作品集｜朱翊嘉',
      description: '朱翊嘉个人作品集的旧版页面。',
    };
  }

  return {
    title: '页面不存在｜朱翊嘉',
    description: homeMetadata.description,
  };
}
