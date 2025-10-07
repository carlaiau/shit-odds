import "server-only";
import createClient from "openapi-fetch";
import type { paths } from "@/schema";
import type {
  GetSportsResult,
  GetOddsResult,
  GetEventMarketsResult,
  GetEventOddsResult,
  GetHistoricalEventsResult,
  GetHistoricalOddsForEventResult,
} from "@/types";
import { addDays, parse } from "date-fns";

const BASE_URL = "https://api.the-odds-api.com";
const API_KEY = process.env.ODDS_API_KEY ?? "";

const BOOKMAKERS = [
  "ladbrokes",
  "sportsbet",
  "unibet",
  "pinnacle",
  "betonlineag",
  "betmgm",
  "betrivers",
  "betus",
  "bovada",
  "williamhill_us",
  "draftkings",
  "fanatics",
  "fanduel",
  "lowvig",
  "mybookieag",
  "ballybet",
  "betanysports",
  "betparx",
  "espnbet",
  "fliff",
  "hardrockbet",
  "rebet",
  "windcreek",
];

if (!API_KEY) {
  console.warn("[odds] Missing ODDS_API_KEY env var");
}

const client = createClient<paths>({ baseUrl: BASE_URL });

// helper: ISO string without milliseconds (UTC)
function isoNoMs(d: Date) {
  return d.toISOString().split(".")[0] + "Z";
}

const daysAhead = 7;

export async function getSportsServer(): Promise<
  GetSportsResult[] | undefined
> {
  const { data, error } = await client.GET("/v4/sports", {
    next: { revalidate: 3600 },
    params: { query: { apiKey: API_KEY } },
  });
  if (error) {
    console.error("[odds] getSportsServer error:", error);
    return;
  }
  return data;
}

export async function getOddsForSportServer(
  sportKey: string,
  markets: string[],
  bookmakers: string[],
  includeLive = false
): Promise<GetEventOddsResult[] | undefined> {
  const commenceTimeTo =
    markets.length === 1 && markets[0] === "outrights"
      ? undefined
      : isoNoMs(addDays(new Date(), daysAhead));

  const commenceTimeFrom = includeLive ? undefined : isoNoMs(new Date());

  const { data, error } = await client.GET("/v4/sports/{sport}/odds", {
    next: { revalidate: 15 }, // tune per need
    params: {
      path: { sport: sportKey },
      query: {
        apiKey: API_KEY,
        regions: "au",
        oddsFormat: "decimal",
        markets: markets.join(",") as
          | "h2h"
          | "spreads"
          | "totals"
          | "outrights",
        commenceTimeTo,
        commenceTimeFrom,
        bookmakers: BOOKMAKERS.join(","),
      },
    },
  });

  if (error) {
    console.error("[odds] getOddsForSportServer error:", error);
    return;
  }
  return data as GetEventOddsResult[] | undefined;
}

export async function getOddsForEventServer(
  sportKey: string,
  eventId: string,
  markets: string[],
  bookmakers: string[]
): Promise<GetOddsResult | undefined> {
  const { data, error } = await client.GET(
    "/v4/sports/{sport}/events/{eventId}/odds",
    {
      next: { revalidate: 15 },
      params: {
        path: { sport: sportKey, eventId },
        query: {
          apiKey: API_KEY,
          regions: "au",
          oddsFormat: "decimal",
          markets: markets.filter((m) => m !== "outrights").join(","),
          bookmakers: BOOKMAKERS.join(","),
        },
      },
    }
  );

  if (error) {
    console.error("[odds] getOddsForEventServer error:", error);
    return;
  }
  return data as GetOddsResult | undefined;
}

export async function getEventMarketsServer(
  sportKey: string,
  eventId: string,
  bookmakers: string[]
): Promise<GetEventMarketsResult | undefined> {
  const { data, error } = await client.GET(
    "/v4/sports/{sport}/events/{eventId}/markets",
    {
      next: { revalidate: 600 },
      params: {
        path: { sport: sportKey, eventId },
        query: {
          apiKey: API_KEY,
          regions: "au", // essentially ignored due to bookmakers filter
          bookmakers: BOOKMAKERS.join(","),
        },
      },
    }
  );

  if (error) {
    console.error("[odds] getEventMarketsServer error:", error);
    return;
  }
  return data;
}

export async function getHistoricalEventsServer(
  sportKey: string,
  dateTo: string // YYYY-MM-DD
): Promise<GetHistoricalEventsResult | undefined> {
  const dateObject = parse(dateTo, "yyyy-MM-dd", new Date());
  console.log({ dateTo, dateObject });
  const { data, error } = await client.GET(
    "/v4/historical/sports/{sport}/events",
    {
      next: { revalidate: 3600 },
      params: {
        path: { sport: sportKey },
        query: {
          apiKey: API_KEY,
          date: isoNoMs(dateObject),
        },
      },
    }
  );
  if (error) {
    console.error("[odds] getHistoricalEventsServer error:", error);
    return;
  }
  return data;
}

export async function getHistoricalOddsForEvent(
  sportKey: string,
  eventId: string,
  bookmakers: string[],
  markets: string[],
  date: string // ISO8601 passed from the-odds-api
): Promise<GetHistoricalOddsForEventResult | undefined> {
  const { data, error } = await client.GET(
    "/v4/historical/sports/{sport}/events/{eventId}/odds",
    {
      next: { revalidate: 3600 },
      params: {
        path: { sport: sportKey, eventId },
        query: {
          apiKey: API_KEY,
          date,
          regions: "us",
          bookmakers: bookmakers.join(","),
          markets: markets.join(","),
        },
      },
    }
  );
  if (error) {
    console.error("[odds] getHistoricalEventsServer error:", error);
    return;
  }
  return data;
}
