"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import type { GetOddsResult } from "@/types";

import EventCard from "@/components/EventCard";
import { Button } from "@/catalyst/button";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Subheading } from "@/catalyst/heading";
import { Text } from "@/catalyst/text";
import { OurSwiperProps, OurThumbSwiperProps } from "@/config";

type Props = {
  sportGroup: string;
  sportKey: string;
  activeOdds: GetOddsResult[];
};

export default function LeagueClient({
  sportGroup,
  sportKey,
  activeOdds,
}: Props) {
  // No useState/useEffect — just a ref for the swiper instance
  const mainSwiperRef = useRef<any>(null);

  return (
    <>
      <Button
        to={`/${sportGroup}/`}
        className="mb-4 flex items-center"
        color="punt"
      >
        <ArrowLeftIcon />
        <span className="text-xs capitalize">
          {sportGroup.replace(/-/g, " ")}
        </span>
      </Button>

      {activeOdds.length > 0 ? (
        <>
          <Swiper
            key={`${sportGroup}-${sportKey}-thumbs`}
            {...OurThumbSwiperProps}
            modules={[Grid]}
          >
            {activeOdds.length > 1 &&
              activeOdds.map((odd, idx) => (
                <SwiperSlide
                  key={`${odd.id}-${idx}`}
                  className="cursor-pointer px-2 py-1 rounded-md text-sm bg-white dark:bg-zinc-600 my-1"
                  style={{ width: "auto" }}
                  onClick={() => mainSwiperRef.current?.slideTo(idx)}
                >
                  <div className="flex w-full gap-1 items-center">
                    <Text className="font-medium text-sm">{odd.home_team}</Text>
                    <p className="text-xs dark:text-white/50"> vs </p>
                    <Text className="font-medium text-sm">{odd.away_team}</Text>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          <Swiper
            {...OurSwiperProps}
            key={`${sportGroup}-${sportKey}-main`}
            onSwiper={(swiper) => {
              mainSwiperRef.current = swiper;
            }}
          >
            {activeOdds.map((o) => (
              <SwiperSlide key={o.id}>
                <EventCard odd={o} isOnEventPage={false} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : (
        <div>
          <Subheading>No Events Found</Subheading>
          <Text>
            With the current filters. Try changing the filters in the sidebar.
          </Text>
          <Text>
            Aside from outright markets events are only up to 7 days out.
          </Text>
        </div>
      )}
    </>
  );
}
