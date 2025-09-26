export type Outcome = {
  name: string; // Over / Under
  description: string; // player name
  price: number;
  point: number;
};

export type Market = {
  key: string;
  outcomes: Outcome[];
};

export type Bookmaker = {
  key: string;
  title: string;
  markets: Market[];
};

export type EventData = {
  bookmakers: Bookmaker[];
  commence_time: string;
  home_team: string;
  away_team: string;
};

// Helper: build a nested map
function buildTableData(event: EventData, marketKey: string) {
  const players: Record<
    string,
    Record<string, { point: number; over: number; under: number }>
  > = {};

  for (const bm of event.bookmakers) {
    const market = bm.markets.find((m) => m.key === marketKey);
    if (!market) continue;

    // group outcomes into Over/Under pairs
    for (const o of market.outcomes) {
      const player = o.description;
      if (!players[player]) players[player] = {};
      if (!players[player][bm.title]) {
        players[player][bm.title] = { point: o.point, over: NaN, under: NaN };
      }

      if (o.name === "Over") {
        players[player][bm.title].over = o.price;
      } else if (o.name === "Under") {
        players[player][bm.title].under = o.price;
      }
    }
  }

  return players;
}
export { buildTableData };
