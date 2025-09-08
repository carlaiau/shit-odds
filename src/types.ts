import type { paths } from "./schema";

export type GetSportsResult =
  paths["/v4/sports"]["get"]["responses"]["200"]["content"]["application/json"][number];

export type GetOddsResult =
  paths["/v4/sports/{sport}/odds"]["get"]["responses"]["200"]["content"]["application/json"][number];

export type GetEventOddsResult =
  paths["/v4/sports/{sport}/events/{eventId}/odds"]["get"]["responses"]["200"]["content"]["application/json"];

export type GetEventMarketsResult =
  paths["/v4/sports/{sport}/events/{eventId}/markets"]["get"]["responses"]["200"]["content"]["application/json"];

export type SupportedBookmaker = {
  key: string;
  label: string;
  backgroundColor?: string;
  textColor?: string;
  countryCode: string;
  hasSvg?: boolean;
  hasPng?: boolean;
  needsRotated?: boolean;
};
export type BookieWithPrice = SupportedBookmaker & {
  price: number | null;
  isBest?: boolean;
};

export type SupportedMarket = {
  key: string;
  label: string;
  type?: "spread" | "total";
  description?: string;
  filteredFor?: string; // sport key that this market is only relevant for
  dontAbbreviate?: boolean; // don't abbreviate the label in the UI
};
