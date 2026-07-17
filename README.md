# ApplyBoard

A job-application tracker with an AI-style intake flow: paste a job posting, watch the fields get extracted one by one into a validated form, then manage the application on a drag-and-drop pipeline board with an insights dashboard on top. Fully bilingual — the English/Hebrew toggle flips the entire UI to RTL.

Everything runs in the browser. There is no backend: the REST API is served by Mock Service Worker and persisted to localStorage, and the extraction "AI" is a demo provider behind a real streaming interface.

## Features

- **Pipeline board** — five stages (Saved → Applied → Interview → Offer / Rejected), cards dragged between columns with dnd-kit, stage moves applied as optimistic updates with rollback on failure.
- **Add from posting** — paste raw job-posting text; an extraction service streams structured fields (company, role, location, stack, salary) into a react-hook-form + zod form, field by field, with live progress.
- **Insights** — pipeline funnel, applications-over-time, and most-requested-technologies charts (ECharts), plus stat tiles. The chart palette is validated for colorblind safety and contrast.
- **Full i18n + RTL** — Hebrew flips layout direction end to end via an RTL emotion cache (`stylis-plugin-rtl`) and MUI theme direction.

## Stack

React 19 · TypeScript · Vite · MUI (Emotion) · TanStack Query · MSW · react-hook-form + zod · dnd-kit · ECharts · i18next · Vitest + Testing Library

## Architecture

```
src/
├── api/            data layer: fetch client, central query keys, per-domain
│                   CRUD functions and TanStack Query hooks — written as if a
│                   real server exists
├── mocks/          the "server": MSW handlers + localStorage-backed db + seed
├── services/
│   └── extraction/ ExtractionService interface (AsyncGenerator of field
│                   chunks) + the demo provider implementing it
├── screens/        one folder per screen: view + viewmodel hook + colocated
│                   subcomponents and tests
├── components/     shared UI only (the application form schema + fields)
├── theme/          design tokens → MUI theme, LTR/RTL emotion caches
└── i18n/           en/he resources
```

Three deliberate seams:

1. **`services/extraction` is not `api/`.** The API layer talks to a "server"; extraction is a local capability behind an `AsyncGenerator` interface. Swapping the demo provider for a real LLM call with streaming changes one file and zero UI code.
2. **`mocks/` is the backend, not the data layer.** The `api/` layer never knows MSW exists. Delete `mocks/`, point the client at a real server, and every screen keeps working.
3. **One zod schema drives both forms.** The add-from-posting dialog and the details drawer share `applicationForm.schema.ts`; the form's TypeScript type is inferred from it.

## AI-assisted development

This repo is built to be developed with AI agents. [`CLAUDE.md`](CLAUDE.md) defines the architecture contract, and [`.claude/skills/`](.claude/skills) contains the playbooks the agents execute — scaffolding a new screen, bidirectional styling rules, and the testing strategy. The same approach I use at work: skills encode the project's recurring workflows, agents apply them.

## Run it

```bash
npm install
npm run dev
```

```bash
npm test        # vitest suite
npm run build   # typecheck + production build
```

The app seeds itself with demo data on first load; state persists in localStorage.
