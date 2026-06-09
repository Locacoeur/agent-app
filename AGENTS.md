# AGENTS.md

Agent guidance for this repository. Keep changes small, app-scoped, and verifiable.

## Project Snapshot

- Monorepo managed with Turborepo from repo root.
- Workspaces are in `apps/*`.
- Active apps in this repo:
  - `apps/frontend`: SvelteKit + Tailwind v4 + Vitest + Playwright.
  - `apps/backend`: minimal Python app managed via `pyproject.toml` and `uvx` for lint/format.

## Where To Look First

- Root task orchestration: [package.json](package.json), [turbo.json](turbo.json)
- Frontend docs and scripts: [apps/frontend/README.md](apps/frontend/README.md), [apps/frontend/package.json](apps/frontend/package.json)
- Backend metadata and scripts: [apps/backend/pyproject.toml](apps/backend/pyproject.toml), [apps/backend/package.json](apps/backend/package.json)

## Standard Commands

Run from repo root unless noted.

- Install deps: `bun install`
- Dev (all workspaces): `bun run dev`
- Build (all workspaces): `bun run build`
- Lint (all workspaces): `bun run lint`
- Type checks (all workspaces): `bun run check-types`

Frontend-focused (run in `apps/frontend` when debugging only frontend):

- Dev server: `npm run dev`
- Lint + format check: `npm run lint`
- Type and Svelte checks: `npm run check`
- Unit/component tests: `npm run test:unit`
- E2E tests: `npm run test:e2e`

Backend-focused (run in `apps/backend`):

- Lint: `npm run lint` (uses `uvx ruff check .`)
- Format: `npm run lint:format` (uses `uvx ruff format .`)

## Architecture And Boundaries

- Keep frontend and backend changes separated unless the task explicitly spans both apps.
- Frontend auth flow uses Better Auth:
  - server setup in [apps/frontend/src/lib/auth.ts](apps/frontend/src/lib/auth.ts)
  - client setup in [apps/frontend/src/lib/auth-client.ts](apps/frontend/src/lib/auth-client.ts)
  - session hydration in [apps/frontend/src/hooks.server.ts](apps/frontend/src/hooks.server.ts)
- SvelteKit routes are under `apps/frontend/src/routes`.

## Project Conventions

- Respect Svelte 5 runes mode settings from [apps/frontend/svelte.config.js](apps/frontend/svelte.config.js).
- Preserve existing formatting/lint tools (Prettier + ESLint in frontend, Ruff in backend).
- Prefer minimal, localized edits; avoid broad refactors unless requested.
- If root `README.md` appears generic/starter-oriented, rely on app-level files and scripts as source of truth.

## Test Expectations For Changes

- Frontend UI or route changes:
  - run `npm run check`
  - run `npm run test:unit`
  - run `npm run test:e2e` when behavior affects user flows
- Backend Python changes:
  - run `npm run lint` in `apps/backend`

## Known Pitfalls

- Frontend E2E config starts preview with `npm run build && npm run preview`; if package manager differs, keep command compatibility in mind before changing scripts.
- Better Auth configuration depends on environment variables from `$env/static/private` and `$env/static/public`; avoid hardcoding credentials or URLs.
- `apps/backend/README.md` is currently empty; do not assume additional backend runtime behavior beyond `main.py` and declared scripts.

## Documentation Links (Do Not Duplicate)

- Monorepo scripts: [package.json](package.json)
- Frontend setup: [apps/frontend/README.md](apps/frontend/README.md)
- Backend metadata: [apps/backend/pyproject.toml](apps/backend/pyproject.toml)
