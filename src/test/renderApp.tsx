import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { registerSessionHandlers } from '../features/auth/session';
import { createQueryClient } from '../queryClient';
import { routes } from '../routes';
import { trackQueryClient } from './pendingQueries';

/**
 * Monta o app como no main.tsx (mesmas rotas, QueryClient e
 * registerSessionHandlers), com o router em memória a partir de `path`.
 */
export function renderApp(path: string) {
  const queryClient = createQueryClient();
  // O setup espera as buscas deste client terminarem no fim do teste.
  trackQueryClient(queryClient);
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const unregister = registerSessionHandlers(router, queryClient);
  onTestFinished(unregister);
  const user = userEvent.setup();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  /** Caminho atual do router, com query e hash. */
  function currentPath(): string {
    const { pathname, search, hash } = router.state.location;
    return `${pathname}${search}${hash}`;
  }

  return { router, queryClient, user, currentPath };
}
