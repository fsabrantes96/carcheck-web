import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { api, unwrap } from '../api/client';
import type { components } from '../api/schema';
import { tokenStore } from '../api/tokenStore';
import { currentUserQuery, useCurrentUser } from '../features/auth/currentUser';
import {
  LOGIN_MESSAGES,
  loginErrorMessage,
} from '../features/auth/loginErrorMessage';
import { safeRedirectPath } from '../features/auth/safeRedirect';

type LoginDto = components['schemas']['LoginDto'];

const TITLE_ID = 'login-title';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const destination = safeRedirectPath(searchParams.get('from'));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useMutation({
    // Sem nova tentativa automática: o back aceita 5 logins por minuto por
    // IP, e repetir um POST de login às cegas só gasta essa cota.
    retry: false,
    /** Devolve se a sessão nova se manteve depois do /auth/me. */
    mutationFn: async (credentials: LoginDto): Promise<boolean> => {
      // O POST /auth/login sai sem Authorization (client.ts): um 401 aqui é
      // senha errada, não sessão caindo.
      const { accessToken } = await unwrap(
        api.POST('/auth/login', { body: credentials }),
      );
      // Nada de uma sessão anterior pode sobrar no cache.
      queryClient.removeQueries();
      tokenStore.set(accessToken);
      try {
        await queryClient.fetchQuery(currentUserQuery);
      } catch {
        // Rede ou 5xx: segue com o token, e a rota protegida mostra o erro
        // com "Tentar de novo". 401: o cliente já apagou o token (e o
        // onUnauthorized limpou o cache, o que cancela esta busca); o login
        // não vale e o usuário fica nesta tela.
      }
      return tokenStore.get() !== null;
    },
    onSuccess: (sessionKept) => {
      if (sessionKept) void navigate(destination, { replace: true });
    },
  });

  const sessionLost = login.isSuccess && !login.data;
  const submitting = login.isPending || (login.isSuccess && login.data);
  const errorMessage = login.isError
    ? loginErrorMessage(login.error)
    : sessionLost
      ? LOGIN_MESSAGES.generic
      : null;

  // Já logado: vai direto para o destino. Durante o envio, quem navega é
  // o onSuccess.
  if (!submitting && currentUser.hasToken) {
    if (currentUser.isSuccess) return <Navigate to={destination} replace />;
    if (currentUser.isPending) {
      return (
        <p role="status" className="p-6 text-slate-600">
          Carregando…
        </p>
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    login.mutate({ email, password });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
      <h1 id={TITLE_ID} className="text-3xl font-bold text-slate-900">
        Entrar
      </h1>
      {/* method="post": se o JavaScript falhar, a senha vai no corpo, não na
          URL. O envio normal é interceptado pelo preventDefault. */}
      <form
        method="post"
        aria-labelledby={TITLE_ID}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="login-email" className="font-medium text-slate-800">
            E-mail
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="login-password"
            className="font-medium text-slate-800"
          >
            Senha
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2"
          />
        </div>
        {errorMessage && (
          <p role="alert" className="text-red-700">
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
