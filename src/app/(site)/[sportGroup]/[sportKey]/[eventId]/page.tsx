import { notFound } from "next/navigation";
import {
  getEventMarketsServer,
  getOddsForEventServer,
  getSportsServer,
} from "@/lib/odds";
import { getSettingsFromCookies, defaultSettings } from "@/lib/settings";
import { marketsThatAreSupported } from "@/config";
import type { GetEventOddsResult, GetOddsResult } from "@/types";
import EventClient from "./eventClient";
import { Metadata } from "next";

// show fresh-ish but cached page; adjust for your needs
export const revalidate = 10;

const capitalize = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

type Params = {
  params: { sportGroup: string; sportKey: string; eventId: string };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sportGroup, sportKey, eventId } = await params;
  const specificSport = capitalize(sportKey.replace(/-/g, " "));

  const title = `${specificSport} odds comparison & EV | 💩 ShitOdds.com`;
  const description = `Compare ${specificSport} odds across bookies. Find de-vigged prices and softbook EV. Without ads and slow UI.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${sportGroup}/${sportKey}/${eventId}/`,
      type: "website",
    },
    alternates: {
      canonical: `/${sportGroup}/${sportKey}/${eventId}/`,
    },
  };
}

type MarketEntry = { market: string; bookmakers: string[] };

function buildMarketTypeByBookmakerArray(
  event: GetEventOddsResult
): MarketEntry[] {
  const result: MarketEntry[] = [];
  const supported = new Set(marketsThatAreSupported.map((m) => m.key));

  event.bookmakers?.forEach((bk: any) => {
    bk.markets.forEach((m: any) => {
      // we only list "additional" markets (i.e., exclude the supported summary ones)
      if (supported.has(m.key)) return;
      let entry = result.find((e) => e.market === m.key);
      if (!entry) {
        entry = { market: m.key, bookmakers: [] };
        result.push(entry);
      }
      entry.bookmakers.push(bk.key);
    });
  });

  // sort by coverage
  result.sort((a, b) => b.bookmakers.length - a.bookmakers.length);
  return result;
}

export default async function Page({ params }: Params) {
  const settings = (await getSettingsFromCookies()) ?? defaultSettings;
  const { sportGroup, sportKey, eventId } = await params;
  // Validate sport exists (optional, but nice)
  const sports = await getSportsServer();
  if (!sports) notFound();

  const apiSportKey = sportKey.replace(/-/g, "_");
  const sport = sports.find((s) => s.key === apiSportKey);
  if (!sport) notFound();

  // 1) Summary block (your “supported” markets)
  const summaryOdds = (await getOddsForEventServer(
    apiSportKey,
    eventId,
    marketsThatAreSupported.map((m) => m.key),
    settings.bookmakers
  )) as GetOddsResult | undefined;

  // 2) Available markets list (for the “Additional Markets” grid)
  const eventMarketData = await getEventMarketsServer(
    apiSportKey,
    eventId,
    settings.bookmakers
  );

  const availableMarkets = eventMarketData
    ? buildMarketTypeByBookmakerArray(eventMarketData)
    : [];

  return (
    <EventClient
      sportGroup={sportGroup}
      sportKey={sportKey}
      eventId={eventId}
      summaryOdds={summaryOdds}
      availableMarkets={availableMarkets}
    />
  );
}
