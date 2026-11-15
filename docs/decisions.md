# Decisões

Stack e motivo de cada escolha. Mudar uma delas é decisão do dono do projeto.

| Escolha | Motivo |
|---|---|
| **Vite + React + TypeScript (SPA)** | Build rápido e simples para um app que fala com uma API separada. Sem SSR por enquanto (custo: SEO das páginas públicas, risco 2 do audit). |
| **React Router** (`createBrowserRouter`) | Roteamento padrão do ecossistema React. A tabela de rotas fica em `src/routes.tsx` e os testes usam `createMemoryRouter` com as mesmas rotas. |
| **Tailwind** (plugin `@tailwindcss/vite`) | Estilo direto no componente, sem CSS solto; o plugin do Vite dispensa PostCSS. |
| **TanStack Query** | Cache, loading e erro das chamadas sem estado global feito à mão. As `queryFn` usam `unwrap`, que lança `ApiError`. |
| **openapi-typescript + openapi-fetch** | Tipos gerados do `openapi.json` do back e cliente tipado por eles: mudança de contrato vira erro de tipo. Sem axios: o openapi-fetch usa o `fetch` nativo. |
| **Tipos e contrato commitados** (`api/openapi.json`, `src/api/schema.d.ts`) | O build e o CI não dependem do repositório do back; o `api:check` garante que os dois arquivos estão em sincronia. |
| **TypeScript 5.9.3** (o back usa 6.0.3) | O openapi-typescript 7.13.0 pede TypeScript `^5.x` como peer e o typescript-eslint aceita `<6.1.0`; o TypeScript 7 do template do Vite não funciona com nenhum dos dois. Risco 6 do audit. |
| **Token em `sessionStorage`, só pelo `src/api/tokenStore.ts`** | Temporário, para não exigir mudança no back agora. Concentrar o acesso num módulo deixa a troca por cookie httpOnly num lugar só (risco 1 do audit). O ESLint proíbe storage no resto do código. |
| **ESLint + typescript-eslint** (o back usa oxlint) | O front precisa dos plugins do ecossistema React (`react-hooks`, `react-refresh`) e da regra `no-restricted-globals`/`no-restricted-properties` que tranca o storage no `tokenStore.ts`, que o oxlint não cobre do mesmo jeito. As regras type-aware mantêm a do back: `no-floating-promises` como erro. |
| **Prettier com o `.prettierrc` do back** | Mesmo estilo nos dois repositórios (`singleQuote`, `trailingComma: all`). |
| **Vitest + Testing Library + MSW** | Mesmo runner do back; a Testing Library testa pelo que o usuário vê; o MSW simula a API na camada de rede, sem mockar o cliente. |
| **Proxy do Vite** (`/api` → `http://localhost:3000`, sem o prefixo) | Evita CORS em dev. Em produção ainda não está definido (risco 3 do audit). |
| **`devEngines` e `allowScripts` iguais aos do back** | Node `^24` e npm `12.2.1` exatos em todo lugar (local e CI); script de instalação de dependência só depois de revisado. |
