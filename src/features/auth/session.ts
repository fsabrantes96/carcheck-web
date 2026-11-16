import type { QueryClient } from '@tanstack/react-query';
import type { createBrowserRouter } from 'react-router';
import { setOnUnauthorized } from '../../api/client';
import { LOGIN_PATH, loginPathFrom } from './safeRedirect';

type AppRouter = Pick<
  ReturnType<typeof createBrowserRouter>,
  'state' | 'navigate'
>;

/**
 * Liga a queda da sessão (401 numa requisição que levou token) ao router e
 * ao cache. Recebe o router por parâmetro para o client.ts não importar as
 * rotas (sem import circular). Devolve a função que desfaz o registro.
 */
export function registerSessionHandlers(
  router: AppRouter,
  queryClient: QueryClient,
): () => void {
  setOnUnauthorized(() => {
    // O token já foi apagado pelo cliente. Nada do usuário anterior pode
    // ficar no cache.
    queryClient.clear();
    const { pathname, search, hash } = router.state.location;
    // Já no login (ex.: /auth/me logo depois do login): fica onde está,
    // sem aninhar outro from.
    if (pathname === LOGIN_PATH) return;
    void router.navigate(loginPathFrom(`${pathname}${search}${hash}`), {
      replace: true,
    });
  });
  return () => setOnUnauthorized(null);
}
