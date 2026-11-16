import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import { createApiClient, setOnUnauthorized, unwrap } from './client';
import { ApiError } from './errors';
import { tokenStore } from './tokenStore';

const BASE_URL = 'http://localhost/api';
const TOKEN = 'token-de-teste.abc.123';

const currentUser = {
  id: '6f1c2b8e-0000-4000-8000-000000000001',
  name: 'Maria',
  email: 'maria@example.com',
  createdAt: '2026-11-10T12:00:00.000Z',
  roles: ['USER'],
};

function errorBody(statusCode: number, code: string, message: string) {
  return {
    statusCode,
    code,
    error: 'Erro',
    message,
    path: '/x',
    timestamp: '2026-11-10T12:00:00.000Z',
  };
}

/** Responde GET /auth/me e guarda o header Authorization recebido. */
function captureAuthorization(): { value: string | null | undefined } {
  const captured: { value: string | null | undefined } = { value: undefined };
  server.use(
    http.get(`${BASE_URL}/auth/me`, ({ request }) => {
      captured.value = request.headers.get('Authorization');
      return HttpResponse.json(currentUser);
    }),
  );
  return captured;
}

function respondMeWith401() {
  server.use(
    http.get(`${BASE_URL}/auth/me`, () =>
      HttpResponse.json(errorBody(401, 'UNAUTHENTICATED', 'Token inválido'), {
        status: 401,
      }),
    ),
  );
}

