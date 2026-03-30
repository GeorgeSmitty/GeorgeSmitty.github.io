# Working Notes — University of Iowa Sports Passion Survey

> **INTERNAL DOCUMENT — NOT PUBLIC FACING.**
> This file is for the developer and AI assistants only. Update it at the end of every working session before closing the project.

---

## How to Use This File (For AI Assistants)

1. Read this entire file before writing a single line of code or making any suggestion.
2. Read `README.md` for public-facing context, tech stack overview, and setup steps.
3. Do not change the folder structure, file naming conventions, or toolchain choices without explicit discussion with the developer first.
4. Follow all conventions in the **Conventions** section exactly — do not introduce alternatives.
5. Do not suggest anything listed in **What Was Tried and Rejected**. Those paths have been deliberately closed.
6. Ask before making any large structural changes — refactoring a page, adding a new router, changing how Supabase is called, or adding a state management library all qualify as large changes.
7. This project was built with AI assistance (Replit Agent). Refactor conservatively. Do not rewrite working code to match a preferred style; only touch what is necessary to complete the task at hand.
8. The app is a pure frontend — there is no Express backend for this project. All data flows through the Supabase JavaScript client directly from the browser.

---

## Current State

**Last Updated:** 2026-03-30

The app is fully scaffolded and functional in the Replit development environment. All four pages render and navigate correctly. The Supabase client is configured and the form submits successfully — **but only after the developer runs `supabase-setup.sql` in the Supabase SQL Editor** to create the table and RLS policies. The results page will show an error until that step is complete. The GitHub Actions deployment workflow for Azure Static Web Apps is written and ready; it has not yet been triggered against a real Azure resource.

### What Is Working

- [x] Home page with navigation buttons
- [x] Survey form — all 5 questions with correct input types
- [x] Inline validation with field-level error messages
- [x] "Submitting…" loading state on the submit button
- [x] Supabase insert on form submission
- [x] Confirmation page with answer summary (reads from `sessionStorage`)
- [x] Results page rendering with 4 Recharts bar charts and total count card
- [x] Navigation between all pages (Home ↔ Survey ↔ Results ↔ Confirmation)
- [x] `public/staticwebapp.config.json` for Azure SPA routing
- [x] `vite.config.ts` — Azure-compatible (no hard PORT/BASE_PATH requirement at build time)
- [x] GitHub Actions workflow for CI/CD to Azure Static Web Apps
- [x] `supabase-setup.sql` — ready to run, creates table + RLS policies
- [x] `artifacts/survey/.env.example` — documents required env vars
- [x] `README.md` and `WORKING_NOTES.md` at repo root

### What Is Partially Built

- [ ] Results page — renders correctly but shows "Failed to load results" error until the Supabase table exists (requires running the SQL setup)
- [ ] Azure deployment — workflow is written and secrets are documented, but a real Azure Static Web App resource has not yet been linked

### What Is Not Started

- [ ] Duplicate submission prevention (same user submitting multiple times)
- [ ] Admin-only response detail view
- [ ] CSV export from the results page
- [ ] Realtime result updates via Supabase Realtime
- [ ] Progress indicator / step counter on the survey form

---

## Current Task

The last session focused on making the project Azure-ready: updating `vite.config.ts` to not require `PORT` or `BASE_PATH` at build time, removing an unused monorepo workspace dependency (`@workspace/api-client-react`) that would break the Azure build, and writing the GitHub Actions CI/CD workflow.

**The single next step:** Run `supabase-setup.sql` in the Supabase SQL Editor to create the `survey_responses` table and enable Row Level Security, then test a live end-to-end submission.

---

## Architecture and Tech Stack

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 19.1.0 | Component model; required by workspace catalog |
| TypeScript | ~5.9.2 | Static typing; required across the entire monorepo |
| Vite | ^7.3.0 | Fast dev server and production bundler; workspace standard |
| Supabase JS Client | ^2.100.1 | Official client for Supabase PostgreSQL; simple insert/select API; no backend needed |
| Recharts | ^2.15.4 | Specified in PRD; composable React charting with ResponsiveContainer |
| Wouter | ^3.3.5 | Lightweight client-side router; no need for the full React Router API surface |
| Tailwind CSS | ^4.1.14 | Workspace standard; utility-first, no separate CSS files needed |
| pnpm | 10 | Workspace package manager; handles monorepo dependency resolution |
| Azure Static Web Apps | N/A | Specified deployment target by the developer |
| GitHub Actions | N/A | CI/CD trigger for Azure SWA deployment on push to `main` |

---

## Project Structure Notes

