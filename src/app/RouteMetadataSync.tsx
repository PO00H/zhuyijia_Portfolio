import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getRouteMetadata } from './routeMetadata';

export function RouteMetadataSync() {
  const { pathname } = useLocation();
  const metadata = getRouteMetadata(pathname);

  useEffect(() => {
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description);
  }, [metadata.description, metadata.title]);

  return null;
}
