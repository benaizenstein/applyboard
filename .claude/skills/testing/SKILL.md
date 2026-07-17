---
name: testing
description: What to test and how in this project — pure logic first, colocated Vitest files, component tests only for real behavior. Use when adding features or asked to add tests.
---

# Testing strategy

Runner: Vitest (`npm test`), jsdom environment, Testing Library for components. `globals: true` is on (Testing Library auto-cleanup relies on it). Tests are colocated: `foo.ts` → `foo.test.ts` in the same folder.

## Priority order

1. **Pure functions** — schemas, parsers, viewmodel logic. This is where bugs live and tests are cheapest. The pattern used across the repo: viewmodels export their pure logic (`groupByStage`, `resolveStageMove`, `computeInsights`) so it is testable without rendering or mocking. Prefer extracting a pure function over mounting a hook.
2. **Service providers** — e.g. `demoExtractionProvider`: feed realistic input, assert the emitted chunks. Async generators are collected with `for await`.
3. **Component behavior** — only when the behavior lives in the component (conditional rendering, event wiring). Render with the minimal required wrapper (e.g. `DndContext` for draggables). Not every component needs a test.

## Rules

- Zod schemas: test the contract — valid input passes, each custom rule fails with its i18n message key, `.trim()` transforms apply.
- Draggable components swallow pointer events from `userEvent`; use `fireEvent.click` to test click wiring on anything wrapped in dnd-kit.
- Time-dependent logic takes `now` as a parameter (see `computeInsights`) — pass a fixed timestamp in tests, never mock the clock.
- Injectable delays: factories accept a delay parameter (`createDemoExtractionProvider(0)`) so tests run instantly.
- Do not test MUI/library internals, styles, or translations content.
- No snapshot tests.
