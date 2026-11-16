import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { tokenStore } from './api/tokenStore';
import { createQueryClient } from './queryClient';
import { routes } from './routes';
import { MARIA, respondMe } from './test/api';
import { server } from './test/server';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('rotas', () => {
  afterEach(() => {
    tokenStore.clear();
  });

  it('renderiza a página inicial com o nome CarCheck e o do usuário quando há sessão', async () => {
    tokenStore.set(MARIA.token);
    server.use(respondMe(MARIA.user).handler);

    renderAt('/');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'CarCheck' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Maria Souza/)).toBeInTheDocument();
  });

  it('renderiza a página 404 numa rota que não existe', () => {
    renderAt('/rota-que-nao-existe');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Página não encontrada' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Voltar ao início' }),
    ).toHaveAttribute('href', '/');
  });
});
