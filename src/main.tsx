import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { registerSessionHandlers } from './features/auth/session';
import './index.css';
import { createQueryClient } from './queryClient';
import { routes } from './routes';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Elemento #root não encontrado');

const router = createBrowserRouter(routes);
const queryClient = createQueryClient();
registerSessionHandlers(router, queryClient);

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
