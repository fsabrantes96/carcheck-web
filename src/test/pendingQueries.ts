import type { QueryClient } from '@tanstack/react-query';

// QueryClients criados pelo renderApp no teste atual. Sem imports do app
// nem da Testing Library: o setup importa este módulo em todo spec,
// inclusive os de Node puro.
const clients = new Set<QueryClient>();

const TIMEOUT_MS = 2000;
const POLL_MS = 10;

export function trackQueryClient(queryClient: QueryClient): void {
  clients.add(queryClient);
}

/**
 * Espera as buscas em andamento terminarem antes de o setup remover os
 * handlers do MSW: uma requisição que sobrasse do teste chegaria sem
 * handler (ou num handler do teste seguinte). Um teste que deixa uma
 * busca pendente de propósito (delay('infinite')) cancela as queries no
 * fim.
 */
export async function waitForIdleQueries(): Promise<void> {
  try {
    const deadline = Date.now() + TIMEOUT_MS;
    for (const queryClient of clients) {
      while (queryClient.isFetching() > 0) {
        if (Date.now() > deadline) {
          throw new Error(
            'Busca do TanStack Query ainda em andamento no fim do teste. ' +
              'Espere a resposta ou cancele as queries.',
          );
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_MS));
      }
    }
  } finally {
    clients.clear();
  }
}
