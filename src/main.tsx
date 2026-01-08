/**
 * Einstiegspunkt der React-Anwendung.
 *
 * Initialisiert das React-Root-Element und rendert die App-Komponente.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
