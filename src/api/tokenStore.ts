// Único módulo que acessa o storage do navegador (o ESLint proíbe
// sessionStorage e localStorage no resto do código). O token fica no
// sessionStorage só por enquanto: antes de produção ele vai para um cookie
// httpOnly, o que exige mudança no back (docs/audit.md). Nunca logar o token.

const TOKEN_KEY = 'carcheck.token';

// O sessionStorage pode lançar erro só de ser acessado (navegador com
// storage bloqueado) ou em getItem/setItem (cota, modo privado). Nesses
// casos o app segue como se não houvesse token.
function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export const tokenStore = {
  get(): string | null {
    try {
      return storage()?.getItem(TOKEN_KEY) ?? null;
    } catch {
      return null;
    }
  },

  set(token: string): void {
    try {
      storage()?.setItem(TOKEN_KEY, token);
    } catch {
      // Sem storage não há onde guardar: o token se perde e as próximas
      // requisições saem sem Authorization (como se não houvesse login).
    }
  },

  clear(): void {
    try {
      storage()?.removeItem(TOKEN_KEY);
    } catch {
      // Nada a fazer: sem storage não há token gravado.
    }
  },
};
