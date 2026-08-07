import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppRouter } from './app/AppRouter';
import './index.css';
import './styles/tokens.css';
import './styles/shell.css';
import './styles/phase3.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
