import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { appRoutes } from './routeObjects';

let browserRouter: ReturnType<typeof createBrowserRouter> | undefined;

export function AppRouter() {
  browserRouter ??= createBrowserRouter(appRoutes);
  return <RouterProvider router={browserRouter} />;
}
