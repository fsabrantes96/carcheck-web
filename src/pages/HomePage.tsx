import { useCurrentUser } from '../features/auth/currentUser';

export function HomePage() {
  // Rota protegida: o RequireAuth só renderiza esta página com o usuário
  // já carregado.
  const { data: currentUser } = useCurrentUser();
  const displayName = currentUser?.name.trim() || currentUser?.email;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold text-slate-900">CarCheck</h1>
      {displayName && (
        <p className="text-lg text-slate-600">Olá, {displayName}</p>
      )}
    </main>
  );
}
