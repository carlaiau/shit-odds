import _ from "lodash";

import type { GetOddsResult, GetSportsResult } from "../types";
import { Subheading } from "../catalyst/heading";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper styles
import "swiper/css";
import { Button } from "../catalyst/button";

import OddsTable from "./OddsTable";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { useSportData } from "../context/sports";
import { useEffect, useState } from "react";
import { marketsThatAreSupported, OurSwiperProps } from "../config";
import { useSettings } from "../context/settings";
import EventDate from "./EventDate";

const EventCard = ({
  odd,
  isOnEventPage = false,
}: {
  odd: GetOddsResult;
  isOnEventPage?: boolean;
}) => {
  const params = useParams<{ sportGroup: string; sportKey?: string }>();
  const { settings } = useSettings();
  const { defaultMarket } = settings;
  const { data: sportData } = useSportData();
  const [sport, setSport] = useState<GetSportsResult | undefined>(undefined);
  useEffect(() => {
    if (!sportData || !params.sportKey) return;

    const specificSport = sportData?.find(
      (s) => s.key === params.sportKey?.replace(/-/g, "_")
    );

    if (!specificSport) {
      return;
    }

    setSport(specificSport);
  }, [sportData]);

  if (!params.sportGroup) {
    return <div>Sport Group is missing in the URL</div>;
  }
  if (!params.sportKey) {
    return <div>Sport Key is missing in the URL</div>;
  }

  let event = odd;

  return (
    <div
      className={`lg:rounded-md ${
        !isOnEventPage
          ? "bg-white dark:bg-zinc-800 p-2 pt-3 rounded-md shadow-md "
          : ""
      }`}
    >
      {event.sport_key && isOnEventPage && (
        <Button
          className="mb-4 flex items-center"
          to={`/${params.sportGroup}/${params.sportKey}/`}
          color="punt"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-xs">Back to {sport?.title ?? "League"}</span>
        </Button>
      )}
      {/* Event Header */}
      <div className="mb-2 text-left">
        <Subheading>
          {event.home_team && event.away_team
            ? event.home_team + " at " + event.away_team
            : event.sport_title}
        </Subheading>
        <EventDate event={event} />
      </div>

      {/* Odds Table */}
      <div className={"overflow-x-auto font-mono"}>
        {sport?.has_outrights ? (
          <OddsTable
            event={event}
            marketKey={"outrights"}
            title={"Outrights"}
            isOnEventPage={isOnEventPage}
          />
        ) : !isOnEventPage ? (
          <OddsTable
            event={event}
            marketKey={defaultMarket}
            title={defaultMarket}
            isOnEventPage={isOnEventPage}
          />
        ) : (
          <Swiper {...OurSwiperProps} key={event.id + "-main"}>
            {marketsThatAreSupported
              .sort((a, b) => {
                return a.key.localeCompare(b.key);
              })
              .map((m) => (
                <SwiperSlide>
                  <OddsTable
                    event={event}
                    marketKey={m.key}
                    title={m.label}
                    key={m.key}
                    isOnEventPage={isOnEventPage}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>

      {!sport?.has_outrights && event.sport_key && !isOnEventPage && (
        <Button
          to={`/${params.sportGroup}/${params.sportKey}/${event.id}/`}
          className="ml-auto flex items-center"
          color="punt"
        >
          <span className="text-xs">See all markets</span>
          <ArrowRightIcon />
        </Button>
      )}
    </div>
  );
};

export default EventCard;
