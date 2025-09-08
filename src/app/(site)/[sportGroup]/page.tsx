import { notFound } from "next/navigation";
import { getSportsServer } from "@/lib/odds";
import { leagueToDecorationMap } from "@/data/decorator";
import type { GetSportsResult } from "@/types";
import GroupClient from "./groupClient";
import { Metadata } from "next";

type Props = {
  params: { sportGroup: string };
};

const capitalize = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sportGroup } = await params;
  const group = capitalize(sportGroup.replace(/-/g, " "));

  const title = `${group} odds comparison & EV | 💩 ShitOdds.com`;
  const description = `Compare ${group} odds across bookies. Find de-vigged prices and softbook EV. Without ads and slow UI.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${sportGroup}/`,
      type: "website",
    },
    alternates: {
      canonical: `/${sportGroup}/`,
    },
  };
}

export const revalidate = 600; // ISR, tune as needed

type Params = { params: { sportGroup: string } };

function groupByRegion(leagues: GetSportsResult[]) {
  return leagues.reduce<Record<string, GetSportsResult[]>>((acc, league) => {
    const key = league.key ?? "";
    const region = leagueToDecorationMap[key]?.region ?? "Other";
    (acc[region] ??= []).push(league);
    return acc;
  }, {});
}

export default async function Page({ params }: Params) {
  const sports = await getSportsServer();
  if (!sports) notFound();

  const { sportGroup } = await params;
  const byGroup = sports.filter(
    (s) => s.group?.toLowerCase().replace(/ /g, "-") === sportGroup
  );

  if (byGroup.length === 0) notFound();

  const outrights = byGroup.filter((s) => s.has_outrights);
  const regular = byGroup.filter((s) => !s.has_outrights);
  const groupedByRegion = groupByRegion(regular);

  return (
    <GroupClient
      sportGroup={sportGroup}
      outrights={outrights}
      groupedByRegion={groupedByRegion}
    />
  );
}
