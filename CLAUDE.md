# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CarCheck Web: the front-end (Vite + React + TypeScript SPA) of a car marketplace where a buyer books a verified **inspector** (role `INSPECTOR`) to evaluate a car in person before buying. The back-end is [carcheck-api](../carcheck-api) (NestJS), whose `openapi.json` is the contract this repo generates its types from. It's a personal study project focused on clean backend↔frontend contracts. Code comments, UI text, error messages, commit messages, and PR descriptions are written in **Portuguese (pt-BR)**.

Done: tooling, generated API types, the API client with error handling by `code`, CI. Next up (README roadmap): login and session, then listings, then inspectors and appointments. Stack decisions and their reasons are in [docs/decisions.md](docs/decisions.md); don't reopen them without the owner.

Known risks and their status (open, accepted, resolved) live in [docs/audit.md](docs/audit.md). Read it before designing, reviewing, or testing, and update it when a change resolves or introduces a risk.

## Commands

```bash
npm ci                 # install (see the npm 12 / allowScripts notes below)
npm run dev            # Vite on http://localhost:5173; /api/* is proxied to http://localhost:3000/* (prefix stripped)
npm run build          # vite build -> dist/
npm run preview        # serves dist/ with the same proxy
npm run lint           # eslint . (type-aware; no-floating-promises is an error; storage lock, see Architecture)
npm run typecheck      # tsc --noEmit for tsconfig.app.json and tsconfig.node.json
npm test               # vitest run (src/**/*.spec.{ts,tsx})
npx vitest run src/api/errors.spec.ts   # single file
npx vitest run -t "name of test"        # single test by name
npm run format         # prettier --write . (markdown is ignored)
npm run api:sync       # copies ../carcheck-api/openapi.json (or `-- <path>`) to api/openapi.json and regenerates src/api/schema.d.ts
npm run api:check      # regenerates into a temp file and fails if src/api/schema.d.ts differs (no back-end repo needed; runs in CI)
```

To run the app end to end, start the back-end first (see its README): API on `http://localhost:3000`.

**Node and npm versions** live only in `devEngines` in `package.json`: Node `^24.0.0` and npm `12.2.1` exact, both with `onFail: "error"`, so every `npm run` fails on another version (`EBADDEVENGINES`). Node 24 bundles npm 11; install the declared npm globally on top of it (`npm i -g npm@12.2.1`, check with `npm -v`). The CI reads both versions from there, so updating the local npm (or Node major) means updating `devEngines` in a `chore` commit first (and the versions quoted in this paragraph); never write a version in the workflow. Keep them in step with the back-end.

**Dependencies** are pinned to exact versions (no `^`/`~`; `.npmrc` has `save-exact=true`). npm 12 blocks dependency install scripts that aren't in `allowScripts` in `package.json`; there, `fsevents` (macOS-only watcher, optional dependency of Vite, runs `node-gyp`) is denied (`false`) on purpose. When a new dependency with an install script appears, `npm install-scripts ls` lists it: review what the script does and approve it pinned (`npm install-scripts approve <pkg>`) or deny it, never `--dangerously-allow-all-scripts`. Never run `npm audit fix --force`. TypeScript stays on 5.9.3 until openapi-typescript accepts TS 6 (risk 6); never force it with `overrides` or `--legacy-peer-deps`.

**Before `npm ci`, `npm install`, or anything else that deletes or rewrites `node_modules`:** list the node processes with their command lines (`Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Select-Object ProcessId, CreationDate, CommandLine`). If one belongs to this project (e.g. `npm run dev`, `vitest`), STOP and ask the user to stop it; never kill a user's process. On Windows a running process holds files in `node_modules` open and `npm ci` fails with EPERM halfway through.

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on PRs to `main` with the same hardening as the back-end: job id `build` (the required status check name: never rename it, give it a `name:` or a matrix), `permissions: contents: read`, checkout with `persist-credentials: false`, actions pinned by the same commit SHAs as the back-end (version in a comment; risk 8), `timeout-minutes: 20`, `concurrency` cancelling the previous run, no npm cache (`package-manager-cache: false`). It installs npm from `devEngines` in `${{ runner.temp }}` (no step may run npm inside the project folder before npm 12.2.1 is installed: npm 11 enforces `devEngines` there), checks `npm -v`, runs `npm ci` with `NPM_CONFIG_STRICT_ALLOW_SCRIPTS=true`, requires `npm install-scripts ls --json` to be empty, runs `npm audit signatures`, then lint, typecheck, test, `api:check` and build.