describe('cliente da API', () => {
  // Criado de propósito aqui, antes do server.listen() do setup: assim a
  // suíte também prova que o cliente lê o fetch global a cada chamada (com a
  // referência guardada na criação, as requisições iriam para a rede).
  const api = createApiClient({ baseUrl: BASE_URL });

  beforeEach(() => {
    tokenStore.clear();
  });

  afterEach(() => {
    setOnUnauthorized(null);
  });

  describe('header Authorization', () => {
    it('não envia Authorization quando não há token', async () => {
      const captured = captureAuthorization();

      await api.GET('/auth/me');

      expect(captured.value).toBeNull();
    });

    it('envia Authorization: Bearer <token> quando há token', async () => {
      tokenStore.set(TOKEN);
      const captured = captureAuthorization();

      await api.GET('/auth/me');

      expect(captured.value).toBe(`Bearer ${TOKEN}`);
    });

    it('não envia Authorization no POST /auth/login mesmo com token gravado', async () => {
      tokenStore.set(TOKEN);
      const captured: { value: string | null | undefined } = {
        value: undefined,
      };
      server.use(
        http.post(`${BASE_URL}/auth/login`, ({ request }) => {
          captured.value = request.headers.get('Authorization');
          return HttpResponse.json({
            accessToken: 'token-novo',
            user: {
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              createdAt: currentUser.createdAt,
            },
          });
        }),
      );

      await api.POST('/auth/login', {
        body: { email: 'maria@example.com', password: 'senha12345' },
      });

      expect(captured.value).toBeNull();
    });

    it('não envia Authorization no POST /auth/register mesmo com token gravado', async () => {
      tokenStore.set(TOKEN);
      const captured: { value: string | null | undefined } = {
        value: undefined,
      };
      server.use(
        http.post(`${BASE_URL}/auth/register`, ({ request }) => {
          captured.value = request.headers.get('Authorization');
          return HttpResponse.json(
            errorBody(409, 'EMAIL_ALREADY_REGISTERED', 'E-mail já cadastrado'),
            { status: 409 },
          );
        }),
      );

      await api.POST('/auth/register', {
        body: {
          name: 'Maria',
          email: 'maria@example.com',
          password: 'senha12345',
        },
      });

      expect(captured.value).toBeNull();
    });
  });

  describe('401', () => {
    it('não apaga o token nem chama o onUnauthorized num 401 do POST /auth/login com sessão aberta', async () => {
      tokenStore.set(TOKEN);
      const onUnauthorized = vi.fn();
      setOnUnauthorized(onUnauthorized);
      server.use(
        http.post(`${BASE_URL}/auth/login`, () =>
          HttpResponse.json(
            errorBody(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos'),
            { status: 401 },
          ),
        ),
      );

      await api.POST('/auth/login', {
        body: { email: 'maria@example.com', password: 'senha-errada' },
      });

      expect(tokenStore.get()).toBe(TOKEN);
      expect(onUnauthorized).not.toHaveBeenCalled();
    });

    it('apaga o token e chama o onUnauthorized quando a requisição levou token', async () => {
      tokenStore.set(TOKEN);
      const clearSpy = vi.spyOn(tokenStore, 'clear');
      const onUnauthorized = vi.fn();
      setOnUnauthorized(onUnauthorized);
      respondMeWith401();

      await api.GET('/auth/me');

      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(tokenStore.get()).toBeNull();
      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });

    it('não chama o onUnauthorized num 401 sem token (login com senha errada)', async () => {
      const clearSpy = vi.spyOn(tokenStore, 'clear');
      const onUnauthorized = vi.fn();
      setOnUnauthorized(onUnauthorized);
      server.use(
        http.post(`${BASE_URL}/auth/login`, () =>
          HttpResponse.json(
            errorBody(401, 'INVALID_CREDENTIALS', 'Credenciais inválidas'),
            { status: 401 },
          ),
        ),
      );

      await api.POST('/auth/login', {
        body: { email: 'maria@example.com', password: 'senha-errada' },
      });

      expect(onUnauthorized).not.toHaveBeenCalled();
      expect(clearSpy).not.toHaveBeenCalled();
    });

    it('não apaga um token novo gravado enquanto a requisição antiga estava em andamento', async () => {
      tokenStore.set(TOKEN);
      const onUnauthorized = vi.fn();
      setOnUnauthorized(onUnauthorized);
      server.use(
        http.get(`${BASE_URL}/auth/me`, () => {
          tokenStore.set('token-novo-do-login');
          return HttpResponse.json(
            errorBody(401, 'UNAUTHENTICATED', 'Token inválido'),
            { status: 401 },
          );
        }),
      );

      await api.GET('/auth/me');

      expect(tokenStore.get()).toBe('token-novo-do-login');
      expect(onUnauthorized).not.toHaveBeenCalled();
    });

    it('apaga o token e chama o onUnauthorized mesmo com espaço nas pontas do token', async () => {
      // O Headers tira os espaços das pontas do valor: o 401 precisa ser
      // ligado ao token que a requisição leu, não ao texto do header.
      tokenStore.set(`${TOKEN} `);
      const onUnauthorized = vi.fn();
      setOnUnauthorized(onUnauthorized);
      respondMeWith401();

      await api.GET('/auth/me');

      expect(tokenStore.get()).toBeNull();
      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });

    it('apaga o token sem quebrar quando não há onUnauthorized registrado', async () => {
      tokenStore.set(TOKEN);
      respondMeWith401();

      await expect(api.GET('/auth/me')).resolves.toBeDefined();
      expect(tokenStore.get()).toBeNull();
    });

    it('não chama o onUnauthorized numa resposta 200 com token', async () => {
      tokenStore.set(TOKEN);
      const onUnauthorized = vi.fn();
      setOnUnauthorized(onUnauthorized);
      captureAuthorization();

      await api.GET('/auth/me');

      expect(onUnauthorized).not.toHaveBeenCalled();
      expect(tokenStore.get()).toBe(TOKEN);
    });
  });

  describe('outras falhas', () => {
    it('não apaga o token nem chama o onUnauthorized num 403 com token', async () => {
      tokenStore.set(TOKEN);
      const onUnauthorized = vi.fn();
      setOnUnauthorized(onUnauthorized);
      server.use(
        http.get(`${BASE_URL}/auth/me`, () =>
          HttpResponse.json(errorBody(403, 'FORBIDDEN', 'Sem permissão'), {
            status: 403,
          }),
        ),
      );

      await api.GET('/auth/me');

      expect(tokenStore.get()).toBe(TOKEN);
      expect(onUnauthorized).not.toHaveBeenCalled();
    });

    it('rejeita com erro de rede (não ApiError) sem apagar o token nem chamar o onUnauthorized', async () => {
      tokenStore.set(TOKEN);
      const onUnauthorized = vi.fn();
      setOnUnauthorized(onUnauthorized);
      server.use(http.get(`${BASE_URL}/auth/me`, () => HttpResponse.error()));

      const error = await unwrap(api.GET('/auth/me')).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(TypeError);
      expect(error).not.toBeInstanceOf(ApiError);
      expect(tokenStore.get()).toBe(TOKEN);
      expect(onUnauthorized).not.toHaveBeenCalled();
    });
  });

  describe('unwrap', () => {
    it('devolve os dados de uma resposta 2xx', async () => {
      captureAuthorization();

      const user = await unwrap(api.GET('/auth/me'));

      expect(user.email).toBe('maria@example.com');
    });

    it('transforma um 4xx em ApiError com o code do corpo', async () => {
      const id = '6f1c2b8e-0000-4000-8000-000000000002';
      server.use(
        http.get(`${BASE_URL}/listings/${id}`, () =>
          HttpResponse.json(
            errorBody(404, 'LISTING_NOT_FOUND', 'Anúncio não encontrado'),
            { status: 404 },
          ),
        ),
      );

      const error = await unwrap(
        api.GET('/listings/{id}', { params: { path: { id } } }),
      ).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        status: 404,
        code: 'LISTING_NOT_FOUND',
        message: 'Anúncio não encontrado',
      });
    });

    it('transforma um 4xx com corpo vazio em ApiError UNKNOWN com a mensagem padrão', async () => {
      server.use(
        http.get(
          `${BASE_URL}/auth/me`,
          () => new HttpResponse(null, { status: 403 }),
        ),
      );

      const error = await unwrap(api.GET('/auth/me')).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        status: 403,
        code: 'UNKNOWN',
        message: 'Você não tem permissão para esta ação',
      });
    });

    it('transforma um 502 com HTML de proxy em ApiError UNKNOWN com a mensagem padrão', async () => {
      server.use(
        http.get(
          `${BASE_URL}/auth/me`,
          () =>
            new HttpResponse('<html><body>Bad Gateway</body></html>', {
              status: 502,
              headers: { 'Content-Type': 'text/html' },
            }),
        ),
      );

      const error = await unwrap(api.GET('/auth/me')).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        status: 502,
        code: 'UNKNOWN',
        message: 'Erro no servidor. Tente de novo mais tarde',
      });
    });

    it('preserva um code que o front não conhece vindo da API', async () => {
      server.use(
        http.get(`${BASE_URL}/auth/me`, () =>
          HttpResponse.json(
            errorBody(409, 'CODIGO_NOVO_QUALQUER', 'Algo novo aconteceu'),
            { status: 409 },
          ),
        ),
      );

      const error = await unwrap(api.GET('/auth/me')).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        status: 409,
        code: 'CODIGO_NOVO_QUALQUER',
        message: 'Algo novo aconteceu',
      });
    });
  });
});
