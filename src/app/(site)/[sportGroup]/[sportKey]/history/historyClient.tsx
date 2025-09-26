"use client";

import { Button } from "@/catalyst/button";
import { Checkbox, CheckboxField } from "@/catalyst/checkbox";
import { Field, FieldGroup, Label } from "@/catalyst/fieldset";
import { Subheading } from "@/catalyst/heading";
import { Select } from "@/catalyst/select";
import { GetHistoricalEventsResult } from "@/types";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const HistoryClient = ({
  sportGroup,
  sportKey,
  variables,
}: {
  sportGroup: string;
  sportKey: string;
  variables: { markets: string[]; date: string } | null;
}) => {
  const [selectedDate, setSelectedDate] = useState(variables?.date || "");

  const [markets, setMarkets] = useState<string[]>(variables?.markets || []);

  useEffect(() => {}, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query vars
    const variables = {
      markets, // array of strings
      date: selectedDate,
    };

    const queryString = encodeURIComponent(JSON.stringify(variables));

    window.location.href = `/${sportGroup}/${sportKey}/history/?variables=${queryString}`;
  };

  const potentialMarkets = [
    "spreads",
    "totals",
    "player_reception_yds",
    "player_rush_yds",
    "player_pass_yds",
  ];
  return (
    <>
      <form className="mb-8 flex flex-wrap items-centergap-2">
        <FieldGroup>
          <Field>
            <input
              type="date"
              name="date"
              value={selectedDate}
              className="mb-4 bg-white py-2"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Select
              onChange={(e) => {
                setMarkets([e.target.value]);
              }}
              value={markets[0] || ""}
              className="mr-4"
            >
              <option value="">Select Market</option>
              {potentialMarkets.map((market) => (
                <option key={market} value={market}>
                  {market.replace(/_/g, " ")}
                </option>
              ))}
            </Select>
          </Field>
        </FieldGroup>

        <Button onClick={handleSubmit}>Go</Button>
      </form>
    </>
  );
};

export { HistoryClient };
