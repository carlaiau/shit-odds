"use client";
import _ from "lodash";
import Flag from "react-world-flags";
import {
  SidebarBody,
  SidebarHeading,
  SidebarItem,
  SidebarSection,
  SidebarSpacer,
} from "../catalyst/sidebar";

import { useSettings } from "../context/settings";
import * as Headless from "@headlessui/react";

import type { GetSportsResult } from "../types";

import { Select } from "../catalyst/select";

import { useParams, useRouter } from "next/navigation";

import { marketsThatAreSupported, sportsToFilterOut } from "../config";
import { Switch } from "../catalyst/switch";
import { Dropdown, DropdownButton, DropdownMenu } from "../catalyst/dropdown";
import { Text } from "../catalyst/text";

function SideBarFilters({ sports }: { sports: GetSportsResult[] | undefined }) {
  const router = useRouter();
  const params = useParams<{ sportGroup: string; sportKey?: string }>();
  const { settings, updateSettings } = useSettings();

  // Prefer SSR values; fallback to params
  const sportGroup = params.sportGroup ?? "";
  const sportKey = params.sportKey ?? "";

  return (
    <SidebarBody>
      <SidebarSection className="lg:block hidden">
        <SidebarHeading>Sport</SidebarHeading>
        <Headless.Field disabled={!sports}>
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
        </Headless.Field>

        <Headless.Field disabled={!sports} className={"mt-2"}>
          <SidebarHeading>League</SidebarHeading>
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
        </Headless.Field>
      </SidebarSection>
      <SidebarSection className="mb-3">
        <SidebarHeading>Main market</SidebarHeading>
        <Headless.Field>
          <Select
            value={settings.defaultMarket ?? ""}
            onChange={(e) => {
              const newMarket = e.target.value;
              if (newMarket === "") return;
              updateSettings("defaultMarket", newMarket);
            }} // onClick to capture option clicks
          >
            <option value="" disabled>
              Choose a market
            </option>
            {marketsThatAreSupported.map((m) => {
              return (
                <option className="w-full" value={m.key} key={m.key}>
                  {m.label} {m.description ? ` - ${m.description}` : ""}
                </option>
              );
            })}
          </Select>
        </Headless.Field>
      </SidebarSection>
      <SidebarSection>
        <SidebarHeading>In-Play</SidebarHeading>

        <Headless.Field className="ml-2 mt-2">
          <Switch
            name="include_live"
            checked={settings.includeLive || false}
            onChange={(checked) => updateSettings("includeLive", checked)}
            color="green"
          />
        </Headless.Field>
      </SidebarSection>
    </SidebarBody>
  );
}

export default SideBarFilters;
