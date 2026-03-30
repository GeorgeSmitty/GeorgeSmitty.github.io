# University of Iowa Sports Passion Survey

## Description

A short web-based survey application measuring fan passion and engagement with University of Iowa athletics. Built for BAIS:3300 at the University of Iowa, the app collects anonymous demographic and engagement data from respondents and displays aggregated results through interactive charts. It is intended for students, faculty, and Hawkeye fans who want to explore fan sentiment across the Iowa athletic program.

## Badges

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Charting-22B5BF?style=for-the-badge)
![Azure](https://img.shields.io/badge/Azure-Static_Web_Apps-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## Features

- **Five-question survey** covering grade level, gender, sports followed, passion level, and event attendance frequency
- **Real-time validation** with inline error messages before submission — no page reloads required
- **Confirmation page** shows a summary of your submitted answers after a successful response
- **Live results dashboard** displays aggregated anonymous data across all respondents with bar charts
- **Direct Supabase integration** — responses are stored instantly in a PostgreSQL database without a custom backend
- **Mobile-responsive layout** that works cleanly on phones, tablets, and desktops
- **WCAG 2.1 accessible** form controls with proper labels, roles, and keyboard navigation
- **Azure Static Web Apps ready** with `staticwebapp.config.json` included for seamless SPA routing

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI component framework |
| TypeScript | Static typing across the entire codebase |
| Vite 7 | Development server and production build tool |
| Supabase (PostgreSQL) | Database for storing and querying survey responses |
| @supabase/supabase-js | Official Supabase JavaScript client |
| Recharts | Bar chart visualizations on the results page |
| Wouter | Lightweight client-side routing |
| Tailwind CSS | Utility-first styling |
| pnpm | Fast, disk-efficient package manager |
| Azure Static Web Apps | Production hosting with SPA fallback routing |

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/) — JavaScript runtime
- [pnpm 9+](https://pnpm.io/installation) — Package manager (`npm install -g pnpm`)
- [Supabase account](https://supabase.com/) — Free tier is sufficient
- A Supabase project with the `survey_responses` table created (see **Usage** below)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/iowa-sports-survey.git
   cd iowa-sports-survey
   ```

2. Install all workspace dependencies from the project root:
   ```bash
   pnpm install
   ```

3. Create a `.env` file inside `artifacts/survey/` for local development:
   ```bash
   cp artifacts/survey/.env.example artifacts/survey/.env
   ```
   Then fill in your values:
   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
   ```

4. Set up the Supabase database by running the provided SQL in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):
   ```bash
   # Open and copy the contents of:
   artifacts/survey/supabase-setup.sql
   ```

5. Start the development server:
   ```bash
   pnpm --filter @workspace/survey run dev
   ```

6. Open your browser at `http://localhost:5173`

## Usage

### Running the app

```bash
# Development server (hot reload)
pnpm --filter @workspace/survey run dev

# Production build
pnpm --filter @workspace/survey run build

# Preview the production build locally
pnpm --filter @workspace/survey run preview
```

### Pages

| Route | Description |
|---|---|
| `/` | Home page with navigation to the survey and results |
| `/survey` | The five-question survey form |
| `/confirmation` | Shown after a successful submission |
| `/results` | Aggregated results dashboard with bar charts |

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public API key |

For production deployment on Azure Static Web Apps, add these as **Application Settings** in the Azure Portal, or as **GitHub Secrets** if deploying via GitHub Actions.

## Project Structure

```
artifacts/survey/
├── public/
│   ├── favicon.svg                  # Site favicon
│   └── staticwebapp.config.json     # Azure SPA fallback routing config
├── src/
│   ├── components/
│   │   └── ui/                      # Shadcn/ui component library (Button, Card, etc.)
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Responsive breakpoint hook
│   │   └── use-toast.ts             # Toast notification hook
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client init + TypeScript types
│   │   └── utils.ts                 # Tailwind className utility (cn)
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page with survey and results buttons
│   │   ├── Survey.tsx               # Five-question survey form with validation
│   │   ├── Confirmation.tsx         # Post-submission thank you and answer summary
│   │   ├── Results.tsx              # Bar chart dashboard of aggregated responses
│   │   └── not-found.tsx            # 404 fallback page
│   ├── App.tsx                      # Root component with Wouter router and routes
│   ├── index.css                    # Tailwind imports and CSS custom properties (theme)
│   └── main.tsx                     # React DOM entry point
├── index.html                       # HTML shell with font imports and root div
├── package.json                     # Package manifest with scripts and dependencies
├── tsconfig.json                    # TypeScript config extending workspace base
├── vite.config.ts                   # Vite config (base path, plugins, aliases)
└── supabase-setup.sql               # SQL to create table and configure RLS policies
```

## Changelog

### v1.0.0 — 2026-03-30

- Initial release of the University of Iowa Sports Passion Survey
- Five-question survey form with inline validation and submission state
- Supabase PostgreSQL integration for storing anonymous responses
- Confirmation page with answer summary after successful submission
- Results dashboard with four Recharts bar charts and total response count
- Mobile-responsive, WCAG 2.1 accessible layout
- Azure Static Web Apps deployment configuration included

## Known Issues / To-Do

- [ ] Results page shows a generic "Failed to load results" error if the Supabase table has not been created yet — a more helpful setup prompt would improve the experience for new deployments
- [ ] No duplicate submission prevention — the same user can submit the survey multiple times from the same browser session
- [ ] The gender and sports options are hardcoded in the component; they should be driven by a configuration file or database table to make future updates easier
- [ ] No loading skeleton is shown on the results page while chart data is being fetched

## Roadmap

- Add an admin-only dashboard protected by Supabase Auth Row Level Security for viewing response details
- Export results as a CSV file directly from the results page
- Add a progress bar or step indicator to the survey form
- Support additional Iowa sports (e.g. Swimming & Diving, Softball, Track & Field)
- Integrate Supabase Realtime so the results dashboard updates live as new responses arrive

## Contributing

Contributions, suggestions, and bug reports are welcome. Please open an issue first to discuss any significant changes before submitting a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main` and describe what you changed and why

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software for personal or academic purposes with attribution.

## Author

**George Smith**  
University of Iowa  
BAIS:3300 — Business Analytics & Information Systems, Spring 2026

## Contact

GitHub: [@georgesmith](https://github.com/georgesmith)

## Acknowledgements

- [Supabase Documentation](https://supabase.com/docs) — database setup, Row Level Security, and JavaScript client
- [Recharts Documentation](https://recharts.org/en-US/) — `BarChart`, `ResponsiveContainer`, and tooltip configuration
- [Vite Documentation](https://vite.dev/) — build tooling and environment variable handling
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) — utility-first styling reference
- [Wouter](https://github.com/molefrog/wouter) — lightweight React routing library
- [Shadcn/ui](https://ui.shadcn.com/) — accessible UI component primitives
- [shields.io](https://shields.io/) — README badge generation
- [Replit Agent](https://replit.com/) — AI-assisted scaffolding and development
