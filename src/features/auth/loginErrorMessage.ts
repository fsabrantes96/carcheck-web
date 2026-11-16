import { ApiError, hasCode } from '../../api/errors';

export const LOGIN_MESSAGES = {
  invalidCredentials: 'E-mail ou senha inválidos.',
  validation: 'Confira o e-mail e a senha informados.',
  tooManyRequests: 'Muitas tentativas. Aguarde um minuto e tente de novo.',
  server: 'O servidor está com problemas. Tente de novo em instantes.',
  network:
    'Sem conexão com o servidor. Verifique sua internet e tente de novo.',
  generic: 'Não foi possível entrar. Tente de novo.',
} as const;

/**
 * Mensagem da tela de login para um erro qualquer. Decide pelo code
 * (hasCode), nunca pelo texto do back; code desconhecido cai no status
 * HTTP. O que não é ApiError (rede caindo, requisição cancelada) vira a
 * mensagem de falta de conexão.
 */
export function loginErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return LOGIN_MESSAGES.network;
  // Lido antes: o hasCode é type guard e, no ramo falso, o TypeScript
  // estreita o error para never.
  const { status } = error;
  if (hasCode(error, 'INVALID_CREDENTIALS')) {
    return LOGIN_MESSAGES.invalidCredentials;
  }
  if (hasCode(error, 'VALIDATION_FAILED')) return LOGIN_MESSAGES.validation;
  if (hasCode(error, 'TOO_MANY_REQUESTS')) {
    return LOGIN_MESSAGES.tooManyRequests;
  }
  if (hasCode(error, 'INTERNAL_ERROR')) return LOGIN_MESSAGES.server;
  // Code desconhecido (ou outro code que a tela não trata): pelo status.
  if (status >= 500) return LOGIN_MESSAGES.server;
  if (status === 429) return LOGIN_MESSAGES.tooManyRequests;
  return LOGIN_MESSAGES.generic;
}