```
/                                        ← repo root
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml   ← CI/CD workflow; do not rename
├── artifacts/
│   └── survey/                         ← the entire frontend app lives here
│       ├── public/
│       │   ├── favicon.svg
│       │   └── staticwebapp.config.json ← Azure SPA fallback; must stay in public/
│       ├── src/
│       │   ├── lib/
│       │   │   └── supabase.ts         ← single Supabase client instance + TypeScript types
│       │   ├── pages/
│       │   │   ├── Home.tsx            ← landing page
│       │   │   ├── Survey.tsx          ← form logic, validation, Supabase insert
│       │   │   ├── Confirmation.tsx    ← reads answer summary from sessionStorage
│       │   │   ├── Results.tsx         ← fetches all rows, computes counts, renders charts
│       │   │   └── not-found.tsx       ← 404 fallback
│       │   ├── components/ui/          ← Shadcn/ui primitives; do not hand-edit
│       │   ├── App.tsx                 ← Wouter router and route definitions
│       │   ├── index.css               ← Tailwind + CSS custom properties (theme tokens)
│       │   └── main.tsx                ← React DOM entry point
│       ├── dist/public/                ← Vite build output; gitignored; Azure reads this
│       ├── .env.example                ← documents required VITE_ env vars
│       ├── supabase-setup.sql          ← run once in Supabase SQL Editor
│       ├── vite.config.ts              ← Vite config; Azure-aware, no hard PORT requirement
│       ├── package.json
│       └── tsconfig.json
├── lib/                                ← shared workspace libraries (not used by survey)
├── README.md                           ← public-facing documentation
├── WORKING_NOTES.md                    ← this file
└── pnpm-workspace.yaml                 ← workspace package discovery + catalog versions
```

### Non-Obvious Decisions

- **`dist/public`** — Vite's `outDir` is set to `dist/public` (not `dist`) to match the monorepo convention. The GitHub Actions workflow points `app_location` directly at `artifacts/survey/dist/public`. Do not change this path without updating the workflow.
- **`sessionStorage` on the confirmation page** — Wouter v3 does not support location state reliably. Answers are written to `sessionStorage` before navigating to `/confirmation`, then read back. This is intentional; do not replace it with URL params or global state.
- **No backend API** — The Express API server (`artifacts/api-server`) exists in the monorepo but is not used by this app. The survey connects to Supabase directly from the browser using the anon key and RLS policies.
- **`src/components/ui/`** — These are Shadcn/ui primitives. They are auto-generated and should not be hand-edited. Add or regenerate components via the Shadcn CLI if changes are needed.

### Files / Folders That Must Not Be Changed Without Discussion

- `artifacts/survey/vite.config.ts` — carefully tuned for both Replit dev and Azure production build
- `artifacts/survey/public/staticwebapp.config.json` — Azure routing; removing or moving it breaks all direct URL navigation
- `artifacts/survey/supabase-setup.sql` — source of truth for the database schema and RLS policies
- `.github/workflows/azure-static-web-apps.yml` — CI/CD pipeline; changes require Azure token re-verification
- `pnpm-workspace.yaml` — workspace package resolution and catalog versions; do not edit casually

---

## Data / Database

**Database:** Supabase (PostgreSQL) — external, hosted. Connection is via the anon public key with Row Level Security enabled.

### Table: `survey_responses`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `UUID` | Auto | `gen_random_uuid()` default; primary key |
| `created_at` | `TIMESTAMPTZ` | Auto | `now()` default; used for ordering if needed |
| `grade_level` | `TEXT` | Yes | One of: Freshman, Sophomore, Junior, Senior, Graduate Student, Other |
| `gender` | `TEXT` | Yes | One of: Male, Female, Non-binary, Prefer not to say |
| `sports_followed` | `TEXT[]` | Yes | Array; one or more of the 7 defined sports options |
| `passion_level` | `TEXT` | Yes | One of the 5 defined passion scale options |
| `event_attendance` | `TEXT` | Yes | One of the 5 defined attendance frequency options |

**RLS Policies:** Public `INSERT` and public `SELECT` are both enabled for the `anon` role. No `UPDATE` or `DELETE` is permitted.

**TypeScript types** for the table are defined in `artifacts/survey/src/lib/supabase.ts` as the `SurveyResponse` interface.

---

## Conventions

### Naming Conventions

- **Files:** PascalCase for React components (`Survey.tsx`, `Results.tsx`); camelCase for utilities (`supabase.ts`, `utils.ts`)
- **Variables / functions:** camelCase
- **CSS custom properties:** kebab-case (`--color-primary`, `--elevate-1`)
- **Supabase table:** `snake_case` for all column names
- **TypeScript interfaces:** PascalCase with no `I` prefix (`SurveyResponse`, `ResultsData`)

