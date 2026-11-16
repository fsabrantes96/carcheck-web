import { screen, waitFor } from '@testing-library/react';
import { tokenStore } from '../../api/tokenStore';
import { JOAO, loginByEmail, MARIA, meByToken } from '../../test/api';
import { renderApp } from '../../test/renderApp';
import { server } from '../../test/server';

describe('logout', () => {
  beforeEach(() => {
    tokenStore.clear();
  });

  it('apaga o token, limpa o cache e volta para /login sem from', async () => {
    tokenStore.set(MARIA.token);
    server.use(meByToken(MARIA));
    const { user, queryClient, currentPath } = renderApp('/');
    queryClient.setQueryData(['dado-do-usuario'], 'dado da Maria');

    await user.click(await screen.findByRole('button', { name: 'Sair' }));

    await waitFor(() => expect(currentPath()).toBe('/login'));
    expect(tokenStore.get()).toBeNull();
    expect(queryClient.getQueryData(['dado-do-usuario'])).toBeUndefined();
    expect(queryClient.getQueryData(['auth', 'me'])).toBeUndefined();
  });

  it('apaga o token e limpa o cache mesmo se a navegação para o login falhar', async () => {
    tokenStore.set(MARIA.token);
    server.use(meByToken(MARIA));
    const { user, router, queryClient } = renderApp('/');
    queryClient.setQueryData(['dado-do-usuario'], 'dado da Maria');
    await screen.findByRole('button', { name: 'Sair' });
    vi.spyOn(router, 'navigate').mockRejectedValue(
      new Error('navegação bloqueada'),
    );

    await user.click(screen.getByRole('button', { name: 'Sair' }));

    await waitFor(() =>
      expect(queryClient.getQueryData(['dado-do-usuario'])).toBeUndefined(),
    );
    expect(tokenStore.get()).toBeNull();
  });

  it('depois de sair e entrar com outro usuário, não mostra nada do primeiro', async () => {
    tokenStore.set(MARIA.token);
    server.use(meByToken(MARIA, JOAO), loginByEmail(MARIA, JOAO));
    const { user } = renderApp('/');
    await user.click(await screen.findByRole('button', { name: 'Sair' }));

    await user.type(await screen.findByLabelText('E-mail'), JOAO.user.email);
    await user.type(screen.getByLabelText('Senha'), 'senha-do-joao-123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText(/João Lima/)).toBeInTheDocument();
    expect(screen.queryByText(/Maria Souza/)).not.toBeInTheDocument();
    expect(tokenStore.get()).toBe(JOAO.token);
  });
});
