## Devvit React Starter

A starter to build web applications on Reddit's developer platform

- [Devvit](https://developers.reddit.com/): A way to build and deploy immersive games on Reddit
- [Vite](https://vite.dev/): For compiling the webView
- [React](https://react.dev/): For UI
- [Hono](https://hono.dev/): For backend logic
- [Tailwind](https://tailwindcss.com/): For styles
- [TypeScript](https://www.typescriptlang.org/): For type safety

## Getting Started

> Make sure you have Node 22 downloaded on your machine before running!

1. Run `npm create devvit@latest --template=react`
2. Go through the installation wizard. You will need to create a Reddit account and connect it to Reddit developers
3. Copy the command on the success page into your terminal

## Commands

- `npm run dev`: Starts a development server where you can develop your application live on Reddit.
- `npm run build`: Builds your client and server projects
- `npm run deploy`: Uploads a new version of your app
- `npm run launch`: Publishes your app for review
- `npm run login`: Logs your CLI into Reddit
- `npm run test:types`: Type checks the client, server and shared code
- `npm run lint`: Lints `src/`
- `npm run test:unit`: Runs `src/**/*.test.ts` with Node's test runner

## Weather data

Highball uses the [National Weather Service API](https://www.weather.gov/documentation/services-web-api) (`api.weather.gov`), which is free and needs no key.

- All requests go from the Devvit server, never from the browser. The client in `src/server/core/weather.ts` exposes `getForecast(lat, lon)`, which returns the 12-hour day/night forecast periods for a US location.
- Devvit only lets apps fetch allow-listed domains. `api.weather.gov` is listed under `permissions.http.domains` in `devvit.json`; Reddit must also approve the domain request before it works in a deployed app.

## Components

`src/client/components/` holds the game's building blocks, catalogued from the design canvas. They are unstyled on purpose; styling comes last.

- Data comes in through props. Components don't fetch or hold app state.
- Game rules (prices, payouts, scoring) live in `src/shared/scoring.ts`; parents compute them and pass results down. Text formatting lives in `src/shared/format.ts` and chart math in `src/shared/chartGeometry.ts`.
- Each root element has `data-component="<name>"`, inner pieces have `data-part="<name>"`, and state shows up as `data-*` attributes (`data-side`, `data-sign`, `data-result`, `data-category`, …) to style against later.

**Screens.** `src/client/screens/` composes components into full screens. Each screen takes one API response type from `src/shared/api.ts` plus callbacks. The Today's calls screen (`TodayScreen`) is live in the expanded post (`game.tsx`). For now it runs on sample data, with calls kept in local state.

**Component preview (temporary).** `src/client/preview.tsx` renders every component with sample data from the designs (`src/client/preview/fixtures.ts`). In a playtest, tap **Component preview** on the splash screen. To view it locally: `npm run build`, then serve `dist/client` (for example `python3 -m http.server -d dist/client`) and open `/preview.html`.
