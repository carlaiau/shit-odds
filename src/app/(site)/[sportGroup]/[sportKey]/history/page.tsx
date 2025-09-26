import {
  getHistoricalEventsServer,
  getHistoricalOddsForEvent,
} from "@/lib/odds";
import {
  GetHistoricalEventsResult,
  GetHistoricalOddsForEventResult,
} from "@/types";
import { parse, formatISO, parseISO, format, isBefore } from "date-fns";
import { HistoryClient } from "./historyClient";
import { Heading, Subheading } from "@/catalyst/heading";
import { OddsTable } from "./oddsTable";
import { EventData } from "./renderUtils";

const BOOKMAKERS_FOR_PROPS = [
  "pinnacle",
  "draftkings",
  "betmgm",
  "williamhill_us",
  "fanduel",
  "betonlineag",
  "betrivers",
  "bovada",
  "fanatics",
];
type Params = {
  params: { sportGroup: string; sportKey: string };
  searchParams: { variables?: string };
};

const Page = async ({ params, searchParams }: Params) => {
  const { sportGroup, sportKey } = await params;
  console.log("Historical Page", { sportGroup, sportKey });

  let variables: { markets: string[]; date: string } | null = null;

  if (searchParams && searchParams.variables) {
    try {
      variables = JSON.parse(searchParams.variables);
    } catch (err) {
      console.error("Invalid variables JSON:", err);
    }
  }

  if (!variables || !variables.date) {
    return (
      <HistoryClient
        sportGroup={sportGroup}
        sportKey={sportKey}
        variables={variables}
      />
    );
  }

  const res: GetHistoricalEventsResult | undefined =
    await getHistoricalEventsServer(
      sportKey.replace(/-/g, "_"),
      variables.date
    );

  console.log({ res });

  const dateInIso = parse(variables.date, "yyyy-MM-dd", new Date()).setHours(
    23,
    59,
    59,
    999
  );
  if (!res || !res.data) {
    return (
      <div>
        <Heading>Historical Page</Heading>
        <p>No data</p>
      </div>
    );
  }

  res.data = res?.data.filter(
    (e) => e.commence_time && isBefore(parseISO(e.commence_time), dateInIso)
  );

  const filteredEvents = res?.data.filter(
    (e) => e.commence_time && isBefore(parseISO(e.commence_time), dateInIso)
  );

  const eventsWithOdds = (
    await Promise.all(
      filteredEvents.map(async (event) => {
        if (!event.id || !event.commence_time) return null;
        return (await getHistoricalOddsForEvent(
          sportKey.replace(/-/g, "_"),
          event.id,
          BOOKMAKERS_FOR_PROPS,
          variables?.markets ?? [],

          event.commence_time
        )) as GetHistoricalOddsForEventResult;
      })
    )
  ).filter(Boolean) as GetHistoricalOddsForEventResult[];

  console.log({ eventsWithOdds });
  /* We actually want to get the odds here for the events that are filtered out */

  return (
    <div className="p-5">
      <Heading>Historical Page</Heading>
      <HistoryClient
        sportGroup={sportGroup}
        sportKey={sportKey}
        variables={variables}
      />
      {eventsWithOdds.length === 0 && <p>No events found for this date</p>}
      {eventsWithOdds.map((event, i) => {
        if (!event.data) return null;
        return (
          <>
            <Subheading>
              {event.data.away_team} at {event.data.home_team}
            </Subheading>
            {event.data.commence_time && (
              <div className="text-sm text-gray-600">
                <p>
                  {format(parseISO(event.data.commence_time), "MMM dd hh:mm")}
                </p>
              </div>
            )}
            <OddsTable
              key={i}
              event={event.data as EventData}
              marketKey={variables.markets[0]}
            />
          </>
        );
      })}
    </div>
  );
};

export default Page;
