// @vitest-environment node
import { parseApiError } from '../../api/errors';
import { LOGIN_MESSAGES, loginErrorMessage } from './loginErrorMessage';

function apiError(status: number, body: unknown) {
  return parseApiError({ status }, body);
}

describe('loginErrorMessage', () => {
  it('mostra a mensagem de muitas tentativas num 429 com code desconhecido', () => {
    expect(loginErrorMessage(apiError(429, { code: 'LIMITE_NOVO' }))).toBe(
      LOGIN_MESSAGES.tooManyRequests,
    );
  });

  it('mostra a mensagem genérica num 401 com code desconhecido', () => {
    expect(loginErrorMessage(apiError(401, { code: 'ACCOUNT_LOCKED' }))).toBe(
      LOGIN_MESSAGES.generic,
    );
  });

  it('mostra a mensagem genérica num 4xx sem code (UNKNOWN)', () => {
    expect(loginErrorMessage(apiError(403, ''))).toBe(LOGIN_MESSAGES.generic);
  });

  it('mostra a mensagem de validação num 400 sem code (UNKNOWN)', () => {
    expect(loginErrorMessage(apiError(400, ''))).toBe(
      LOGIN_MESSAGES.validation,
    );
  });

  it('mostra a mensagem de servidor no INTERNAL_ERROR com corpo', () => {
    expect(
      loginErrorMessage(
        apiError(500, {
          code: 'INTERNAL_ERROR',
          message: 'Erro interno do servidor',
        }),
      ),
    ).toBe(LOGIN_MESSAGES.server);
  });

  it('mostra a mensagem de servidor num 502 com HTML de proxy', () => {
    expect(
      loginErrorMessage(apiError(502, '<html><body>Bad Gateway</body></html>')),
    ).toBe(LOGIN_MESSAGES.server);
  });

  it('mostra a mensagem de falta de conexão para um erro que não é ApiError', () => {
    expect(loginErrorMessage(new TypeError('Failed to fetch'))).toBe(
      LOGIN_MESSAGES.network,
    );
  });
});
