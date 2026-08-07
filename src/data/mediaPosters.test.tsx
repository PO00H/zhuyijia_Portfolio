import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { appRoutes } from '../app/routeObjects';

describe('homepage media posters', () => {
  it('renders lightweight posters before video-led support projects are activated', () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] });
    const markup = renderToStaticMarkup(<RouterProvider router={router} />);

    expect(markup).toContain('src="/posters/ik-retargeting.jpg"');
    expect(markup).toContain('src="/posters/iterative-shrink.jpg"');
    expect(markup).toContain('src="/posters/follow-pointer.jpg"');
    expect(markup).toContain('src="/posters/stonecity.jpg"');
    expect(markup).not.toContain('<video');
  });
});
