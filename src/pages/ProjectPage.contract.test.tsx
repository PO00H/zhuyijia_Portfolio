import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from '../app/routeObjects';

function renderRoute(pathname: string): string {
  const router = createMemoryRouter(appRoutes, { initialEntries: [pathname] });
  return renderToStaticMarkup(<RouterProvider router={router} />);
}

describe('editorial project archive pages', () => {
  it('renders StoneCity as a static-first case page', () => {
    const markup = renderRoute('/works/stonecity');

    expect(markup).toContain('class="project-case"');
    expect(markup).toContain('src="/posters/stonecity.jpg"');
    expect(markup).toContain('个人职责');
    expect(markup).toContain('能力方向');
    expect(markup).not.toContain('<video');
    expect(markup).not.toContain('<iframe');
  });

  it('keeps Tajima textures lazy and the model user-initiated', () => {
    const markup = renderRoute('/works/tajima-cutter');

    expect(markup).toContain('PBR 纹理通道');
    expect(markup).toContain('src="/textures/T_TAJIMA_BC.png"');
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('加载交互模型');
    expect(markup).not.toContain('<iframe');
  });

  it('keeps original game presentations as direct destinations', () => {
    const echo = renderRoute('/works/echoflash');
    const eraser = renderRoute('/works/erasers-odyssey');

    expect(echo).toContain('href="/embed/echoflash-detail/index.html"');
    expect(eraser).toContain('href="/embed/eraser-odyssey/index.html"');
    expect(echo).not.toContain('<iframe');
    expect(eraser).not.toContain('<iframe');
  });
});
