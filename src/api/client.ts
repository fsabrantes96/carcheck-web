import createClient, { type Middleware } from 'openapi-fetch';
import { parseApiError } from './errors';
import type { paths } from './schema';
import { tokenStore } from './tokenStore';

/**
 * As rotas do back não têm prefixo /api. Em dev e no preview, o proxy do
 * Vite recebe /api e repassa para http://localhost:3000 sem o prefixo.
 */
export const API_BASE_URL = '/api';

const BEARER_PREFIX = 'Bearer ';

let onUnauthorized: (() => void) | null = null;

// Token que cada requisição levou, lido no onRequest. O 401 é comparado com
// ele, não com o texto do header: o Headers corta espaços das pontas do valor.
const tokenSentBy = new WeakMap<Request, string>();

/**
 * Registra o que fazer quando a sessão cai (401 numa requisição que levou
 * token), por exemplo mandar para o login. `null` remove o callback.
 */
export function setOnUnauthorized(callback: (() => void) | null): void {
  onUnauthorized = callback;
}

// Rotas que nunca levam o Bearer. Sem token enviado, um 401 delas (senha
// errada) não é tratado como sessão caindo: o token atual continua e o
// onUnauthorized não é chamado. Tipadas pelo contrato: rota renomeada no
// back vira erro de tipo.
const NO_AUTH_PATHS: ReadonlySet<string> = new Set<keyof paths>([
  '/auth/login',
  '/auth/register',
]);

const authMiddleware: Middleware = {
  onRequest({ request, schemaPath }) {
    if (NO_AUTH_PATHS.has(schemaPath)) return request;
    const token = tokenStore.get();
    if (token) {
      request.headers.set('Authorization', `${BEARER_PREFIX}${token}`);
      tokenSentBy.set(request, token);
    }
    return request;
  },
  onResponse({ request, response }) {
    if (response.status !== 401) return;
    const sentToken = tokenSentBy.get(request);
    // 401 sem token (ex.: login com senha errada) não é sessão caindo.
    if (sentToken === undefined) return;
    // Se outro login gravou um token novo enquanto esta requisição estava
    // em andamento, o 401 é do token antigo: não derruba a sessão nova.
    if (tokenStore.get() !== sentToken) return;
    tokenStore.clear();
    onUnauthorized?.();
  },
};

/** Cliente tipado pelo contrato (src/api/schema.d.ts). */
export function createApiClient({
  baseUrl = API_BASE_URL,
}: { baseUrl?: string } = {}) {
  const client = createClient<paths>({
    baseUrl,
    // Busca o fetch global a cada chamada: o openapi-fetch guardaria a
    // referência de quando o cliente foi criado, e um fetch instalado depois
    // (MSW nos testes, polyfill) seria ignorado.
    fetch: (input: Request, init?: RequestInit) =>
      globalThis.fetch(input, init),
  });
  client.use(authMiddleware);
  return client;
}

export const api = createApiClient();

type FetchResult<T> = {
  data?: T;
  error?: unknown;
  response: Response;
};

/**
 * Devolve os dados de uma resposta 2xx ou lança ApiError (com o code do
 * corpo) nas demais. Use nas queryFn/mutationFn do TanStack Query:
 * `queryFn: () => unwrap(api.GET('/auth/me'))`.
 *
 * - Um 2xx sem corpo (204) devolve `undefined`.
 * - Falha de rede ou requisição cancelada não é ApiError: o fetch rejeita
 *   com TypeError/AbortError, que passa direto. Quem trata o erro precisa de
 *   um ramo para "não é ApiError".
 */
export async function unwrap<T>(request: Promise<FetchResult<T>>): Promise<T> {
  const { data, error, response } = await request;
  if (!response.ok) throw parseApiError(response, error);
  return data as T;
}
