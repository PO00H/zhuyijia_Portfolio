import { getPublicProjects } from '../data/projects';

export interface RouteMetadataValue {
  title: string;
  description: string;
}

const homeMetadata: RouteMetadataValue = {
  title: 'Zhu Yijia — Game Designer & Technical Artist',
  description: '朱翊嘉的游戏作品集，聚焦玩法系统、交互体验、实时世界与技术实现。',
};

export function getRouteMetadata(pathname: string): RouteMetadataValue {
  if (pathname === '/') return homeMetadata;

  if (pathname === '/works') {
    return {
      title: '全部作品｜朱翊嘉',
      description: '浏览朱翊嘉的游戏、技术美术、工具与交互系统和网页实验。',
    };
  }

  if (pathname === '/about') {
    return {
      title: '关于｜朱翊嘉',
      description: '了解游戏设计师朱翊嘉的经历、教育、能力与联系方式。',
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
