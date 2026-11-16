export const LOGIN_PATH = '/login';
export const HOME_PATH = '/';

// Origem fictícia só para o parse: um caminho interno resolvido contra ela
// continua nela; um destino externo (//site.com, https://...) muda a origem.
const PARSE_ORIGIN = 'http://interno.invalid';

// Barra invertida e caracteres de controle ficam de fora: o navegador trata
// \ como / e remove tab e quebra de linha da URL, então /\site.com e
// /<tab>/site.com virariam //site.com.
// eslint-disable-next-line no-control-regex
const FORBIDDEN_CHARS = /[\\\u0000-\u001f\u007f]/;

/**
 * Destino depois do login: só um caminho interno do app. Qualquer outra
 * coisa (ausente, externo, malformado ou o próprio /login) vira a página
 * inicial. Evita usar o login para mandar o usuário a outro site.
 */
export function safeRedirectPath(from: string | null | undefined): string {
  if (!from) return HOME_PATH;
  if (!from.startsWith('/') || from.startsWith('//')) return HOME_PATH;
  if (FORBIDDEN_CHARS.test(from)) return HOME_PATH;

  let url: URL;
  try {
    url = new URL(from, PARSE_ORIGIN);
  } catch {
    return HOME_PATH;
  }
  if (url.origin !== PARSE_ORIGIN) return HOME_PATH;
  // A saída também precisa ser caminho interno: o parse resolve . e ..
  // (inclusive %2e), e /.//site.com vira //site.com.
  if (url.pathname.startsWith('//')) return HOME_PATH;
  if (url.pathname === LOGIN_PATH) return HOME_PATH;

  return `${url.pathname}${url.search}${url.hash}`;
}

/** Caminho do login levando o caminho atual no from. */
export function loginPathFrom(from: string): string {
  return `${LOGIN_PATH}?${new URLSearchParams({ from }).toString()}`;
}
