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
  it('keeps home, works, and about as distinct destinations', () => {
    expect(siteNavigation).toEqual([
      { label: 'Home', to: sitePaths.home },
      { label: 'Works', to: sitePaths.works },
      { label: 'About', to: sitePaths.about },
    ]);
    expect(new Set(siteNavigation.map((item) => item.to)).size).toBe(3);
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
  it('renders the game-designer home page inside the shared shell', () => {
    const markup = renderRoute('/');

    expect(markup).toContain('Game Designer');
    expect(markup).toContain('id="main-content"');
    expect(markup).toContain('href="/works"');
    expect(markup).toContain('href="/about"');
  });

  it('renders the works page directly', () => {
    expect(renderRoute('/works')).toContain('All Works');
  });

  it('renders the about page directly', () => {
    expect(renderRoute('/about')).toContain('About');
  });

  it('renders a public project from its slug', () => {
    const markup = renderRoute('/works/echoflash');

    expect(markup).toContain('ECHOFLASH');
    expect(markup).toContain('Personal Project');
  });

  it('shows a not-found state for a missing project', () => {
    expect(renderRoute('/works/not-a-project')).toContain('Project not found');
  });

  it('keeps the previous site available during migration', () => {
    expect(renderRoute('/legacy')).toContain('Loading previous portfolio');
  });

  it('shows a not-found page for an unknown route', () => {
    expect(renderRoute('/missing-page')).toContain('Page not found');
  });
});
