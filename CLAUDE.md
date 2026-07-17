# ApplyBoard

A job-application tracker SPA. React 19 + TypeScript + Vite + MUI. There is no backend: MSW intercepts `fetch` in the browser and serves a REST API backed by localStorage, and the AI extraction is a demo provider behind a real service interface.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — typecheck (`tsc -b`) and build
- `npm test` — run the Vitest suite once
- `npm run lint` — oxlint

## Architecture

The codebase is layered. Respect the layer boundaries when adding code:

- `src/api/` — the data layer. `apiClient.ts` is a thin fetch wrapper, `queryKeys.ts` centralizes every TanStack Query key, and each domain gets a folder (`applications/`) with `*.types.ts`, `*.api.ts` (raw CRUD functions) and `*.queries.ts` (query/mutation hooks). This layer is written as if a real server exists — it never imports from `src/mocks/`.
- `src/mocks/` — the "server". MSW handlers + an in-memory db persisted to localStorage + seed data. Deleting this folder and pointing at a real API should require no changes elsewhere.
- `src/services/extraction/` — local capabilities with provider seams. `ExtractionService` exposes an `AsyncGenerator<ExtractionChunk>` interface; `demoExtractionProvider` is the current implementation. A real LLM provider would replace only that file.
- `src/screens/<Name>/` — one folder per screen, everything colocated: the view (`<Name>Screen.tsx`), the viewmodel hook (`use<Name>ViewModel.ts`), subcomponents, config, and tests. Views render; viewmodels hold state, grouping and event logic. Pure logic lives in exported functions so it is testable without rendering.
- `src/components/` — only genuinely shared UI. The application form (schema + fields) lives here because two screens use it.
- `src/theme/` — design tokens (`tokens.ts`) feed the MUI theme. Components never hardcode colors; they use theme values or tokens.
- `src/i18n/` — i18next with `en` and `he`. Hebrew flips the entire app to RTL via a dedicated emotion cache (`stylis-plugin-rtl`).

## Conventions

- No comments in code. Names carry the meaning.
- Zod schemas are the single source of truth for form types (`z.infer`).
- Validation messages in schemas are i18n keys, translated at render time.
- Never use physical CSS properties (`left`, `marginLeft`, `pl`) in styling — use logical ones (`insetInlineStart`, `marginInlineStart`, `ps`) so RTL works. See `.claude/skills/rtl-styling`.
- Server state goes through TanStack Query only; no server data in `useState`.
- Stage moves use optimistic updates with rollback (`useMoveApplication`).
- Tests are colocated (`*.test.ts(x)` next to the source). Test pure logic first; component tests only where behavior lives in the component. See `.claude/skills/testing`.
- New screens follow `.claude/skills/scaffold-screen`.
