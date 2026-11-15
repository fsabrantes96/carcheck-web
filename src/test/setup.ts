import '@testing-library/jest-dom/vitest';
import { server } from './server';

// Requisição sem handler é erro: nenhum teste chega à rede de verdade.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
