import type { QueryClient } from '@tanstack/react-query';
import type { createBrowserRouter } from 'react-router';
import { setOnUnauthorized } from '../../api/client';
import { isLoginPath, loginPathFrom } from './safeRedirect';

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
    const current = `${pathname}${search}${hash}`;
    // Já no login (token velho ao abrir /login, ou /auth/me logo depois do
    // login): fica no mesmo caminho, sem aninhar outro from. Navega para ele
    // mesmo só para a tela renderizar de novo: nem o clear() (que não avisa
    // os observers da query removida) nem o token apagado fazem isso, e a
    // tela ficaria presa em "Carregando…".
    void router.navigate(
      isLoginPath(pathname) ? current : loginPathFrom(current),
      {
        replace: true,
      },
    );
  });
  return () => setOnUnauthorized(null);
}
