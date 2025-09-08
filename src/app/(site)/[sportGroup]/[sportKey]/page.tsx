import { notFound } from "next/navigation";
import { getOddsForSportServer, getSportsServer } from "@/lib/odds";
import { getSettingsFromCookies, defaultSettings } from "@/lib/settings";
import type { GetOddsResult } from "@/types";
import LeagueClient from "./leagueClient";
import { Metadata } from "next";

export const revalidate = 60; //

type Params = {
  params: { sportGroup: string; sportKey: string };
};

const capitalize = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sportGroup, sportKey } = await params;
  const specificSport = capitalize(sportKey.replace(/-/g, " "));

  const title = `${specificSport} odds comparison & EV | 💩 ShitOdds.com`;
  const description = `Compare ${specificSport} odds across bookies. Find de-vigged prices and softbook EV. Without ads and slow UI.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${sportGroup}/${sportKey}/`,
      type: "website",
    },
    alternates: {
      canonical: `/${sportGroup}/${sportKey}/`,
    },
  };
}

export default async function Page({ params }: Params) {
  const { sportGroup, sportKey } = await params;
  const settings = (await getSettingsFromCookies()) ?? defaultSettings;

  // get all sports to determine if the specific sport has outrights
  const sports = await getSportsServer();
  if (!sports) notFound();

  const apiSportKey = sportKey.replace(/-/g, "_");
  const specificSport = sports.find((s) => s.key === apiSportKey);
  if (!specificSport) notFound();

  const markets = specificSport.has_outrights
    ? ["outrights"]
    : [settings.defaultMarket];

  const data = (await getOddsForSportServer(
    apiSportKey,
    markets,
    settings.bookmakers,
    settings.includeLive ?? false
  )) as GetOddsResult[] | undefined;

  // data can be undefined on upstream error; show empty state rather than loading
  const activeOdds: GetOddsResult[] = data ?? [];

  return (
    <LeagueClient
      sportGroup={sportGroup}
      sportKey={sportKey}
      activeOdds={activeOdds}
    />
  );
}