## Architecture

- **ESM**, `"type": "module"`, `moduleResolution: "bundler"`: relative imports have **no** extension (unlike the back-end's NodeNext `.js`). `verbatimModuleSyntax` is on, so type-only imports use `import type`. `strict` and `noUncheckedIndexedAccess` are on.
- **Contract → types.** `api/openapi.json` is a committed copy of the back-end contract; `src/api/schema.d.ts` is generated from it by openapi-typescript and committed (both are generated: never edit by hand). **The back-end contract changed → run `npm run api:sync`, fix what `npm run typecheck` reports, and commit `api/openapi.json` and `src/api/schema.d.ts` in the same commit.** CI fails (`api:check`) if they drift apart. Always use the generated types (`paths`, `components['schemas'][...]`); never hand-write a type that duplicates a schema.
- **API client** ([src/api/client.ts](src/api/client.ts)): `createClient<paths>` from openapi-fetch (no axios), `baseUrl` `/api` (the back-end routes have no `/api` prefix; the Vite proxy strips it). A middleware adds `Authorization: Bearer <token>` when there is a token; a 401 on a request that carried the **current** token clears it and calls the callback registered with `setOnUnauthorized`. A 401 without a token (wrong password on login) triggers nothing. `unwrap(api.GET(...))` returns the data of a 2xx or throws `ApiError`; use it in TanStack Query `queryFn`/`mutationFn`. The client reads `globalThis.fetch` on each call on purpose (openapi-fetch would keep the reference from creation time and miss MSW).
- **Errors** ([src/api/errors.ts](src/api/errors.ts)): every back-end error carries a stable `code`. **Decide by `code` (with `hasCode(error, 'SOME_CODE')`), never by the pt-BR `message`**, which is for people and can change. `ApiError.code` is typed `ErrorCode | (string & {})`: an unknown code is preserved and never breaks the screen (fall back on the HTTP status); a body without a code gets `UNKNOWN`, without a message gets a pt-BR default by status. `parseApiError` never throws (non-JSON, empty or missing body).
- **Open enums** ([src/api/enums.ts](src/api/enums.ts)): `AppointmentStatus`, `AppointmentAction`, `AppointmentActor` and `Role` (like `ErrorCode`) can grow on the back-end. Read them through `knownOr(value, LIST)`, which returns `UNKNOWN` for an unknown value, and give every UI `switch` an `UNKNOWN`/default branch. **An unknown enum value or code never breaks the screen.** The runtime lists fail the typecheck when the contract gains a value they lack, and `enums.spec.ts` checks them against `api/openapi.json`.
- **Storage only through [src/api/tokenStore.ts](src/api/tokenStore.ts).** It is the only module allowed to touch `sessionStorage`/`localStorage` (ESLint `no-restricted-globals` and `no-restricted-properties`, including `window.`/`globalThis.`/`self.` access, are errors everywhere else). Every access is inside `try/catch` (storage can throw); never log the token. The token moves to an httpOnly cookie before production (risk 1); don't spread token handling outside `tokenStore` and the client middleware.
- **Routes** live in [src/routes.tsx](src/routes.tsx) (`createBrowserRouter` in `main.tsx`, `createMemoryRouter` in tests). Pages in `src/pages/`, reusable components in `src/components/`, feature code in `src/features/<feature>/`.
- **Tailwind 4** through `@tailwindcss/vite` (`@import 'tailwindcss'` in `src/index.css`).

## Conventions

- Branches are `<type>/<name>`, with `<type>` one of `feat`, `fix`, `chore`, `test` or `docs`. Commits use Conventional Commits in Portuguese with a scope, e.g. `feat(auth): adiciona tela de login`.
- Commit messages are written to a file (UTF-8 **without BOM**) and passed with `git commit -F <file>`; keep the file outside the repo.
- `git add` only specific files, never `git add .` or `git add -A`.
- PRs follow [.github/pull_request_template.md](.github/pull_request_template.md): "O que mudou", "Como testar", and a checklist that includes the contract sync and the README roadmap.
- O agente nunca executa comandos que alteram o remoto, com uma única exceção: a skill /ship-pr, quando o usuário a aciona explicitamente. Merge, force push e remoção de branch remota são sempre do usuário.
- Never change anything in `../carcheck-api` from this repo; a back-end risk found here is reported to the user (and noted in this repo's audit).

## AI tooling

- Project agents live in [.claude/agents/](.claude/agents/): `pr-reviewer`, `security-reviewer`, `test-engineer` and `contract-reviewer` (checks the front uses the generated types, handles unknown codes/enums and never decides by message text). Skills live in [.claude/skills/](.claude/skills/).
- **`/ship-pr`** ([.claude/skills/ship-pr/SKILL.md](.claude/skills/ship-pr/SKILL.md)) is the only skill allowed to change the remote: it pushes the current branch and opens the PR with `gh`, after checking the branch name, a clean tree, lint, typecheck, tests, build, `api:check`, removed test lines and sensitive files, and after the user explicitly approves the title and description. It has `disable-model-invocation: true`: only the user starts it by typing `/ship-pr`. The agent never runs it on its own initiative and never suggests it in the middle of another task. Its `allowed-tools` lists only read/verification commands; `git push` and `gh pr create` are deliberately left out, so each one still triggers a permission prompt.
- **[.claude/settings.json](.claude/settings.json)** (versioned, same rules as the back-end) holds permission rules: `deny` for force push, push to `main`, deleting remote branches, `gh pr merge` and `gh repo edit`; `ask` for `git push` and `gh pr create`. Each rule exists as both `Bash(...)` and `PowerShell(...)`. These rules are an **extra lock, not a security boundary**: they match the command text, so other spellings (e.g. `git -C . push`, `git -c ... push`, a `+branch` refspec, `git push origin :branch`) are not caught. The rule above in Conventions is what governs; never rely on the settings alone, and never try to work around them.

## Testing

- **Vitest with globals** (`describe`, `it`, `expect`, `vi` without imports), jsdom by default (`// @vitest-environment node` at the top of a spec for pure Node). Use `vi.fn()`/`vi.spyOn`, never `jest`. Specs live next to the code as `src/**/*.spec.{ts,tsx}`.
- **Testing Library**: query by role and accessible name (`getByRole('heading', { name: 'CarCheck' })`), as the user sees it; `@testing-library/jest-dom` matchers are registered in [src/test/setup.ts](src/test/setup.ts).
- **MSW** simulates the API at the network level: the shared server in [src/test/server.ts](src/test/server.ts) starts with no handlers, each test registers its own with `server.use(http.get(...))`, and a request without a handler is an error (`onUnhandledFrame: 'error'`, the MSW 3 name). Never mock the API client or `fetch` directly. In tests, create the client with an absolute `baseUrl` (`createApiClient({ baseUrl: 'http://localhost/api' })`): Node's `Request` doesn't resolve relative URLs.
- **Windows gotcha:** with the terminal in `c:\dev\carcheck-web` (lowercase drive), a package that imports `vitest` itself can get a second module instance (that's why the jest-dom matchers are registered through the global `expect` in the setup). If a matcher or mock seems ignored, check the drive letter before debugging the test.
- Test names are in pt-BR and describe behavior (`it('apaga o token e chama o onUnauthorized quando a requisição levou token')`). One behavior per `it`.
- **Tests are the specification.** When a test fails, fix the production code. Never edit, comment out, skip (`it.skip`/`it.todo`/`it.fails`) or loosen an existing test just to make it pass; if a test looks wrong, stop and explain why.
- Before adding a case, look in the module's existing spec file and extend it instead of duplicating cases.
- New behavior goes in two commits: `test(<scope>): ...` with the failing test, then `feat(<scope>): ...`. Bug fixes likewise: `test(<scope>): ...` failing, then `fix(<scope>): ...`.
- The storage lock is tested by the lint rule: `npm run lint` counts as its test.
