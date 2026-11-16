import { screen, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { tokenStore } from '../../api/tokenStore';
import {
  API_URL,
  deferred,
  errorBody,
  MARIA,
  respondMe,
  type CurrentUser,
  type ErrorResponse,
} from '../../test/api';
import { renderApp } from '../../test/renderApp';
import { server } from '../../test/server';

describe('rota protegida', () => {
  beforeEach(() => {
    tokenStore.clear();
  });

  it('redireciona para /login?from=<caminho atual> ao abrir rota protegida sem token', async () => {
    const { currentPath } = renderApp('/?aba=2#topo');

    await waitFor(() =>
      expect(currentPath()).toBe('/login?from=%2F%3Faba%3D2%23topo'),
    );
  });

  it('mostra carregando enquanto o /auth/me não responde', async () => {
    tokenStore.set(MARIA.token);
    const pending = deferred();
    server.use(
      http.get<never, never, CurrentUser>(`${API_URL}/auth/me`, async () => {
        await pending.promise;
        return HttpResponse.json(MARIA.user);
      }),
    );

    renderApp('/');

    expect(await screen.findByRole('status')).toHaveTextContent('Carregando…');
    pending.resolve();
    expect(await screen.findByText(/Maria Souza/)).toBeInTheDocument();
  });

  it('mostra erro e o botão de tentar de novo quando o /auth/me falha por rede, sem apagar o token', async () => {
    tokenStore.set(MARIA.token);
    server.use(http.get(`${API_URL}/auth/me`, () => HttpResponse.error()));

    const { currentPath } = renderApp('/');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar sua sessão.',
    );
    expect(
      screen.getByRole('button', { name: 'Tentar de novo' }),
    ).toBeInTheDocument();
    expect(tokenStore.get()).toBe(MARIA.token);
    expect(currentPath()).toBe('/');
  });

  it('mostra erro sem apagar o token num 500 do /auth/me', async () => {
    tokenStore.set(MARIA.token);
    server.use(
      http.get<never, never, ErrorResponse>(`${API_URL}/auth/me`, () =>
        HttpResponse.json(
          errorBody(500, 'INTERNAL_ERROR', 'Erro interno do servidor'),
          { status: 500 },
        ),
      ),
    );

    renderApp('/');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar sua sessão.',
    );
    expect(tokenStore.get()).toBe(MARIA.token);
  });

  it('carrega a página inicial ao tentar de novo depois de uma falha do /auth/me', async () => {
    tokenStore.set(MARIA.token);
    server.use(
      http.get(`${API_URL}/auth/me`, () => HttpResponse.error(), {
        once: true,
      }),
      respondMe(MARIA.user).handler,
    );
    const { user } = renderApp('/');

    await user.click(
      await screen.findByRole('button', { name: 'Tentar de novo' }),
    );

    expect(await screen.findByText(/Maria Souza/)).toBeInTheDocument();
  });

  it('não aninha outro from num 401 do /auth/me estando no login com maiúscula e barra no fim', async () => {
    tokenStore.set(MARIA.token);
    server.use(
      http.get<never, never, ErrorResponse>(`${API_URL}/auth/me`, () =>
        HttpResponse.json(
          errorBody(401, 'UNAUTHENTICATED', 'Token inválido ou expirado'),
          { status: 401 },
        ),
      ),
    );
    const { currentPath } = renderApp('/Login/?from=%2Fanuncios');

    expect(
      await screen.findByRole('form', { name: 'Entrar' }),
    ).toBeInTheDocument();
    expect(tokenStore.get()).toBeNull();
    expect(currentPath()).toBe('/Login/?from=%2Fanuncios');
  });

  it('apaga o token, limpa o cache e redireciona para /login?from=<caminho> num 401 do /auth/me, sem chamar o /auth/me de novo', async () => {
    tokenStore.set(MARIA.token);
    let meCalls = 0;
    server.use(
      http.get<never, never, ErrorResponse>(`${API_URL}/auth/me`, () => {
        meCalls += 1;
        return HttpResponse.json(
          errorBody(401, 'UNAUTHENTICATED', 'Token inválido ou expirado'),
          { status: 401 },
        );
      }),
    );
    const { queryClient, currentPath } = renderApp('/?aba=2');
    queryClient.setQueryData(['dado-do-usuario'], 'dado da Maria');

    await waitFor(() =>
      expect(currentPath()).toBe('/login?from=%2F%3Faba%3D2'),
    );
    // Dá tempo para um eventual laço de refetch aparecer.
    await delay(50);

    expect(tokenStore.get()).toBeNull();
    expect(queryClient.getQueryData(['dado-do-usuario'])).toBeUndefined();
    expect(meCalls).toBe(1);
  });
});
