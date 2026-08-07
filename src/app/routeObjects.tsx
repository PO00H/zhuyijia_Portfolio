import { Outlet, type RouteObject } from 'react-router-dom';

import { SiteLayout } from '../components/layout/SiteLayout';
import { AboutPage } from '../pages/AboutPage';
import { HomePage } from '../pages/HomePage';
import { LegacyPage } from '../pages/LegacyPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProjectPage } from '../pages/ProjectPage';
import { WorksPage } from '../pages/WorksPage';
import { RouteMetadataSync } from './RouteMetadataSync';

export const appRoutes: RouteObject[] = [
  {
    element: (
      <>
        <RouteMetadataSync />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/legacy',
        element: <LegacyPage />,
      },
      {
        path: '/',
        element: <SiteLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'works', element: <WorksPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'works/:slug', element: <ProjectPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
];
