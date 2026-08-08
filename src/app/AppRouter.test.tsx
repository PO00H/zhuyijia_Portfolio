import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from './routeObjects';
import { getProjectPath, siteNavigation, sitePaths } from './routes';

function renderRoute(pathname: string): string {
  const router = createMemoryRouter(appRoutes, { initialEntries: [pathname] });
  return renderToStaticMarkup(<RouterProvider router={router} />);
}

describe('portfolio routes', () => {
  it('uses Chinese-first navigation with distinct destinations', () => {
    expect(siteNavigation).toEqual([
      { label: '首页', to: sitePaths.home },
      { label: '精选游戏', to: sitePaths.selectedGames },
      { label: '全部作品', to: sitePaths.works },
      { label: '关于', to: sitePaths.about },
      { label: '联系', to: sitePaths.contact },
    ]);
    expect(new Set(siteNavigation.map((item) => item.to)).size).toBe(5);
  });

  it('builds canonical project paths', () => {
    expect(getProjectPath('echoflash')).toBe('/works/echoflash');
    expect(getProjectPath('erasers-odyssey')).toBe('/works/erasers-odyssey');
  });

  it('rejects an empty project slug', () => {
    expect(() => getProjectPath('   ')).toThrow('Project slug is required');
  });
});

describe('supplied design app router', () => {
  it('renders the Chinese-first game-design identity', () => {
    const markup = renderRoute('/');
    expect(markup).toContain('朱翊嘉');
    expect(markup).toContain('游戏设计师');
    expect(markup).toContain('技术美术');
    expect(markup).toContain('精选游戏');
    expect(markup).toContain('白夜瞬闪');
    expect(markup).toContain('橡皮奥德赛');
  });

  it('keeps the hero flat and media-free', () => {
    const markup = renderRoute('/');
    expect(markup).toContain('class="archive-hero"');
    expect(markup).not.toContain('<video');
    expect(markup).not.toContain('<iframe');
  });

  it('links both selected games directly to their original webpages', () => {
    const markup = renderRoute('/');
    expect(markup).toContain('href="/embed/echoflash-detail/index.html"');
    expect(markup).toContain('href="/embed/eraser-odyssey/index.html"');
    expect(markup).not.toContain('href="/works/echoflash"');
  });

  it('renders two real game rows and one inert future slot', () => {
    const markup = renderRoute('/');
    expect((markup.match(/data-selected-game=/g) ?? [])).toHaveLength(2);
    expect((markup.match(/data-project-placeholder="true"/g) ?? [])).toHaveLength(1);
    expect(markup).toContain('待公开作品');
  });

  it('mounts the shared interaction shell', () => {
    const markup = renderRoute('/');
    expect(markup).toContain('data-portfolio-cursor="true"');
    expect(markup).toContain('data-archive-navigation="true"');
    expect(markup).toContain('class="archive-route-mask"');
    expect(markup).toContain('aria-label="打开菜单"');
  });

  it('fills all support sections with local real projects', () => {
    const markup = renderRoute('/');
    expect(markup).toContain('id="gameplay-lab"');
    expect(markup).toContain('id="worlds"');
    expect(markup).toContain('id="tools"');
    expect((markup.match(/data-archive-project="(ik-retargeting|iterative-shrink|follow-pointer)"/g) ?? [])).toHaveLength(3);
    expect(markup).toContain('data-archive-project="stonecity"');
    expect(markup).toContain('data-archive-project="peak"');
    expect(markup).toContain('data-archive-project="tajima-cutter"');
    expect(markup).toContain('data-archive-project="newface"');
    expect(markup).toContain('data-archive-project="synthwave-os"');
  });

  it('does not load support media before user input', () => {
    const markup = renderRoute('/');
    expect(markup).not.toContain('<video');
    expect(markup).not.toContain('<iframe');
    expect(markup).toContain('data-preview-src="/videos/UE1.mp4"');
    expect(markup).toContain('data-preview-src="/videos/002.mp4"');
  });

  it('renders Works and About in the supplied archive language', () => {
    expect(renderRoute('/works')).toContain('class="archive-works archive-paper-page"');
    const about = renderRoute('/about');
    expect(about).toContain('class="archive-about archive-paper-page"');
    expect(about).toContain('北京林业大学');
  });

  it('keeps direct fallbacks on both original game routes', () => {
    const echo = renderRoute('/works/echoflash');
    const eraser = renderRoute('/works/erasers-odyssey');
    expect(echo).toContain('正在打开原项目网页');
    expect(echo).toContain('href="/embed/echoflash-detail/index.html"');
    expect(eraser).toContain('href="/embed/eraser-odyssey/index.html"');
  });

  it('keeps migration and not-found fallbacks available', () => {
    expect(renderRoute('/legacy')).toContain('正在加载旧版作品集');
    expect(renderRoute('/works/not-a-project')).toContain('项目不存在');
    expect(renderRoute('/missing-page')).toContain('页面不存在');
  });
});
