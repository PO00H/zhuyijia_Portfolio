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
    expect(markup).toContain('>游戏</span>');
    expect(markup).toContain('>设计师</span>');
    expect(markup).toContain('精选游戏');
    expect(markup).toContain('白夜瞬闪');
    expect(markup).toContain('橡皮奥德赛');
    expect(markup).toContain('id="contact"');
  });

  it('keeps the hero flat and free of background media', () => {
    const markup = renderRoute('/');

    expect(markup).not.toContain('<video');
    expect(markup).not.toContain('/previews/echoflash.mp4');
    expect(markup).not.toContain('hero-stage__media');
  });

  it('links both game covers directly to their original web presentations', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('src="/covers/echoflash.png"');
    expect(markup).toContain('src="/covers/eraser-odyssey.png"');
    expect(markup).toContain('href="/embed/echoflash-detail/index.html"');
    expect(markup).toContain('href="/embed/eraser-odyssey/index.html"');
    expect(markup).not.toContain('href="/works/echoflash"');
  });

  it('uses an editorial hero and two selected-game directory rows', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('portfolio-hero__title');
    expect((markup.match(/data-selected-game=/g) ?? []).length).toBe(2);
    expect(markup).toContain('selected-games-directory');
    expect(markup).toContain('data-cursor="view"');
    expect(markup).not.toContain('featured-game__copy');
  });

  it('mounts the shared interaction shell', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('data-portfolio-cursor="true"');
    expect(markup).toContain('class="site-route');
    expect(markup).toContain('aria-label="打开菜单"');
  });

  it('renders the three confirmed support sections', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('id="gameplay-lab"');
    expect(markup).toContain('id="worlds"');
    expect(markup).toContain('id="tools"');
    expect((markup.match(/data-support-kind="gameplay"/g) ?? []).length).toBe(3);
    expect(markup).toContain('data-support-project="stonecity"');
    expect(markup).toContain('data-support-project="tajima-cutter"');
    expect(markup).toContain('data-support-project="newface"');
    expect(markup).toContain('href="/embed/newface/index.html"');
  });

  it('keeps unconfirmed support content off the homepage', () => {
    const markup = renderRoute('/');

    expect(markup).not.toContain('《Peak》');
    expect(markup).not.toContain('银翼杀手');
    expect(markup).not.toContain('Meshy');
    expect(markup).not.toContain('Synthwave OS');
  });

  it('does not load support videos or 3D frames before user input', () => {
    const markup = renderRoute('/');

    expect(markup).not.toContain('<video');
    expect(markup).not.toContain('<iframe');
    expect(markup).toContain('data-preview-src="/videos/UE1.mp4"');
    expect(markup).toContain('data-preview-src="/videos/002.mp4"');
  });

  it('renders the works archive directly in Chinese', () => {
    const markup = renderRoute('/works');
    expect(markup).toContain('全部作品');
    expect(markup).toContain('class="works-archive"');
  });

  it('renders the about archive directly in Chinese', () => {
    const markup = renderRoute('/about');
    expect(markup).toContain('关于我');
    expect(markup).toContain('北京林业大学');
  });

  it('keeps a direct fallback on the old ECHOFLASH project route', () => {
    const markup = renderRoute('/works/echoflash');

    expect(markup).toContain('正在打开原项目网页');
    expect(markup).toContain('href="/embed/echoflash-detail/index.html"');
    expect(markup).not.toContain('<iframe');
  });

  it('keeps a direct fallback on the old Eraser’s Odyssey project route', () => {
    const markup = renderRoute('/works/erasers-odyssey');

    expect(markup).toContain('正在打开原项目网页');
    expect(markup).toContain('href="/embed/eraser-odyssey/index.html"');
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
