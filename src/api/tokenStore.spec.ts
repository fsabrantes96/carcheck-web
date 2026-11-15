import { tokenStore } from './tokenStore';

const TOKEN = 'token-de-teste.abc.123';

function storageError(): never {
  throw new DOMException('Acesso negado', 'SecurityError');
}

describe('tokenStore', () => {
  beforeEach(() => {
    tokenStore.clear();
  });

  it('devolve null quando não há token', () => {
    expect(tokenStore.get()).toBeNull();
  });

  it('devolve o token gravado com set', () => {
    tokenStore.set(TOKEN);

    expect(tokenStore.get()).toBe(TOKEN);
  });

  it('apaga o token com clear', () => {
    tokenStore.set(TOKEN);

    tokenStore.clear();

    expect(tokenStore.get()).toBeNull();
  });

  it('devolve null quando o getItem do storage lança erro', () => {
    tokenStore.set(TOKEN);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(storageError);

    expect(tokenStore.get()).toBeNull();
  });

  it('devolve null quando o próprio acesso ao sessionStorage lança erro', () => {
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(storageError);

    expect(tokenStore.get()).toBeNull();
  });

  it.each([
    ['set', () => tokenStore.set(TOKEN)],
    ['clear', () => tokenStore.clear()],
  ])(
    'não lança no %s quando o próprio acesso ao sessionStorage lança erro',
    (_name, action) => {
      vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(
        storageError,
      );

      expect(action).not.toThrow();
    },
  );

  it('não lança quando o setItem do storage lança erro', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(storageError);

    expect(() => tokenStore.set(TOKEN)).not.toThrow();
  });

  it('não lança quando o removeItem do storage lança erro', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(storageError);

    expect(() => tokenStore.clear()).not.toThrow();
  });

  it('não escreve o token no console quando o storage falha', () => {
    const consoleSpies = (
      ['log', 'info', 'warn', 'error', 'debug'] as const
    ).map((method) => vi.spyOn(console, method).mockImplementation(() => {}));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(storageError);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(storageError);

    tokenStore.set(TOKEN);
    tokenStore.get();

    const logged = consoleSpies.flatMap((spy): unknown[] =>
      spy.mock.calls.flat(),
    );
    expect(logged.map(String).join(' ')).not.toContain(TOKEN);
  });
});
