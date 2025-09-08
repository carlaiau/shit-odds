// src/components/MarketOddsTables.tsx
import React, { useMemo } from "react";
import type { BookieWithPrice, GetEventOddsResult } from "../types";
import { Subheading } from "../catalyst/heading";
import { devigPowerMethod } from "../utils";
import _ from "lodash";
import { bookiesThatAreSupported } from "../config";
import OptionRow from "./OptionRow";

type Option = {
  name: string;
  point: number | undefined;
  booksPrices: Record<string, OptionPrice>;
};

type OptionPrice = {
  name: string;
  price: number;
  point: number | undefined;
};
type OptionToPriceHelper = Record<string, Option>;

const deVigLabel = "NVP";

const includesPinnacle = (books: { key: string; title: string }[]) =>
  _.find(books, { key: "pinnacle" });

function buildMatrix(event: GetEventOddsResult, marketKey: string) {
  if (!event.bookmakers) return;
  // Gather all bookmaker titles in stable order
  const books = event.bookmakers.map((b) => ({
    title: b.title ?? "",
    key: b.key ?? "",
  }));

  if (includesPinnacle(books)) {
    books.push({ title: deVigLabel, key: deVigLabel });
  }

  // Player -> { [bookTitle]: price }
  const optionToPrices: OptionToPriceHelper = {};

  for (const book of event.bookmakers) {
    if (!book.markets || !book.title) continue;
    const market = book.markets.find((m) => m.key === marketKey);
    if (!market) continue;

    if (!market.outcomes) continue;

    if (book.title == "Pinnacle") {
      const toDevig = [];
      for (const o of market.outcomes) {
        if (o.price) {
          toDevig.push(o.price);
        }
      }
      const devigged = devigPowerMethod(toDevig, 1);
      market.outcomes.forEach((o, idx) => {
        const label =
          (o.description?.trim() ?? o.name?.trim()) +
          (o.point != null ? `_${o.point}` : "");

        if (!label) return;

        const option: OptionPrice = {
          name: label,
          price: devigged[idx] ? 1 / devigged[idx] : 0,
          point: o.point ?? undefined,
        };

        // Initialize (or reuse) the entry once, then use the narrowed var
        const entry = (optionToPrices[label] ??= {
          name: label,
          point: o.point ?? undefined,
          booksPrices: {},
        });

        entry.booksPrices[deVigLabel] = option;
      });
    }

    for (const o of market.outcomes) {
      const label =
        (o.description?.trim() ?? o.name?.trim()) +
        (o.point != null ? `_${o.point}` : "");

      if (!label) continue;

      const option: OptionPrice = {
        name: label,
        price: o.price ?? 0,
        point: o.point ?? undefined,
      };

      const entry = (optionToPrices[label] ??= {
        name: label,
        point: o.point ?? undefined,
        booksPrices: {},
      });

      // book.title is string, so safe as a key
      entry.booksPrices[book.title] = option;
    }
  }

  return { books, optionToPrices };
}

function bestPriceForRow(row: Record<string, OptionPrice>) {
  let best = -Infinity;
  for (const v of Object.values(row)) {
    if (v.price > best) {
      best = v.price;
    }
  }
  return best === -Infinity ? undefined : best;
}

function shortestPriceForRow(row: Option) {
  let shortest = Infinity;
  for (const v of Object.values(row.booksPrices)) {
    if (v.price < shortest) {
      shortest = v.price;
    }
  }
  return shortest === Infinity ? undefined : shortest;
}