### Code Style

- Inline styles via the `style` prop are acceptable for one-off color values that reference the `#8A3BDB` accent — do not add Tailwind arbitrary values for these
- All Tailwind classes go on the JSX element; no separate CSS files for component styles
- `const` over `let`; no `var`
- Explicit return types on exported functions; inferred types on local variables
- No unused imports; remove them before committing

### Framework Patterns

- **State:** `useState` at the component level; no global state library
- **Data fetching:** direct `supabase.from(...).select(...)` inside `useEffect`; no React Query wrapper for this project (kept simple)
- **Routing:** Wouter `<Switch>` / `<Route>` in `App.tsx`; `useLocation()` for programmatic navigation
- **Forms:** controlled components with a single `form` state object; no `react-hook-form` in use for this project

### Git Commit Style

Conventional Commits format:
```
feat: add CSV export to results page
fix: prevent double submission on slow network
chore: update supabase-js to 2.101.0
docs: update WORKING_NOTES with session log
```

---

## Decisions and Tradeoffs

- **No backend API.** The survey reads and writes directly to Supabase from the browser using the anon key + RLS. This avoids standing up an Express server for a simple data collection app. The tradeoff is that all data logic must live in the database RLS policies. Do not suggest adding a backend proxy unless a specific security requirement demands it.
- **Wouter over React Router.** React Router v6/v7 is heavier and the project does not need nested routes, loaders, or actions. Do not suggest migrating to React Router.
- **`sessionStorage` for confirmation data.** Wouter does not support location state. `sessionStorage` is the simplest cross-navigation solution without adding a global store. Do not replace with `localStorage` (persists too long) or URL query params (exposes answer data in the URL).
- **All question options are hardcoded in `Survey.tsx`.** For a one-semester course project, configuration-driven options would add unnecessary complexity. Accept this tradeoff.
- **`dist/public` build output path.** This is a monorepo convention. Changing it to `dist` would break the GitHub Actions workflow's `app_location` setting.
- **Replit plugins are dev-only.** `runtimeErrorOverlay`, `cartographer`, and `devBanner` are conditionally loaded only when `REPL_ID` is set and `npm_lifecycle_event !== 'build'`. This prevents them from appearing in the Azure production bundle.

---

## What Was Tried and Rejected

- **Wouter location state for the confirmation page.** `navigate("/confirmation", { state: form })` does not work reliably in Wouter v3 — the state is not accessible via `useLocation` on the destination page. Replaced with `sessionStorage`. Do not suggest using location state again.
- **`PORT` and `BASE_PATH` as required environment variables in `vite.config.ts`.** The original scaffold threw hard errors if these were missing. Azure's build pipeline does not set them, causing the build to fail. Both are now optional with safe defaults. Do not add required env var checks back to this config.
- **Using `@workspace/api-client-react` in the survey.** This workspace package was listed as a devDependency in the scaffold template but is not imported anywhere in the survey. It was removed because it would require the full monorepo TypeScript build pipeline to be wired up on Azure, adding fragility to the CI/CD step.
- **Replit built-in PostgreSQL database.** The developer explicitly specified Supabase. Do not suggest switching to Replit's managed Postgres.
- **React Query for data fetching.** Adds a `QueryClientProvider` wrapper and extra boilerplate for what is two simple Supabase calls (one insert, one select). Plain `useEffect` + `useState` is sufficient and already in place.

---

## Known Issues and Workarounds

**Issue 1: Results page shows "Failed to load results" on first deployment**
- **Cause:** The `survey_responses` table does not exist in Supabase until the developer runs `supabase-setup.sql`.
- **Workaround:** Run the SQL in the Supabase SQL Editor before any live usage. The error message is user-visible but not catastrophic.
- **Do not remove:** The error display block in `Results.tsx` — it is intentional and required.

**Issue 2: Confirmation page shows no answers if `sessionStorage` is cleared mid-session**
- **Cause:** The browser's `sessionStorage` was cleared, the tab was duplicated into a new session, or the user navigated directly to `/confirmation` via the URL bar.
- **Workaround:** The confirmation page gracefully handles a `null` result from `sessionStorage.getItem` — it renders the thank-you message without the answer summary. No crash occurs.
- **Do not remove:** The `null` check on the `stored` variable in `Confirmation.tsx`.

