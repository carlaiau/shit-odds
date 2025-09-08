"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import Flag from "react-world-flags";

import type { GetSportsResult } from "@/types";
import { Subheading } from "@/catalyst/heading";
import { Link } from "@/catalyst/link"; // if this is Next wrapper, keep; else swap to next/link
import { Badge } from "@/catalyst/badge";
import { leagueToDecorationMap } from "@/data/decorator";
import type { LeagueDecorationInformation } from "@/data/decorator";
import { OurGroupSwiperProps } from "@/config";

type Props = {
  sportGroup: string;
  outrights: GetSportsResult[];
  groupedByRegion: Record<string, GetSportsResult[]>;
};

export default function GroupClient({
  sportGroup,
  outrights,
  groupedByRegion,
}: Props) {
  return (
    <div id="group-page">
      <div>
        {outrights.length > 0 && (
          <div className="mb-10">
            <Subheading>Outrights</Subheading>
            <Swiper
              key={`${sportGroup}-outrights`}
              {...OurGroupSwiperProps(outrights.length === 1)}
              grid={{ rows: 2, fill: "row" }}
              modules={[Grid]}
              className="w-full mt-2 mb-5"
            >
              {outrights.map((sport) => (
                <SwiperSlide key={sport.key}>
                  <SportCard
                    group={sportGroup}
                    sport={sport}
                    decorationInformation={
                      leagueToDecorationMap[sport.key ?? ""]
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <div>
        {Object.entries(groupedByRegion).map(([region, subLeagues]) => (
          <div key={region}>
            <Subheading>{region}</Subheading>
            <Swiper
              key={`${sportGroup}-${region}-leagues`}
              {...OurGroupSwiperProps(false)}
              grid={{ rows: 2, fill: "row" }}
              modules={[Grid]}
              className="w-full mt-2 mb-5"
            >
              {subLeagues.map((sport) => (
                <SwiperSlide key={sport.key}>
                  <SportCard
                    group={sportGroup}
                    sport={sport}
                    decorationInformation={
                      leagueToDecorationMap[sport.key ?? ""]
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </div>
  );
}

function SportCard({
  group,
  sport,
  decorationInformation,
}: {
  group: string;
  sport: GetSportsResult;
  decorationInformation?: LeagueDecorationInformation;
}) {
  return (
    <Link to={`/${group}/${sport.key?.replace(/_/g, "-")}/`} className="h-full">
      <div className="h-full p-5 border border-punt-300 rounded-md hover:shadow-lg text-left bg-white dark:bg-punt-900 dark:border-punt-700 my-2">
        <Subheading className="mb-2 leading-snug">{sport.title}</Subheading>

        <p className="text-sm text-gray-600 dark:text-white/80 mb-2">
          {sport.description}
        </p>

        {decorationInformation?.countryCode && (
          <Flag
            code={decorationInformation.countryCode}
            className="h-5 rounded mb-2"
          />
        )}

        {sport.has_outrights && (
          <Badge className="mb-2" color="green">
            Has Outrights
          </Badge>
        )}
      </div>
    </Link>
  );
}
