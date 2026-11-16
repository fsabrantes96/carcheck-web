import { queryOptions, useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../../api/client';
import { tokenStore } from '../../api/tokenStore';

export const CURRENT_USER_KEY = ['auth', 'me'] as const;

/**
 * Usuário atual (GET /auth/me). É a única fonte da verdade da sessão no
 * front: não há cópia em Context. Sem nova tentativa automática: um 401 já
 * derruba a sessão no cliente e, em rede ou 5xx, a tela oferece "Tentar de
 * novo".
 */
export const currentUserQuery = queryOptions({
  queryKey: CURRENT_USER_KEY,
  queryFn: () => unwrap(api.GET('/auth/me')),
  retry: false,
  // O login já busca o usuário: sem isto, a rota protegida buscaria de novo
  // ao montar. 30 s ainda deixam uma mudança de roles aparecer logo.
  staleTime: 30_000,
});

/**
 * Lê o usuário atual. Só busca quando há token: sem token não há sessão, e
 * um GET /auth/me sem Authorization daria 401 à toa.
 */
export function useCurrentUser() {
  const hasToken = tokenStore.get() !== null;
  return { hasToken, ...useQuery({ ...currentUserQuery, enabled: hasToken }) };
}
