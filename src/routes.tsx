import type { RouteObject } from 'react-router';
import { RequireAuth } from './features/auth/RequireAuth';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    // Rotas que exigem sessão.
    element: <RequireAuth />,
    children: [{ path: '/', element: <HomePage /> }],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <NotFoundPage /> },
];
