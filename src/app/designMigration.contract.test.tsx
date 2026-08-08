import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from './routeObjects';

function renderRoute(pathname: string): string {
  const router = createMemoryRouter(appRoutes, { initialEntries: [pathname] });
  return renderToStaticMarkup(<RouterProvider router={router} />);
}

describe('supplied archive design migration', () => {
  it('uses the supplied archive shell and Chinese-first two-line hero', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('class="archive-home"');
    expect(markup).toContain('class="archive-hero');
    expect(markup).toContain('游戏设计师');
    expect(markup).toContain('技术美术');
    expect(markup).toContain('data-archive-navigation="true"');
  });

  it('keeps two verified games and one non-project future slot', () => {
    const markup = renderRoute('/');

    expect((markup.match(/data-selected-game=/g) ?? [])).toHaveLength(2);
    expect(markup).toContain('href="/embed/echoflash-detail/index.html"');
    expect(markup).toContain('href="/embed/eraser-odyssey/index.html"');
    expect((markup.match(/data-project-placeholder="true"/g) ?? [])).toHaveLength(1);
    expect(markup).toContain('待公开作品');
  });

  it('fills every designed home section with real local portfolio media', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('id="gameplay-lab"');
    expect(markup).toContain('id="worlds"');
    expect(markup).toContain('id="tools"');
    expect(markup).toContain('id="contact"');
    expect(markup).toContain('/posters/stonecity.jpg');
    expect(markup).toContain('/covers/newface.webp');
    expect(markup).toContain('/covers/frontend-001.webp');
    expect(markup).not.toContain('images.unsplash.com');
  });

  it('uses the supplied paper archive treatment for Works and real filters', () => {
    const markup = renderRoute('/works');

    expect(markup).toContain('class="archive-works');
    expect(markup).toContain('全部作品');
    expect(markup).toContain('游戏');
    expect(markup).toContain('技术美术');
    expect(markup).toContain('工具与系统');
    expect(markup).toContain('网页实验');
  });

  it('uses the supplied editorial About composition with verified profile data', () => {
    const markup = renderRoute('/about');

    expect(markup).toContain('class="archive-about');
    expect(markup).toContain('北京林业大学');
    expect(markup).toContain('北京格拉菲克斯 — Meshy.ai');
    expect(markup).toContain('1002520702@qq.com');
    expect(markup).not.toContain('ShanghaiTech University');
  });
});
