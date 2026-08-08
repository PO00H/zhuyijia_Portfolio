import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from './routeObjects';

function renderRoute(pathname: string): string {
  const router = createMemoryRouter(appRoutes, { initialEntries: [pathname] });
  return renderToStaticMarkup(<RouterProvider router={router} />);
}

describe('final supplied-design contract', () => {
  it('uses the dark archive shell and Chinese-first identity', () => {
    const markup = renderRoute('/');
    expect(markup).toContain('class="archive-home"');
    expect(markup).toContain('class="archive-hero"');
    expect(markup).toContain('游戏设计师');
    expect(markup).toContain('技术美术');
  });

  it('keeps original game documents and a non-project future slot', () => {
    const markup = renderRoute('/');
    expect((markup.match(/data-selected-game=/g) ?? [])).toHaveLength(2);
    expect(markup).toContain('href="/embed/echoflash-detail/index.html"');
    expect(markup).toContain('href="/embed/eraser-odyssey/index.html"');
    expect(markup).toContain('data-project-placeholder="true"');
  });

  it('uses distinct prototype rhythms for Lab, Worlds, and Tools', () => {
    const markup = renderRoute('/');
    expect(markup).toContain('class="archive-card-grid archive-card-grid--three"');
    expect(markup).toContain('class="archive-paper-section"');
    expect(markup).toContain('class="archive-card-grid archive-card-grid--two"');
  });

  it('provides the warm-paper works archive and real filters', () => {
    const markup = renderRoute('/works');
    expect(markup).toContain('class="archive-works archive-paper-page"');
    expect(markup).toContain('全部作品');
    expect(markup).toContain('工具与系统');
    expect(markup).toContain('aria-pressed="true"');
  });

  it('keeps verified background information private-field free', () => {
    const markup = renderRoute('/about');
    expect(markup).toContain('北京林业大学');
    expect(markup).toContain('北京格拉菲克斯 — Meshy.ai');
    expect(markup).not.toContain('21岁');
    expect(markup).not.toContain('13757722815');
    expect(markup).not.toContain('户籍');
    expect(markup).not.toContain('微信');
  });
});
