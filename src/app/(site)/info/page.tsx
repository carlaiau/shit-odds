import _ from "lodash";

import { Heading, Subheading } from "@/catalyst/heading";
import { Text } from "@/catalyst/text";

const Info = () => {
  return (
    <div className="w-full md:w-3/4 lg:w-2/3 flex-col pt-4 px-8 flex items-start gap-4 bg-white dark:bg-zinc-800 rounded-md">
      <div className="mb-8 flex flex-col gap-2">
        <Heading>Softbook Finder</Heading>
        <Text>
          Our goal is to make it easy to compare odds across many bookmakers,
          and to spot +EV opportunities assuming Pinnacles lines are the closest
          thing to “true odds.”
        </Text>
        <Subheading>How To Use</Subheading>
        <ul className="list-disc list-outsidetext-base/6 text-zinc-500 sm:text-sm/6 dark:text-white/90">
          <li>Pick a sport.</li>
          <li>Select the bookmakers you use.</li>
          <li>Choose your preferred market.</li>
          <li>
            On the league page, you'll see all events with your preferred market
            odds
          </li>
          <li>
            On an event page, you'll see every market available. Including the
            degenerate prop bets.
          </li>
        </ul>
      </div>
      <div className="mb-8 flex flex-col gap-2">
        <Subheading>No-Vig Pinnacle (NVP) and EV</Subheading>
        <Text>
          We treat Pinnacle as the sharpest book. When their odds exist, we
          strip out the margin to get the “true” probability of an event. That's
          the NVP.
        </Text>
        <Subheading>Expected Value (EV):</Subheading>
        <Text>
          We compare NVP to other bookmaker odds. If a book is offering better
          odds than Pinnacle's NVP, that's a +EV bet (highlighted in green).
          These are the spots where you might have an edge.
        </Text>
        <ul className="list-disc list-outside text-base/6 text-zinc-500 sm:text-sm/6 dark:text-white/90">
          <li>
            Don’t expect +EV to pop up often in big markets. It's rare, most of
            the market follows Pinnacle
          </li>
          <li>
            The smaller the market/liquidity, the bigger the edge you'll want.
            2% on NBA is elite. On a random lower-league soccer match, you might
            want +5% or more.
          </li>
        </ul>
        <Text>Happy Punting</Text>
      </div>
    </div>
  );
};

export default Info;
