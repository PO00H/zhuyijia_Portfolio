import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppRouter } from './app/AppRouter';
import './index.css';
import './styles/archive-design.css';
import './styles/archive-pages.css';
import './styles/archive-project.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
