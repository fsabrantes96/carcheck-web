import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { tokenStore } from '../../api/tokenStore';
import { LOGIN_PATH } from './safeRedirect';

/**
 * Sair. Só no front: o back não tem logout nem revogação de token (risco
 * 10 do back), então o token apagado aqui continua válido até expirar.
 */
export function useLogout(): () => Promise<void> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    tokenStore.clear();
    // Navega antes de limpar o cache: a página protegida desmonta primeiro
    // e nenhum observer recria a busca do usuário que acabou de sair.
    try {
      await navigate(LOGIN_PATH, { replace: true });
    } catch {
      // A navegação falhou: o token já foi apagado, e a rota protegida
      // manda para o login no próximo render. O cache é limpo mesmo assim.
    } finally {
      queryClient.clear();
    }
  }, [navigate, queryClient]);
}
