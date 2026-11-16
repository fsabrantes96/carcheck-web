import { Navigate, Outlet, useLocation } from 'react-router';
import { LoadingState } from '../../components/LoadingState';
import { useCurrentUser } from './currentUser';
import { loginPathFrom } from './safeRedirect';

/**
 * Layout das rotas que exigem sessão. Sem token, manda para o login com o
 * caminho atual no from. Com token, espera o /auth/me; um 401 dele derruba
 * a sessão pelo onUnauthorized (registerSessionHandlers).
 */
export function RequireAuth() {
  const location = useLocation();
  const { hasToken, isPending, isError, refetch, isFetching } =
    useCurrentUser();

  if (!hasToken) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={loginPathFrom(from)} replace />;
  }

  if (isPending) return <LoadingState />;

  if (isError) {
    return (
      <main className="mx-auto flex max-w-md flex-col gap-4 p-6">
        <p role="alert" className="text-red-700">
          Não foi possível carregar sua sessão. Verifique sua conexão e tente de
          novo.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="self-start rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          Tentar de novo
        </button>
      </main>
    );
  }

  return <Outlet />;
}
