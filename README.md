# 💩 Shit Odds Compare & EV Finder

ShitOdds is an odds comparison web app for people who are tired of sportsbooks serving up shit odds. It is powered by data from [the-odds-api.com](https://the-odds-api.com). It also includes Pinnacle and de-vigs Pinnacle lines to show you the real probabilities, and highlights softbook edges so you can see where value actually exists.

There are no ads, and we aimed for a mobile first fast experience rather than the majority of odd comparison services out there.

Built with **Next.js 15 (App Router)** and **React 19**, styled with **Tailwind CSS 4 + Catalyst**.  
Networking is fully **type-safe** using [`openapi-fetch`](https://github.com/drwpow/openapi-fetch) and a schema generated automatically from the Odds API OpenAPI YAML.

## Features

- Compare betting odds across multiple bookmakers and markets.
- Always includes Pinnacle (sharp book) and removes vig to show true probabilities.
- Highlights positive EV opportunities available at soft books.
- Responsive design with Tailwind CSS 4 and Catalyst components.
- Dark mode support built-in.
- Mobile-friendly UI with a clean layout and swipe gestures
- Fast SSR/ISR rendering with Next.js caching (`fetch` + `revalidate`).
- Type-safe API client with generated schema from Odds API
- User settings with composable React contexts (markets, bookmakers, in-play toggles)

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, React Server Components, Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) + [Catalyst](https://tailwindui.com/catalyst) for UI primitives
- [TypeScript](https://www.typescriptlang.org/)
- [openapi-fetch](https://github.com/drwpow/openapi-fetch) for API calls
- [the-odds-api.com](https://the-odds-api.com) as the data provider

## Getting Started

### 1. Clone the repo

```bash
npm install
# or
yarn install
```

### 2. Configure environment variables

Create a .env file in the root with your Odds API key:

```env
ODDS_API_KEY=your_api_key_here
```

You can get a free API key from [the-odds-api.com](https://the-odds-api.com).

### 3. Create an issue, contribute. Have fun!

It's a work in progress. There are plenty of things to do.

- There are issues with how some of the alternative markets are displayed.
- It'd be great to integrate a secondary odds aggregation service and unify the frontend with one schema.
- Kelly Criterion calculator would be a nice addition too as would
- American and fractional odds display options.
- Favoriting leagues and events
- Actual server and alerting of events with EV opportunities.

### 4. Note for New Zealanders

If you’re in New Zealand, bad news: offshore bookies are now banned (except for the conveniently protected local monopoly)... [NZ Herald](https://www.nzherald.co.nz/sport/racing/nz-bans-offshore-betting-tab-gains-monopoly-with-new-law/YL2MJEWX25EK5IY5XV7KOJH62Y/).

Betcha and the NZ TAB piggyback on Ladbrokes Australia’s odds, so you can still use the app to hunt for EV — just don’t expect tonnes of value as Ladbrokes are anything but competitive.
