import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { tokenStore } from '../api/tokenStore';
import {
  API_URL,
  errorBody,
  loginByEmail,
  MARIA,
  respondMe,
  type ErrorResponse,
  type LoginBody,
} from '../test/api';
import { renderApp } from '../test/renderApp';
import { server } from '../test/server';

const PASSWORD = 'senha-secreta-123';

async function submitLogin(user: UserEvent, email = MARIA.user.email) {
  await user.type(await screen.findByLabelText('E-mail'), email);
  await user.type(screen.getByLabelText('Senha'), PASSWORD);
  await user.click(screen.getByRole('button', { name: 'Entrar' }));
}

/** POST /auth/login respondendo sempre o mesmo erro; conta as chamadas. */
function respondLoginError(status: number, body: ErrorResponse) {
  let calls = 0;
  server.use(
    http.post<never, LoginBody, ErrorResponse>(`${API_URL}/auth/login`, () => {
      calls += 1;
      return HttpResponse.json(body, { status });
    }),
  );
  return { calls: () => calls };
}

describe('tela de login', () => {
  beforeEach(() => {
    tokenStore.clear();
  });

  describe('formulário', () => {
    it('liga cada campo a um label e usa autocomplete de e-mail e de senha atual', async () => {
      renderApp('/login');

      expect(await screen.findByLabelText('E-mail')).toHaveAttribute(
        'autocomplete',
        'username',
      );
      expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('Senha')).toHaveAttribute(
        'autocomplete',
        'current-password',
      );
      expect(screen.getByLabelText('Senha')).toHaveAttribute(
        'type',
        'password',
      );
    });

    it('usa method post no formulário', async () => {
      renderApp('/login');

      expect(
        await screen.findByRole('form', { name: 'Entrar' }),
      ).toHaveAttribute('method', 'post');
    });

    it('desabilita o botão e mostra "Entrando…" enquanto o login está em andamento', async () => {
      server.use(
        http.post(`${API_URL}/auth/login`, async () => {
          await delay('infinite');
        }),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);

      expect(
        await screen.findByRole('button', { name: 'Entrando…' }),
      ).toBeDisabled();
    });
  });

  describe('login com sucesso', () => {
    it('grava o token e navega para a página inicial', async () => {
      server.use(loginByEmail(MARIA), respondMe(MARIA.user).handler);
      const { user, currentPath } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByText(/Maria Souza/)).toBeInTheDocument();
      expect(currentPath()).toBe('/');
      expect(tokenStore.get()).toBe(MARIA.token);
    });

    it('busca o /auth/me uma vez só num login com sucesso', async () => {
      const me = respondMe(MARIA.user);
      server.use(loginByEmail(MARIA), me.handler);
      const { user, queryClient } = renderApp('/login');

      await submitLogin(user);
      await screen.findByText(/Maria Souza/);
      await waitFor(() => expect(queryClient.isFetching()).toBe(0));

      expect(me.calls()).toBe(1);
    });

    it('remove do cache os dados de antes do login', async () => {
      server.use(loginByEmail(MARIA), respondMe(MARIA.user).handler);
      const { user, queryClient } = renderApp('/login');
      queryClient.setQueryData(['dado-anterior'], 'dado de outra sessão');

      await submitLogin(user);
      await screen.findByText(/Maria Souza/);

      expect(queryClient.getQueryData(['dado-anterior'])).toBeUndefined();
    });

    it('não deixa a senha no cache de mutations depois do login', async () => {
      server.use(loginByEmail(MARIA), respondMe(MARIA.user).handler);
      const { user, queryClient } = renderApp('/login');

      await submitLogin(user);
      await screen.findByText(/Maria Souza/);

      await waitFor(() =>
        expect(
          JSON.stringify(
            queryClient
              .getMutationCache()
              .getAll()
              .map((mutation) => mutation.state.variables),
          ),
        ).not.toContain(PASSWORD),
      );
    });

    it('navega para o from', async () => {
      server.use(loginByEmail(MARIA), respondMe(MARIA.user).handler);
      const { user, currentPath } = renderApp(
        '/login?from=%2Fanuncios%3Fpagina%3D2',
      );

      await submitLogin(user);

      await waitFor(() => expect(currentPath()).toBe('/anuncios?pagina=2'));
    });

    it.each(['//site.com', 'https://site.com', '/\\site.com'])(
      'ignora o from externo %j e navega para a página inicial',
      async (from) => {
        server.use(loginByEmail(MARIA), respondMe(MARIA.user).handler);
        const { user, currentPath } = renderApp(
          `/login?from=${encodeURIComponent(from)}`,
        );

        await submitLogin(user);

        expect(await screen.findByText(/Maria Souza/)).toBeInTheDocument();
        expect(currentPath()).toBe('/');
      },
    );

    it('navega mesmo assim quando o /auth/me falha por rede, e a página mostra o erro sem apagar o token', async () => {
      server.use(
        loginByEmail(MARIA),
        http.get(`${API_URL}/auth/me`, () => HttpResponse.error()),
      );
      const { user, currentPath } = renderApp('/login');

      await submitLogin(user);

      expect(
        await screen.findByRole('button', { name: 'Tentar de novo' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Não foi possível carregar sua sessão.',
      );
      expect(currentPath()).toBe('/');
      expect(tokenStore.get()).toBe(MARIA.token);
    });

    it('navega mesmo assim quando o /auth/me responde 500, e a página mostra o erro sem apagar o token', async () => {
      server.use(
        loginByEmail(MARIA),
        http.get<never, never, ErrorResponse>(`${API_URL}/auth/me`, () =>
          HttpResponse.json(
            errorBody(500, 'INTERNAL_ERROR', 'Erro interno do servidor'),
            { status: 500 },
          ),
        ),
      );
      const { user, currentPath } = renderApp('/login');

      await submitLogin(user);

      expect(
        await screen.findByRole('button', { name: 'Tentar de novo' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Não foi possível carregar sua sessão.',
      );
      expect(currentPath()).toBe('/');
      expect(tokenStore.get()).toBe(MARIA.token);
    });

    it('fica no login sem aninhar o from e mostra a mensagem genérica quando o /auth/me responde 401', async () => {
      server.use(
        loginByEmail(MARIA),
        http.get<never, never, ErrorResponse>(`${API_URL}/auth/me`, () =>
          HttpResponse.json(
            errorBody(401, 'UNAUTHENTICATED', 'Token inválido'),
            { status: 401 },
          ),
        ),
      );
      const { user, currentPath } = renderApp('/login?from=%2Fanuncios');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Não foi possível entrar. Tente de novo.',
      );
      expect(currentPath()).toBe('/login?from=%2Fanuncios');
      expect(tokenStore.get()).toBeNull();
    });
  });

  describe('login com erro', () => {
    it('com sessão aberta, um 401 do login mantém o token, não aninha o from e sai sem Authorization', async () => {
      // Sessão aberta com o /auth/me falhando: a tela mostra o formulário.
      tokenStore.set(MARIA.token);
      let authorization: string | null | undefined;
      server.use(
        http.get<never, never, ErrorResponse>(`${API_URL}/auth/me`, () =>
          HttpResponse.json(
            errorBody(500, 'INTERNAL_ERROR', 'Erro interno do servidor'),
            { status: 500 },
          ),
        ),
        http.post<never, LoginBody, ErrorResponse>(
          `${API_URL}/auth/login`,
          ({ request }) => {
            authorization = request.headers.get('Authorization');
            return HttpResponse.json(
              errorBody(
                401,
                'INVALID_CREDENTIALS',
                'E-mail ou senha inválidos',
              ),
              { status: 401 },
            );
          },
        ),
      );
      const { user, currentPath } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'E-mail ou senha inválidos.',
      );
      expect(tokenStore.get()).toBe(MARIA.token);
      expect(currentPath()).toBe('/login');
      expect(authorization).toBeNull();
    });

    it('mostra a mensagem de credenciais inválidas no INVALID_CREDENTIALS e não muda o token', async () => {
      respondLoginError(
        401,
        errorBody(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos'),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'E-mail ou senha inválidos.',
      );
      expect(tokenStore.get()).toBeNull();
    });

    it('mostra a mensagem de validação no VALIDATION_FAILED', async () => {
      respondLoginError(
        400,
        errorBody(400, 'VALIDATION_FAILED', 'Dados inválidos'),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Confira o e-mail e a senha informados.',
      );
    });

    it('mostra a mensagem de muitas tentativas no TOO_MANY_REQUESTS', async () => {
      respondLoginError(
        429,
        errorBody(429, 'TOO_MANY_REQUESTS', 'Muitas requisições'),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Muitas tentativas. Aguarde um minuto e tente de novo.',
      );
    });

    it('mostra a mensagem genérica num code desconhecido sem quebrar a tela', async () => {
      // Code que o contrato ainda não conhece: o handler não pode ser tipado
      // pelo ErrorResponseDto. Status 409: um 400 desconhecido cai na
      // mensagem de validação (caso abaixo).
      server.use(
        http.post(`${API_URL}/auth/login`, () =>
          HttpResponse.json(
            {
              ...errorBody(409, 'CONFLICT', 'Algo novo'),
              code: 'CODIGO_QUE_O_FRONT_NAO_CONHECE',
            },
            { status: 409 },
          ),
        ),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Não foi possível entrar. Tente de novo.',
      );
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled();
    });

    it('mostra a mensagem de validação num 400 com code desconhecido', async () => {
      server.use(
        http.post(`${API_URL}/auth/login`, () =>
          HttpResponse.json(
            {
              ...errorBody(400, 'BAD_REQUEST', 'Senha longa demais'),
              code: 'PASSWORD_TOO_LONG',
            },
            { status: 400 },
          ),
        ),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Confira o e-mail e a senha informados.',
      );
    });

    it('mostra a mensagem de falha de rede sem quebrar a tela', async () => {
      server.use(
        http.post(`${API_URL}/auth/login`, () => HttpResponse.error()),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Sem conexão com o servidor. Verifique sua internet e tente de novo.',
      );
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled();
    });

    it('mostra a mensagem de erro do servidor num 500 sem corpo, sem quebrar a tela', async () => {
      server.use(
        http.post(
          `${API_URL}/auth/login`,
          () => new HttpResponse(null, { status: 500 }),
        ),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'O servidor está com problemas. Tente de novo em instantes.',
      );
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled();
    });

    it('não repete o POST /auth/login num 500', async () => {
      const login = respondLoginError(
        500,
        errorBody(500, 'INTERNAL_ERROR', 'Erro interno do servidor'),
      );
      const { user } = renderApp('/login');

      await submitLogin(user);
      await screen.findByRole('alert');
      // Dá tempo para uma eventual nova tentativa automática.
      await delay(1500);

      expect(login.calls()).toBe(1);
    });
  });

  describe('já logado', () => {
    it('redireciona para a página inicial ao abrir /login', async () => {
      tokenStore.set(MARIA.token);
      server.use(respondMe(MARIA.user).handler);
      const { currentPath } = renderApp('/login');

      expect(await screen.findByText(/Maria Souza/)).toBeInTheDocument();
      expect(currentPath()).toBe('/');
    });

    it('redireciona para o from ao abrir /login?from=...', async () => {
      tokenStore.set(MARIA.token);
      server.use(respondMe(MARIA.user).handler);
      const { currentPath } = renderApp('/login?from=%2Fanuncios');

      await waitFor(() => expect(currentPath()).toBe('/anuncios'));
    });

    it('ignora um from externo e redireciona para a página inicial', async () => {
      tokenStore.set(MARIA.token);
      server.use(respondMe(MARIA.user).handler);
      const { currentPath } = renderApp('/login?from=%2F%2Fsite.com');

      expect(await screen.findByText(/Maria Souza/)).toBeInTheDocument();
      expect(currentPath()).toBe('/');
    });

    it('com token velho (401 no /auth/me), apaga o token e mostra o formulário sem aninhar o from', async () => {
      tokenStore.set(MARIA.token);
      server.use(
        http.get<never, never, ErrorResponse>(`${API_URL}/auth/me`, () =>
          HttpResponse.json(
            errorBody(401, 'UNAUTHENTICATED', 'Token inválido ou expirado'),
            { status: 401 },
          ),
        ),
      );
      const { currentPath } = renderApp('/login');

      expect(
        await screen.findByRole('form', { name: 'Entrar' }),
      ).toBeInTheDocument();
      expect(tokenStore.get()).toBeNull();
      expect(currentPath()).toBe('/login');
    });
  });
});
