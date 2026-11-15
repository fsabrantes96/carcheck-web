/// <reference types="@testing-library/jest-dom/vitest" />
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from './server';

// Registra os matchers no `expect` global do runner. O
// '@testing-library/jest-dom/vitest' importa o `vitest` por conta própria e,
// no Windows com o drive em minúscula (c:\dev), pega outra instância do
// módulo: os matchers somem ("Invalid Chai property").
expect.extend(matchers);

// Requisição sem handler é erro: nenhum teste chega à rede de verdade.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
