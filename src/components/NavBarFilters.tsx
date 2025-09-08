"use client";
import _ from "lodash";
import { Field } from "../catalyst/fieldset";
import { Select } from "../catalyst/select";
import { useParams, useRouter } from "next/navigation";
import type { GetSportsResult } from "../types";
import { sportsToFilterOut } from "../config";
import { NavbarSection, NavbarSpacer } from "../catalyst/navbar";

function NavbarFilters({
  sports,
  currentGroup,
  currentLeague,
}: {
  sports: GetSportsResult[] | undefined;
  currentGroup?: string;
  currentLeague?: string;
}) {
  const router = useRouter();
  const params = useParams<{ sportGroup: string; sportKey?: string }>();

  const sportGroup = (currentGroup ?? params.sportGroup ?? "").toString();
  const sportKey = (currentLeague ?? params.sportKey ?? "").toString();

  return (
    <>
      <NavbarSpacer />
      <NavbarSection>
        <Field disabled={!sports}>
          <Select
            name="sport"
            value={sportGroup.toLowerCase().replace(/_/g, "-") || ""}
            onChange={(e) => {
              // if the sport chosen only has one league, go directly to that league
              const newVal = e.target.value;
              if (newVal === "") {
                router.push(`/`);
                return;
              }
              const thisGroupsSports = sports?.filter(
                (s) => s.group?.toLowerCase().replace(/ /g, "-") == newVal
              );

              if (thisGroupsSports && thisGroupsSports.length == 1) {
                router.push(
                  `/${newVal}/${thisGroupsSports[0]?.key?.replace(/_/g, "-")}/`
                );
                return;
              }
              router.push(`/${newVal}/`);
            }}
          >
            <option value="">Select a sport</option>
            {sports &&
              sports.length > 0 &&
              _.uniqBy(sports, "group")
                .filter((g) => g.group && !sportsToFilterOut.includes(g.group))
                .map((sport) => {
                  const dynamicKey = sport.group
                    ?.toLowerCase()
                    .replace(/ /g, "-");
                  return (
                    <option
                      key={dynamicKey}
                      value={dynamicKey}
                      className="p-2 hover:bg-amber-100"
                    >
                      {sport.group}
                    </option>
                  );
                })}
          </Select>
        </Field>

        <Field disabled={!sports}>
          <Select
            name="league"
            value={sportKey}
            onChange={(e) => {
              const newKey = e.target.value;
              if (newKey != "") {
                router.push(`/${sportGroup}/${newKey}/`);
              }
            }}
          >
            <option value="">Select a league</option>
            {sports &&
              sports.length > 0 &&
              sports
                .filter(
                  (sport) =>
                    sport.group?.toLowerCase().replace(/ /g, "-") == sportGroup
                )
                .map((sport) => {
                  const dynamicKey = sport.key?.replace(/_/g, "-");
                  return (
                    <option
                      key={dynamicKey}
                      value={dynamicKey}
                      className="p-2 hover:bg-amber-100"
                    >
                      {sport.title}
                    </option>
                  );
                })}
          </Select>
        </Field>
      </NavbarSection>
    </>
  );
}

export default NavbarFilters;
