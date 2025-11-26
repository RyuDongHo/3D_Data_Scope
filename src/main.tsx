/**
 * 애플리케이션 진입점
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { RouterProvider } from './app/providers/RouterProvider';
import { App } from './app/index';
import './app/styles/global.css';
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider>
        <App />
        <Analytics />
      </RouterProvider>
    </ErrorBoundary>
  </StrictMode>
);
