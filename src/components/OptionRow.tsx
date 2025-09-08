import { useState } from "react";
import type { BookieWithPrice } from "../types";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { Text } from "../catalyst/text";

type OptionRowProps = {
  label: string;
  ev?: number | null;
  prices: BookieWithPrice[];
  nvpPrice?: number | null;
};

const abbreviation = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const MobileOptionRow = ({ label, ev, prices, nvpPrice }: OptionRowProps) => {
  const [open, setOpen] = useState(false);

  const howManyWithPrice = prices.filter((p) => p.price).length;

  const splitLabel = label.split("_");

  const { worst, best } = prices.reduce(
    (acc, b) => {
      if (b.price != null) {
        acc.sum += b.price;
        acc.count += 1;
        acc.worst = Math.min(acc.worst, b.price); // lowest price
        acc.best = Math.max(acc.best, b.price); // highest price
      }
      return acc;
    },
    { sum: 0, count: 0, worst: Infinity, best: -Infinity }
  );

  const worstPrice = worst === Infinity ? null : worst;
  const bestPrice = best === -Infinity ? null : best;

  if (howManyWithPrice === 0) {
    return null;
  }

  const bestBookie = prices.find((p) => p.price === bestPrice);

  const onePrice = howManyWithPrice == 1;

  return (
    <div className="border-b border-punt-200 dark:border-zinc-600 py-2">
      {/* Summary row */}
      <a
        className="w-full flex flex-wrap justify-start items-start px-0 py-2 text-sm md:text-base dark:text-white"
        onClick={() => setOpen(!open)}
      >
        <div className="w-8/12 flex flex-col justify-start items-start">
          <div className="flex w-full justify-between items-center">
            <span className="text-sm font-sans">{splitLabel[0]}</span>

            {splitLabel.length > 1 ? (
              <span className="text-sm font-sans">{splitLabel[1]}</span>
            ) : (
              <></>
            )}
          </div>
          {typeof ev === "number" && ev > 0 && (
            <div className="w-full flex justify-start py-2 items-center gap-2">
              <span className="rounded bg-green-600  py-0.5 px-2 text-white font-bold">
                {ev.toFixed(2) + "%"}
              </span>
              <span>Above EV</span>
            </div>
          )}
        </div>
        <span className="w-2/6 font-bold text-sm text-right font-mono">
          {bestPrice ? bestPrice.toFixed(2) : "-"}
        </span>

        <div className="w-full mt-1 flex justify-between items-center gap-2">
          {bestBookie ? (
            <div className="flex items-center gap-2">
              <div
                style={
                  bestBookie.backgroundColor
                    ? {
                        backgroundColor: bestBookie.backgroundColor,
                      }
                    : {}
                }
                className={
                  "w-8 h-8 flex items-center justify-center rounded-full p-1 bg-punt-900 dark:bg-punt-800"
                }
              >
                {bestBookie.hasSvg || bestBookie.hasPng ? (
                  <img
                    src={`/icons/bookies/${bestBookie.key}${
                      bestBookie.hasPng ? ".png" : ".svg"
                    }`}
                    alt={bestBookie.label}
                    className={`w-auto h-6 ${
                      bestBookie.needsRotated ? "rotate-0" : "rotate-90"
                    }`}
                  />
                ) : (
                  <p className="text-xs text-white">
                    {abbreviation(bestBookie.label)}
                  </p>
                )}
              </div>
              <Text className="text-xs">{bestBookie.label}</Text>
            </div>
          ) : (
            <></>
          )}

          <span className="flex text-xs text-punt-400 dark:text-punt-300 font-sans items-center">
            {howManyWithPrice} bookie{!onePrice ? "s" : ""}
            {open ? (
              <ChevronUpIcon className="w-5 h-5 dark:fill-punt-300" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 dark:fill-punt-300" />
            )}
          </span>
        </div>

        {nvpPrice ? (
          <div className="w-full flex items-center justify-between gap-2 mt-1">
            <div className="flex items-center justify-start gap-1">
              <span className="text-xs text-punt-400 dark:text-punt-300 font-sans">
                NVP
              </span>
              <span className="font-mono">{nvpPrice.toFixed(2)}</span>
            </div>
            {!onePrice ? (
              <>
                <Text className="text-xs">
                  {worstPrice?.toFixed(2)} - {bestPrice?.toFixed(2)}
                </Text>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : null}
      </a>

      {/* Expanded details */}
      {open && (
        <div className="pb-3 space-y-1">
          {prices
            .filter((p) => p.price)
            .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
            .map((p) => {
              return (
                <div
                  key={p.key}
                  className="flex items-center justify-between text-xs md:text-sm border-b last:border-0 border-punt-100 dark:border-zinc-600 py-2"
                >
                  <div className="w-5/6 flex justify-start items-center gap-2">
                    <div
                      style={
                        p.backgroundColor
                          ? {
                              backgroundColor: p.backgroundColor,
                            }
                          : {}
                      }
                      className={
                        "w-8 h-8 flex items-center justify-center rounded-full p-1 bg-punt-900 dark:bg-punt-800"
                      }
                    >
                      {p.hasSvg || p.hasPng ? (
                        <img
                          src={`/icons/bookies/${p.key}${
                            p.hasPng ? ".png" : ".svg"
                          }`}
                          alt={p.label}
                          className={`w-auto h-6 ${
                            p.needsRotated ? "rotate-0" : "rotate-90"
                          }`}
                        />
                      ) : (
                        <p className="text-xs text-white">
                          {abbreviation(p.label)}
                        </p>
                      )}
                    </div>
                    <Text className="text-xs">{p.label}</Text>
                  </div>
                  <div className="w-1/6 text-right">
                    <span
                      className={
                        "font-bold font-mono text-sm  " +
                        (p.price === bestPrice
                          ? " text-green-600 dark:text-green-400"
                          : "dark:text-white")
                      }
                    >
                      {p.price ? p.price.toFixed(2) : "-"}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MobileOptionRow;