**Issue 3: No duplicate submission prevention**
- **Cause:** Not implemented.
- **Workaround:** None currently. A user can refresh `/survey` and submit again. This is a known gap documented in the roadmap.

---

## Browser / Environment Compatibility

### Frontend

- **Tested in:** Chrome 124+, Firefox 125+, Edge 124+
- **Expected support:** All evergreen browsers released within the last 2 years
- **Known incompatibilities:** Internet Explorer is not supported. CSS `color-mix()` and CSS custom properties with `hsl()` are used extensively — these require modern browser support.
- **Responsive breakpoints:** Mobile-first; `sm:` breakpoint (640px) used for side-by-side button layouts and confirmation answer display

### Build / CI Environment

- **OS:** Ubuntu (GitHub Actions `ubuntu-latest`)
- **Node.js:** 20 (specified in `.github/workflows/azure-static-web-apps.yml`)
- **pnpm:** 10 (specified in workflow via `pnpm/action-setup@v4`)
- **Environment variables required at build time:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (injected via GitHub Secrets)
- **Replit-specific plugins** (`@replit/*`) are excluded from production builds via the `isReplit` / `isBuild` guard in `vite.config.ts`

---

## Open Questions

- **Should duplicate submissions be blocked?** If yes, the simplest approach is writing a flag to `localStorage` after a successful submit and checking it on page load. Raises the question of whether the instructor wants one response per student or allows retakes.
- **Should the results page be password-protected?** Currently anyone with the URL can view aggregated results. If the instructor wants results private until grading is complete, a simple Supabase RLS change (remove public SELECT) plus a password gate on the frontend would suffice.
- **Which additional sports should be added?** The current list matches the PRD exactly. Iowa also has Swimming & Diving, Softball, Track & Field, and Cross Country. Confirm with the instructor before expanding.
- **What should happen when the user navigates back to `/survey` after submitting?** Currently the form resets. Should it detect a prior submission and redirect instead?

---

## Session Log

### 2026-03-30

**Accomplished:**
- Built the complete survey application from scratch: Home, Survey, Confirmation, and Results pages
- Integrated Supabase JS client with direct browser-to-database connection
- Implemented form validation, submission state, sessionStorage handoff to Confirmation page
- Built Results page with 4 Recharts bar charts (Grade Level, Passion Level, Sports Followed, Attendance)
- Updated `vite.config.ts` to remove hard `PORT`/`BASE_PATH` requirements, making it Azure-compatible
- Removed unused `@workspace/api-client-react` devDependency
- Created `.github/workflows/azure-static-web-apps.yml` for CI/CD
- Created `supabase-setup.sql`, `.env.example`, `staticwebapp.config.json`
- Wrote `README.md` (16 sections, shields.io badges, full install guide)
- Wrote `WORKING_NOTES.md` (this file)

**Left Incomplete:**
- Supabase table has not yet been created (waiting on developer to run SQL)
- Azure Static Web App resource not yet provisioned (GitHub Secrets not yet set)

**Decisions Made:**
- `sessionStorage` chosen over wouter location state for confirmation data handoff
- Direct Supabase connection chosen over Express proxy
- `dist/public` kept as build output path to match monorepo convention

**Next Step:** Developer runs `supabase-setup.sql` in the Supabase SQL Editor, then tests a live end-to-end form submission.

---

## Useful References

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction) — `createClient`, `from().insert()`, `from().select()`
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/database/postgres/row-level-security) — how the public INSERT/SELECT policies work
- [Recharts API Reference](https://recharts.org/en-US/api) — `BarChart`, `Bar`, `Cell`, `ResponsiveContainer`, `XAxis`, `YAxis`, `Tooltip`
- [Wouter GitHub](https://github.com/molefrog/wouter) — routing, `useLocation`, `<Switch>`, `<Route>`
- [Vite Environment Variables](https://vite.dev/guide/env-and-mode) — how `VITE_` prefixed vars are embedded at build time
- [Azure Static Web Apps GitHub Action](https://github.com/Azure/static-web-apps-deploy) — `app_location`, `skip_app_build`, deployment token setup
- [Azure SWA Configuration Reference](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration) — `staticwebapp.config.json` schema and `navigationFallback`
- [pnpm Workspace Docs](https://pnpm.io/workspaces) — `--filter`, `catalog:`, workspace protocol
- **AI Tools Used:** Replit Agent was used to scaffold and build the entire application, generate `README.md`, adapt the Vite config for Azure, write the GitHub Actions workflow, and produce this file. All generated code was reviewed session by session. AI output should be treated as a starting point — verify database queries, RLS policies, and workflow YAML against official docs before production use.
