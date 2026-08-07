import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from './routeObjects';

function renderRoute(pathname: string): string {
  const router = createMemoryRouter(appRoutes, { initialEntries: [pathname] });
  return renderToStaticMarkup(<RouterProvider router={router} />);
}

describe('full portfolio redesign contract', () => {
  it('uses a quiet Chinese-first identity hero and a mobile menu trigger', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('class="portfolio-hero"');
    expect(markup).toContain('>游戏</span>');
    expect(markup).toContain('>设计师</span>');
    expect(markup).toContain('专注玩法系统、交互体验与实时世界');
    expect(markup).toContain('aria-label="打开菜单"');
    expect(markup).not.toContain('hero-stage__characters');
  });

  it('renders exactly two selected-game directory rows and keeps original sites', () => {
    const markup = renderRoute('/');

    expect((markup.match(/data-selected-game=/g) ?? [])).toHaveLength(2);
    expect(markup).toContain('class="selected-game-row');
    expect(markup).toContain('href="/embed/echoflash-detail/index.html"');
    expect(markup).toContain('href="/embed/eraser-odyssey/index.html"');
    expect(markup).not.toContain('<video');
    expect(markup).not.toContain('<iframe');
  });

  it('uses distinct visual rhythms for the three supporting sections', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('class="capability-strip capability-strip--lab"');
    expect(markup).toContain('class="capability-strip capability-strip--worlds"');
    expect(markup).toContain('class="capability-strip capability-strip--tools"');
  });

  it('provides a filterable editorial works archive with dynamic counts', () => {
    const markup = renderRoute('/works');

    expect(markup).toContain('class="works-archive"');
    expect(markup).toContain('全部作品');
    expect(markup).toContain('游戏');
    expect(markup).toContain('技术美术');
    expect(markup).toContain('工具与系统');
    expect(markup).toContain('网页实验');
    expect(markup).toContain('aria-pressed="true"');
  });

  it('moves confirmed background information to About without private fields', () => {
    const markup = renderRoute('/about');

    expect(markup).toContain('北京林业大学');
    expect(markup).toContain('北京格拉菲克斯 — Meshy.ai');
    expect(markup).toContain('浙江无端科技有限公司');
    expect(markup).toContain('全国大学生机器人创意大赛');
    expect(markup).not.toContain('21岁');
    expect(markup).not.toContain('13757722815');
    expect(markup).not.toContain('户籍');
    expect(markup).not.toContain('微信');
  });
});
