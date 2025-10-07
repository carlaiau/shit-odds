"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { GetEventOddsResult, GetOddsResult } from "@/types";

import EventCard from "@/components/EventCard";
import OddsTable from "@/components/OddsTable";
import { Subheading } from "@/catalyst/heading";
import { Text } from "@/catalyst/text";
import { OurSwiperProps } from "@/config";

type MarketEntry = { market: string; bookmakers: string[] };

type Props = {
  sportGroup: string;
  sportKey: string;
  eventId: string;
  summaryOdds?: GetOddsResult;
  availableMarkets: MarketEntry[];
};

const DEFAULT_ADDITIONAL_MARKETS = [
  "player_reception_yds",
  "player_rush_yds",
  "player_pass_yds",
  "player_reception_yds_alternate",
  "player_rush_yds_alternate",
  "player_pass_yds_alternate",
  "player_anytime_td",
];
export default function EventClient({
  sportKey,
  eventId,
  summaryOdds,
  availableMarkets,
}: Props) {
  const [additionalMarkets, setAdditionalMarkets] = useState<
    Record<string, GetEventOddsResult> | undefined
  >(undefined);

  useEffect(() => {
    DEFAULT_ADDITIONAL_MARKETS.forEach(async (market: string) => {
      if (
        availableMarkets.find(
          (m) => m.market === market && m.bookmakers && m.bookmakers.length > 10
        )
      ) {
        // load the first one we find
        await openAdditionalMarket(market, true);
      }
    });
  }, []);

  const additionalSwiperRef = useRef<SwiperType | null>(null);

  const openAdditionalMarket = async (
    marketKey: string,
    dontSwipe?: boolean
  ) => {
    // already loaded? just slide to it
    if (additionalMarkets?.[marketKey]) {
      const idx = findSlideIndexByDataId(
        additionalSwiperRef.current,
        marketKey
      );
      if (idx >= 0) additionalSwiperRef.current?.slideTo(idx);
      return;
    }

    // fetch from our server API route (no secret exposed)
    const res = await fetch(
      `/api/event/${sportKey.replace(
        /-/g,
        "_"
      )}/${eventId}/market?market=${encodeURIComponent(marketKey)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return; // optionally show toast/error
    const data = (await res.json()) as GetOddsResult;

    setAdditionalMarkets((prev) => ({
      ...(prev ?? {}),
      [marketKey]: data as unknown as GetEventOddsResult,
    }));

    if (dontSwipe) return;
    // wait for slide to mount then navigate
    requestAnimationFrame(() => {
      const idx = findSlideIndexByDataId(
        additionalSwiperRef.current,
        marketKey
      );
      if (idx >= 0) additionalSwiperRef.current?.slideTo(idx);
    });
  };

  return (
    <>
      {summaryOdds ? (
        <EventCard odd={summaryOdds} isOnEventPage={true} />
      ) : (
        <div className="mt-6">
          <Subheading>No summary markets found</Subheading>
          <Text>Try loading an additional market below.</Text>
        </div>
      )}

      {availableMarkets.length > 0 && (
        <div className="flex flex-col w-auto p-1 lg:p-2 lg:m-2 lg:mb-2 mt-5">
          <Subheading>Additional Markets</Subheading>
          <div className="w-full">
            <Swiper
              slidesPerView="auto"
              grid={{ rows: 4, fill: "row" }}
              spaceBetween={5}
              freeMode
              className="w-full my-2"
              modules={[Grid]}
            >
              {availableMarkets.map((m) => {
                const loaded = !!additionalMarkets?.[m.market];
                return (
                  <SwiperSlide
                    key={m.market}
                    className={`cursor-pointer text-sm my-1 p-2 rounded-md ${
                      loaded ? "bg-green-800" : "bg-punt-800"
                    }`}
                    style={{ width: "auto" }}
                    onClick={() => openAdditionalMarket(m.market)}
                  >
                    <div className="flex flex-col capitalize">
                      <p className="text-sm text-white">
                        {m.market.replace(/_/g, " ")}
                      </p>
                      <div
                        className={`flex text-xs w-auto p-1 mt-1 rounded-md justify-center text-white ${
                          loaded ? "bg-green-500" : "bg-punt-500"
                        }`}
                      >
                        {m.bookmakers.length} bookies
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}

      {additionalMarkets && (
        <Swiper
          {...OurSwiperProps}
          onSwiper={(s) => {
            additionalSwiperRef.current = s;
          }}
        >
          {Object.entries(additionalMarkets).map(([marketKey, event]) => (
            <SwiperSlide key={marketKey} data-id={marketKey}>
              <OddsTable
                event={event}
                marketKey={marketKey}
                title={marketKey.replace(/_/g, " ")}
                isOnEventPage
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}

function findSlideIndexByDataId(swiper: SwiperType | null, id: string) {
  if (!swiper) return -1;
  return Array.from(swiper.slides).findIndex(
    (el) => el.getAttribute("data-id") === id
  );
}
