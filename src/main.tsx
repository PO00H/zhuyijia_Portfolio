import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppRouter } from './app/AppRouter';
import './index.css';
import './styles/tokens.css';
import './styles/shell.css';
import './styles/phase3.css';
import './styles/typography.css';
import './styles/interactions.css';
import './styles/editorial.css';
import './styles/redesign-home.css';
import './styles/redesign-support.css';
import './styles/redesign-works.css';
import './styles/redesign-pages.css';
import './styles/redesign-project.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
