import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from './routeObjects';

describe('archive page semantics', () => {
  it('renders the selected project directory as a real ordered list', () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] });
    const markup = renderToStaticMarkup(<RouterProvider router={router} />);

    expect(markup).toContain('<ol class="archive-project-list"');
    expect(markup).not.toContain('<div class="archive-project-list"><li');
  });
});
