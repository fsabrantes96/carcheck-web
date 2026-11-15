# CarCheck Web

Front-end do CarCheck, um marketplace de carros em que o comprador agenda uma avaliação presencial do carro com um avaliador verificado antes de comprar. O back-end é o [carcheck-api](../carcheck-api) (NestJS), que publica o contrato da API em `openapi.json`.

SPA em Vite + React + TypeScript, com React Router, Tailwind e TanStack Query. Os tipos da API são gerados do contrato do back (openapi-typescript) e as chamadas passam por um cliente tipado (openapi-fetch). As decisões estão em [docs/decisions.md](docs/decisions.md) e os riscos conhecidos em [docs/audit.md](docs/audit.md).

## Roadmap

- [x] Estrutura inicial: ferramentas, tipos gerados, cliente da API com tratamento de erro por `code`, CI
- [ ] Login e sessão
- [ ] Anúncios
- [ ] Avaliadores e agendamentos

## Pré-requisitos

- **Node `^24.0.0`** e **npm `12.2.1` exato**, declarados no `devEngines` do `package.json`. Com outra versão, todo `npm run` falha (`EBADDEVENGINES`). O Node 24 traz o npm 11: instale o npm do projeto por cima (`npm i -g npm@12.2.1`) e confira com `npm -v`.
- O [carcheck-api](../carcheck-api) clonado **ao lado** deste repositório (`../carcheck-api`), para rodar o app de ponta a ponta e para o `api:sync`.

## Instalação

```bash
npm ci
```

O npm 12 bloqueia scripts de instalação de dependências que não estejam no `allowScripts` do `package.json`. Hoje só o `fsevents` (watcher do macOS, dependência opcional do Vite) tem script, e ele está negado.

## Rodando junto com o back

1. No `carcheck-api`, suba o banco e a API (veja o README de lá): a API fica em `http://localhost:3000`.
2. Aqui:

   ```bash
   npm run dev
   ```

   O app abre em `http://localhost:5173`. O proxy do Vite repassa `/api/*` para `http://localhost:3000/*` (sem o prefixo `/api`, porque as rotas do back não têm prefixo), então em dev não há CORS. O `npm run preview` usa o mesmo proxy.

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento do Vite |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o `dist/` localmente, com o proxy |
| `npm run lint` | ESLint (type-aware), inclui a proibição de `sessionStorage`/`localStorage` fora do `src/api/tokenStore.ts` |
| `npm run typecheck` | `tsc --noEmit` do app e dos arquivos de configuração |
| `npm test` | Vitest (jsdom, Testing Library, MSW) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run format` | Prettier |
| `npm run api:sync` | Copia o contrato do back e regenera os tipos |
| `npm run api:check` | Confere se os tipos commitados batem com o contrato commitado |

## Contrato da API: `api:sync` e `api:check`

- `api/openapi.json` é uma cópia do `openapi.json` do back, commitada.
- `src/api/schema.d.ts` é gerado dele pelo openapi-typescript, também commitado. **Nunca edite à mão.**

**Quando o contrato do back mudar** (o back rodou `npm run openapi` e commitou um `openapi.json` novo):

```bash
npm run api:sync                 # lê ../carcheck-api/openapi.json
npm run api:sync -- <caminho>    # ou outro caminho
```

Depois rode `npm run typecheck` (o que mudou no contrato aparece como erro de tipo, inclusive valor novo de enum aberto em `src/api/enums.ts`) e commite **`api/openapi.json` e `src/api/schema.d.ts` juntos**.

`npm run api:check` regenera os tipos de `api/openapi.json` num arquivo temporário e falha se forem diferentes do `schema.d.ts` commitado. Não depende do repositório do back e roda no CI.

## Estrutura de pastas

```
api/openapi.json        contrato do back (cópia commitada)
scripts/                api-sync.mjs, api-check.mjs e a geração compartilhada
src/
  api/                  schema.d.ts gerado, cliente, erros, enums e tokenStore
  components/           componentes reutilizáveis
  features/             código por funcionalidade (login, anúncios...)
  pages/                páginas ligadas às rotas
  test/                 setup do Vitest e servidor do MSW
  routes.tsx            tabela de rotas
  queryClient.ts        configuração do TanStack Query
docs/                   decisões e riscos
```

## Erros da API

Toda resposta de erro do back traz um `code` estável. O front decide **pelo `code`, nunca pelo texto** da mensagem:

```ts
import { api, unwrap } from './api/client';
import { ApiError, hasCode } from './api/errors';

try {
  await unwrap(api.POST('/auth/login', { body }));
} catch (error) {
  if (hasCode(error, 'INVALID_CREDENTIALS')) {
    // caso específico, decidido pelo code
  } else if (error instanceof ApiError) {
    // qualquer outro status ou code, inclusive um code novo: error.message
    // já vem em pt-BR (do back ou a padrão pelo status)
  } else {
    // falha de rede ou requisição cancelada: não é ApiError
  }
}
```

Nunca compare `error.code` direto nem o texto de `error.message`: use `hasCode`, que só aceita codes do contrato. Um 2xx sem corpo (204) devolve `undefined`.

Code ou valor de enum que o front não conhece nunca quebra a tela: o `ApiError` preserva o code novo (sem code, vira `UNKNOWN`) e `knownOr` troca valor desconhecido de enum por `UNKNOWN`.
