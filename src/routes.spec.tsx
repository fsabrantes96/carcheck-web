import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { createQueryClient } from './queryClient';
import { routes } from './routes';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('rotas', () => {
  it('renderiza a página inicial com o nome CarCheck', () => {
    renderAt('/');

    expect(
      screen.getByRole('heading', { level: 1, name: 'CarCheck' }),
    ).toBeInTheDocument();
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