const OddsTable: React.FC<{
  event: GetEventOddsResult;
  marketKey: string;
  title?: string;
  isOnEventPage?: boolean;
}> = ({ event, marketKey, title, isOnEventPage }) => {
  const matrix = useMemo(
    () => buildMatrix(event, marketKey),
    [event, marketKey]
  );

  if (!matrix) {
    return <></>;
  }
  const { books, optionToPrices } = matrix;

  if (!optionToPrices || Object.keys(optionToPrices).length === 0) {
    return <></>;
  }

  return (
    <div
      className={
        ` overflow-x-auto bg-white dark:bg-zinc-800 rounded-md py-2` +
        (isOnEventPage ? " px-2 shadow-md " : "")
      }
    >
      <Subheading key={marketKey} className={"capitalize"}>
        {title ?? marketKey}
      </Subheading>
      <div className="my-2">
        {sortKeys(optionToPrices, marketKey).map((label) => {
          const row = optionToPrices[label];
          if (!row) return null;

          const best = bestPriceForRow(row.booksPrices ?? {});
          const hasEv = includesPinnacle(books);
          let evCalc: number | null = null;

          if (hasEv && row.booksPrices[deVigLabel] && best) {
            const val = row.booksPrices[deVigLabel];
            evCalc = (1 / val.price - 1 / best) * 100;
          }

          const prices = books.map((bk) => {
            const val = row.booksPrices[bk.title];
            const foundBookie = bookiesThatAreSupported.find(
              (b) => b.key === bk.key
            );
            if (!foundBookie) {
              // NPV counts here
              return {
                key: bk.key,
                label: bk.title,
                price: val?.price ?? null,
                isBest: val?.price === best,
                textColor: "#ffffff",
                backgroundColor: "#880000",
              } as BookieWithPrice;
            }
            return {
              key: bk.key,
              label: foundBookie.label ? foundBookie.label : bk.title,
              price: val?.price ?? null,
              isBest: val?.price === best,
              hasSvg: foundBookie?.hasSvg,
              hasPng: foundBookie?.hasPng,
              backgroundColor: foundBookie?.backgroundColor,
              needsRotated: foundBookie?.needsRotated,
              countryCode: foundBookie?.countryCode,
            } as BookieWithPrice;
          });

          return (
            <OptionRow
              key={label}
              label={label}
              ev={evCalc}
              prices={prices.filter((p) => p.key !== deVigLabel)}
              nvpPrice={row.booksPrices[deVigLabel]?.price ?? null}
            />
          );
        })}
      </div>
    </div>
  );
};

function sortKeys(options: Record<string, Option>, kind: string): string[] {
  const arr = Object.keys(options);

  if (kind == "h2h") {
    if (arr.includes("Draw") && arr.length == 3) {
      arr.splice(arr.indexOf("Draw"), 1);
      arr.splice(1, 0, "Draw");
    }
    return arr;
  }
  return arr.sort(
    (a: keyof OptionToPriceHelper, b: keyof OptionToPriceHelper) => {
      const optionA = options[a];
      const optionB = options[b];
      if (!optionA || !optionB) return 0;

      switch (kind) {
        case "totals":
          const isOverA = optionA.name.startsWith("Over_");
          const isOverB = optionB.name.startsWith("Over_");

          if (isOverA !== isOverB) return isOverA ? -1 : 1;

          if (optionA.point === undefined || optionB.point === undefined) {
            return 0;
          }
          if (isOverA && isOverB) return optionB.point - optionA.point; // Over → desc
          return optionA.point - optionB.point; // Under → asc

        case "spreads":
          if (optionA.point === undefined || optionB.point === undefined) {
            return 0;
          }
          const isPosA = optionA.point >= 0;
          const isPosB = optionB.point >= 0;

          if (isPosA !== isPosB) return isPosA ? -1 : 1;

          if (isPosA && isPosB) return optionB.point - optionA.point; // pos → desc
          return optionB.point - optionA.point; // neg → asc
        default:
          if (optionA.point && optionB.point) {
            // It needs to be alphabetical, and then ordered by the points
            if (optionA.name === optionB.name) {
              return optionA.point - optionB.point;
            }
            return optionA.name.localeCompare(optionB.name);
          }
          // Eveything else
          const pa = shortestPriceForRow(optionA ?? {}) ?? Infinity;
          const pb = shortestPriceForRow(optionB ?? {}) ?? Infinity;
          return pa - pb; // lower odds first = more favored
      }
    }
  );
}

export default OddsTable;
