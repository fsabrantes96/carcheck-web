// @vitest-environment node
import { safeRedirectPath } from './safeRedirect';

describe('safeRedirectPath', () => {
  it('aceita caminho interno com query e hash', () => {
    expect(safeRedirectPath('/anuncios?pagina=2#topo')).toBe(
      '/anuncios?pagina=2#topo',
    );
  });

  it.each([null, undefined, ''])('devolve / quando o from é %j', (from) => {
    expect(safeRedirectPath(from)).toBe('/');
  });

  it.each([
    '//site.com',
    '//site.com/anuncios',
    'https://site.com',
    'http:/site.com',
    '/\\site.com',
    '\\\\site.com',
    '/anuncios\\..\\..\\site.com',
    'javascript:alert(1)',
    '/\t/site.com',
    '/\n/site.com',
    'site.com',
    ' /anuncios',
  ])('rejeita %j e devolve /', (from) => {
    expect(safeRedirectPath(from)).toBe('/');
  });

  it.each(['/login', '/login?from=/anuncios'])(
    'devolve / quando o from aponta para o próprio login (%j)',
    (from) => {
      expect(safeRedirectPath(from)).toBe('/');
    },
  );
});
