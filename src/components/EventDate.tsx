"use client";

import { Text } from "@/catalyst/text";
import { GetOddsResult } from "@/types";
import { getMatchTimeInfo } from "@/utils";

const EventDate = ({ event }: { event: GetOddsResult }) => {
  const { startDate, hasStarted, relative } = getMatchTimeInfo(
    event.commence_time ? event.commence_time : 0
  );

  if (hasStarted) {
    return <Text>LIVE</Text>;
  }

  return (
    <div className="" suppressHydrationWarning>
      <Text>{startDate}</Text>
      <Text>{relative}</Text>
    </div>
  );
};

export default EventDate;
