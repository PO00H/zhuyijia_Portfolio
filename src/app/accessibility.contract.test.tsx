import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from './routeObjects';

function renderRoute(pathname: string): string {
  const router = createMemoryRouter(appRoutes, { initialEntries: [pathname] });
  return renderToStaticMarkup(<RouterProvider router={router} />);
}

describe('archive accessibility and loading contract', () => {
  it('uses one main landmark on About', () => {
    const markup = renderRoute('/about');
    expect((markup.match(/<main\b/g) ?? [])).toHaveLength(1);
  });

  it('uses a valid definition list for project facts', () => {
    const markup = renderRoute('/works/stonecity');
    expect(markup).toContain('<dl class="archive-project__facts"');
    expect(markup).not.toContain('<section class="archive-project__facts"');
  });

  it('does not server-render floating Works previews before hover', () => {
    const markup = renderRoute('/works');
    expect(markup).not.toContain('class="archive-project-row__preview"');
  });

  it('provides a live copy status and a mail fallback', () => {
    const markup = renderRoute('/');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('href="mailto:1002520702@qq.com"');
  });
});
