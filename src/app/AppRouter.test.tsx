import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from './routeObjects';
import { getProjectPath, siteNavigation, sitePaths } from './routes';

function renderRoute(pathname: string): string {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [pathname],
  });

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

describe('app router', () => {
  it('renders a Chinese-first game-designer home page', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('朱翊嘉');
    expect(markup).toContain('游戏设计师');
    expect(markup).toContain('精选游戏');
    expect(markup).toContain('白夜瞬闪');
    expect(markup).toContain('橡皮奥德赛');
    expect(markup).toContain('id="contact"');
  });

  it('uses real game media and project routes on the home page', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('src="/covers/echoflash.png"');
    expect(markup).toContain('src="/covers/eraser-odyssey.png"');
    expect(markup).toContain('href="/works/echoflash"');
    expect(markup).toContain('href="/works/erasers-odyssey"');
  });

  it('renders the works page directly in Chinese', () => {
    expect(renderRoute('/works')).toContain('全部作品');
  });

  it('renders the about page directly in Chinese', () => {
    expect(renderRoute('/about')).toContain('关于我');
  });

  it('embeds the existing ECHOFLASH web presentation', () => {
    const markup = renderRoute('/works/echoflash');

    expect(markup).toContain('个人作品');
    expect(markup).toContain('src="/embed/echoflash-detail/index.html"');
    expect(markup).toContain('打开独立展示');
  });

  it('embeds the existing Eraser’s Odyssey web presentation', () => {
    expect(renderRoute('/works/erasers-odyssey')).toContain(
      'src="/embed/eraser-odyssey/index.html"',
    );
  });

  it('shows a Chinese not-found state for a missing project', () => {
    expect(renderRoute('/works/not-a-project')).toContain('项目不存在');
  });

  it('keeps the previous site available during migration', () => {
    expect(renderRoute('/legacy')).toContain('正在加载旧版作品集');
  });

  it('shows a Chinese not-found page for an unknown route', () => {
    expect(renderRoute('/missing-page')).toContain('页面不存在');
  });
});
