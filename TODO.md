# TODO

- [x] Move NWS weather fetching to the server and allow-list `api.weather.gov` in `devvit.json` (replaced the Vite dev proxy)
- [ ] Get Reddit's approval for the `api.weather.gov` fetch domain
- [ ] Pick the first 20 cities and their NWS station IDs
- [ ] Fetch observed highs (actuals) for settling calls
- [ ] Daily Scheduler job: settle yesterday, fetch forecasts, create today's post
- [x] Shared domain types (`src/shared/types.ts`) and scoring/format/chart-geometry helpers with tests
- [x] Unstyled, prop-driven component library (`src/client/components/`) from the design canvas
- [x] Today's calls screen (`src/client/screens/TodayScreen.tsx`) on sample data in the `TodayResponse` shape
- [ ] Question, Call locked and Result card screens, plus navigation between them
- [ ] Replace the sample data in `game.tsx` with `GET /api/today` (also drops the counter routes and the frozen sample clock)
- [ ] Core loop: daily questions, calls and scoring in Redis
- [ ] Style the components (last step)
- [ ] Remove the temporary component preview (`preview.html`, `preview.tsx`, `preview/`, its devvit.json entrypoint and the splash button)
- [ ] Rewrite README.md to describe the game and how to play (required for submission)
