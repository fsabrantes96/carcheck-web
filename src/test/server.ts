import { setupServer } from 'msw/node';

// Servidor do MSW compartilhado pelos testes. Começa sem handlers: cada
// teste registra os seus com `server.use(...)`.
export const server = setupServer();
