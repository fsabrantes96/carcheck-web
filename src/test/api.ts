import { http, HttpResponse } from 'msw';
import type { components } from '../api/schema';

type Schemas = components['schemas'];
export type CurrentUser = Schemas['CurrentUserResponseDto'];
export type LoginBody = Schemas['LoginDto'];
export type LoginResponse = Schemas['LoginResponseDto'];
export type ErrorResponse = Schemas['ErrorResponseDto'];

/**
 * URL da API nos testes: o cliente do app usa /api resolvido contra a origem
 * da página (no jsdom, http://localhost:3000).
 */
export const API_URL = new URL('/api', globalThis.location.href).href;

export const MARIA = {
  token: 'token-da-maria.abc.123',
  user: {
    id: '6f1c2b8e-0000-4000-8000-000000000001',
    name: 'Maria Souza',
    email: 'maria@example.com',
    createdAt: '2026-11-10T12:00:00.000Z',
    roles: ['USER'],
  },
} satisfies { token: string; user: CurrentUser };

export const JOAO = {
  token: 'token-do-joao.def.456',
  user: {
    id: '6f1c2b8e-0000-4000-8000-000000000002',
    name: 'João Lima',
    email: 'joao@example.com',
    createdAt: '2026-11-11T12:00:00.000Z',
    roles: ['USER', 'INSPECTOR'],
  },
} satisfies { token: string; user: CurrentUser };

export function errorBody(
  statusCode: number,
  code: Schemas['ErrorCode'],
  message: string,
): ErrorResponse {
  return {
    statusCode,
    code,
    error: 'Erro',
    message,
    path: '/x',
    timestamp: '2026-11-10T12:00:00.000Z',
  };
}

/** Corpo do LoginResponseDto (o user do login não tem roles). */
export function loginResponse(account: {
  token: string;
  user: CurrentUser;
}): LoginResponse {
  const { id, name, email, createdAt } = account.user;
  return { accessToken: account.token, user: { id, name, email, createdAt } };
}

/** GET /auth/me respondendo sempre o mesmo usuário; conta as chamadas. */
export function respondMe(user: CurrentUser) {
  let calls = 0;
  const handler = http.get<never, never, CurrentUser>(
    `${API_URL}/auth/me`,
    () => {
      calls += 1;
      return HttpResponse.json(user);
    },
  );
  return { handler, calls: () => calls };
}

/** GET /auth/me que responde o usuário dono do token do Authorization. */
export function meByToken(...accounts: { token: string; user: CurrentUser }[]) {
  return http.get<never, never, CurrentUser | ErrorResponse>(
    `${API_URL}/auth/me`,
    ({ request }) => {
      const header = request.headers.get('Authorization');
      const account = accounts.find((a) => header === `Bearer ${a.token}`);
      if (!account) {
        return HttpResponse.json(
          errorBody(401, 'UNAUTHENTICATED', 'Token inválido'),
          { status: 401 },
        );
      }
      return HttpResponse.json(account.user);
    },
  );
}

/** POST /auth/login que aceita as contas dadas (pelo e-mail). */
export function loginByEmail(
  ...accounts: { token: string; user: CurrentUser }[]
) {
  return http.post<never, LoginBody, LoginResponse | ErrorResponse>(
    `${API_URL}/auth/login`,
    async ({ request }) => {
      const body = await request.json();
      const account = accounts.find((a) => a.user.email === body.email);
      if (!account) {
        return HttpResponse.json(
          errorBody(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos'),
          { status: 401 },
        );
      }
      return HttpResponse.json(loginResponse(account));
    },
  );
}

/** Promessa que o teste resolve quando quiser (resposta "em andamento"). */
export function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
