import type { SwiperProps } from "swiper/react";
import type { SupportedBookmaker, SupportedMarket } from "./types";

export const sportsToFilterOut = ["Lacrosse", "Politics"];

export const marketsThatAreSupported: SupportedMarket[] = [
  { key: "h2h", label: "H2H", description: "Moneyline" },
  { key: "spreads", label: "Spread", type: "spread", description: "Handicap" },
  {
    key: "totals",
    label: "Total",
    type: "total",
    description: "Points Over/Under",
  },
];

export const bookiesThatAreSupported: SupportedBookmaker[] = [
  {
    key: "betr_au",
    label: "Betr",
    backgroundColor: "#093AD1",
    hasSvg: true,
    countryCode: "au",
  },
  {
    key: "bet365_au",
    label: "Bet365",
    backgroundColor: "#0a4c42ff",
    hasSvg: true,
    countryCode: "au",
  },
  {
    key: "boombet",
    label: "Boombet",
    backgroundColor: "#FD346E",
    hasSvg: true,
    countryCode: "au",
  },
  {
    key: "ladbrokes_au",
    label: "Ladbrokes",
    backgroundColor: "#eb1c24",
    hasSvg: true,
    countryCode: "au",
  },
  {
    key: "neds",
    label: "Neds",
    backgroundColor: "#ff7800",
    hasSvg: true,
    countryCode: "au",
  },
  {
    key: "sportsbet",
    label: "SportsBet",
    backgroundColor: "#30a5dd",
    hasSvg: true,
    countryCode: "au",
  },
  {
    key: "tab",
    label: "TAB",
    backgroundColor: "#26E36B",
    hasSvg: true,
    countryCode: "au",
  },
  {
    key: "tabtouch",
    label: "TABtouch",
    backgroundColor: "#4C2F69",
    hasPng: true,
    countryCode: "au",
  },
  {
    key: "unibet",
    label: "Unibet",
    countryCode: "au",
    hasSvg: true,
    needsRotated: true,
    backgroundColor: "#147b45",
  },
  {
    key: "pinnacle",
    label: "Pinnacle",
    backgroundColor: "#072443",
    hasSvg: true,
    needsRotated: true,
    countryCode: "eu",
  },

  { key: "betonlineag", label: "BetOnline.ag", countryCode: "us" },
  { key: "betmgm", label: "BetMGM", countryCode: "us" },
  { key: "betrivers", label: "BetRivers", countryCode: "us" },
  { key: "betus", label: "BetUS", countryCode: "us" },
  { key: "bovada", label: "Bovada", countryCode: "us" },
  { key: "williamhill_us", label: "Caesars", countryCode: "us" },
  { key: "draftkings", label: "DraftKings", countryCode: "us" },
  { key: "fanatics", label: "Fanatics", countryCode: "us" },
  { key: "fanduel", label: "FanDuel", countryCode: "us" },
  { key: "lowvig", label: "LowVig.ag", countryCode: "us" },
  { key: "mybookieag", label: "MyBookie.ag", countryCode: "us" },
  { key: "ballybet", label: "Bally Bet", countryCode: "us" },
  { key: "betanysports", label: "BetAnySports", countryCode: "us" },
  { key: "betparx", label: "betPARX", countryCode: "us" },
  { key: "espnbet", label: "ESPN BET", countryCode: "us" },
  { key: "fliff", label: "Fliff", countryCode: "us" },
  { key: "hardrockbet", label: "Hard Rock Bet", countryCode: "us" },
  { key: "rebet", label: "ReBet", countryCode: "us" },
  { key: "windcreek", label: "Wind Creek (Betfred PA)", countryCode: "us" },

  { key: "sport888", label: "888sport", countryCode: "gb" },
  { key: "betfair_ex_uk", label: "Betfair Exchange", countryCode: "gb" },
  { key: "betfair_sb_uk", label: "Betfair Sportsbook", countryCode: "gb" },
  { key: "betvictor", label: "Bet Victor", countryCode: "gb" },
  { key: "betway", label: "Betway", countryCode: "gb" },
  { key: "boylesports", label: "BoyleSports", countryCode: "gb" },
  { key: "casumo", label: "Casumo", countryCode: "gb" },
  { key: "coral", label: "Coral", countryCode: "gb" },
  { key: "grosvenor", label: "Grosvenor", countryCode: "gb" },
  { key: "ladbrokes_uk", label: "Ladbrokes", countryCode: "gb" },
  { key: "leovegas", label: "LeoVegas", countryCode: "gb" },
  { key: "livescorebet", label: "LiveScore Bet", countryCode: "gb" },
  { key: "matchbook", label: "Matchbook", countryCode: "gb" },
  { key: "paddypower", label: "Paddy Power", countryCode: "gb" },
  { key: "skybet", label: "Sky Bet", countryCode: "gb" },
  { key: "smarkets", label: "Smarkets", countryCode: "gb" },
  { key: "unibet_uk", label: "Unibet", countryCode: "gb" },
  { key: "virginbet", label: "Virgin Bet", countryCode: "gb" },
  { key: "williamhill", label: "William Hill UK", countryCode: "gb" },

  { key: "onexbet", label: "1xBet", countryCode: "eu" },
  { key: "sport888", label: "888sport", countryCode: "eu" },
  { key: "betclic_fr", label: "Betclic (FR)", countryCode: "eu" },
  { key: "betanysports", label: "BetAnySports", countryCode: "eu" },
  { key: "betfair_ex_eu", label: "Betfair Exchange", countryCode: "eu" },
  { key: "betonlineag", label: "BetOnline.ag", countryCode: "eu" },
  { key: "betsson", label: "Betsson", countryCode: "eu" },
  { key: "betvictor", label: "Bet Victor", countryCode: "eu" },
  { key: "coolbet", label: "Coolbet", countryCode: "eu" },
  { key: "everygame", label: "Everygame", countryCode: "eu" },
  { key: "gtbets", label: "GTbets", countryCode: "eu" },
  { key: "marathonbet", label: "Marathon Bet", countryCode: "eu" },
  { key: "matchbook", label: "Matchbook", countryCode: "eu" },
  { key: "mybookieag", label: "MyBookie.ag", countryCode: "eu" },
  { key: "nordicbet", label: "NordicBet", countryCode: "eu" },
  { key: "parionssport_fr", label: "Parions Sport (FR)", countryCode: "eu" },
  { key: "suprabets", label: "Suprabets", countryCode: "eu" },
  { key: "tipico_de", label: "Tipico (DE)", countryCode: "eu" },
  { key: "unibet_fr", label: "Unibet (FR)", countryCode: "eu" },
  { key: "unibet_it", label: "Unibet (IT)", countryCode: "eu" },
  { key: "unibet_nl", label: "Unibet (NL)", countryCode: "eu" },
  { key: "williamhill", label: "William Hill", countryCode: "eu" },
  { key: "winamax_de", label: "Winamax (DE)", countryCode: "eu" },
  { key: "winamax_fr", label: "Winamax (FR)", countryCode: "eu" },

  {
    key: "betfair_ex_au",
    label: "Betfair Exchange",
    countryCode: "au",
  },
  { key: "betright", label: "Bet Right", countryCode: "au" },
  {
    key: "dabble_au",
    label: "Dabble",
    countryCode: "au",
  },
  { key: "playup", label: "PlayUp", countryCode: "au" },
  {
    key: "pointsbetau",
    label: "PointsBet",
    countryCode: "au",
  },
];

export const OurSwiperProps: SwiperProps = {
  spaceBetween: 50,
  slidesPerView: 1.15,
  breakpoints: {
    320: {
      slidesPerView: 1.15,
      spaceBetween: 10,
    },
    // when window width is >= 480px
    768: {
      slidesPerView: 2.15,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: 3.15,
      spaceBetween: 10,
    },
  },
  freeMode: true,
};

export const OurThumbSwiperProps: SwiperProps = {
  watchSlidesProgress: true,
  slidesPerView: "auto",
  grid: { rows: 3, fill: "row" },
  spaceBetween: 5,
  freeMode: true,
  className: "w-full mb-2",
};

export const OurGroupSwiperProps = (isAlone: boolean): SwiperProps => ({
  spaceBetween: 10,
  slidesPerView: isAlone ? 1 : 1.15,
  breakpoints: {
    320: {
      slidesPerView: isAlone ? 1 : 2.15,
      spaceBetween: 10,
    },
    // when window width is >= 480px
    768: {
      slidesPerView: isAlone ? 1 : 3.15,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: isAlone ? 1 : 4.15,
      spaceBetween: 10,
    },
  },
  freeMode: true,
});
