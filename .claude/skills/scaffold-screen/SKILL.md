---
name: scaffold-screen
description: Create a new screen following the project's view/viewmodel layering, routing and i18n. Use whenever adding a screen or a significant new feature area.
---

# Scaffold a screen

## Steps

1. Create `src/screens/<Name>/` with:
   - `<Name>Screen.tsx` — the view. Renders layout and subcomponents, consumes the viewmodel, contains no business logic.
   - `use<Name>ViewModel.ts` — the viewmodel hook. Calls query hooks from `src/api/`, owns local UI state, and exposes plain values + handlers. Extract any non-trivial logic (grouping, filtering, decisions) into exported pure functions in the same file.
   - Subcomponents colocated in the same folder, one component per file.
2. If the screen needs a new data domain, add `src/api/<domain>/` with `<domain>.types.ts`, `<domain>.api.ts`, `<domain>.queries.ts`, register its key in `src/api/queryKeys.ts`, and add matching MSW handlers in `src/mocks/handlers.ts` (+ seed data in `src/mocks/seed.ts`).
3. Register the route in `src/App.tsx`. If the screen pulls a heavy dependency (charts, editors), lazy-load it with `React.lazy` + `Suspense` like `InsightsScreen`.
4. Add a nav item in `src/components/AppLayout.tsx` if the screen is top-level.
5. Add translation keys to BOTH `src/i18n/locales/en.json` and `he.json`. Never hardcode user-facing strings.
6. Verify the screen in both languages — the Hebrew toggle must lay out correctly (see the rtl-styling skill).
7. Add colocated tests for the exported pure functions of the viewmodel (see the testing skill).

## Constraints

- Views never call `src/api/` functions directly — only through the viewmodel.
- No comments in code.
- Colors and spacing come from the theme / `src/theme/tokens.ts`, never hardcoded.
