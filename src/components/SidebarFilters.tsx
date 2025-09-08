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
import { Checkbox, CheckboxField } from "../catalyst/checkbox";

import { useParams, useRouter } from "next/navigation";

import {
  bookiesThatAreSupported,
  marketsThatAreSupported,
  sportsToFilterOut,
} from "../config";
import { Switch } from "../catalyst/switch";
import { Dropdown, DropdownButton, DropdownMenu } from "../catalyst/dropdown";
import { Text } from "../catalyst/text";

function SideBarFilters({
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
  const { settings, updateSettings } = useSettings();

  // Prefer SSR values; fallback to params
  const sportGroup = (currentGroup ?? params.sportGroup ?? "").toString();
  const sportKey = (currentLeague ?? params.sportKey ?? "").toString();

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
        <Select
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
      <SidebarSection>
        <SidebarHeading className="flex items-center justify-between gap-1">
          <span> Active Bookies</span>
          <span>({settings.bookmakers.length})</span>
        </SidebarHeading>
      </SidebarSection>
      <SidebarSection className="max-h-[300px] overflow-y-auto !mt-2">
        {_.sortBy(bookiesThatAreSupported, "label")
          .filter((b) => settings.bookmakers.includes(b.key))
          .map((bookie) => (
            <SidebarItem
              key={bookie.countryCode + "=" + bookie.key}
              className={"flex items-center"}
              onClick={() => {
                if (bookie.key === "pinnacle") {
                  alert("Pinnacle cannot be removed.");
                  return;
                }
                updateSettings(
                  "bookmakers",
                  settings.bookmakers.filter((m) => m !== bookie.key)
                );
              }}
            >
              <Headless.Field className={"flex gap-2 items-center"}>
                <Checkbox
                  name="markets"
                  value={bookie.key}
                  checked={true}
                  onClick={() => {
                    if (bookie.key === "pinnacle") {
                      alert("Pinnacle cannot be removed.");
                      return;
                    }
                    updateSettings(
                      "bookmakers",
                      settings.bookmakers.filter((m) => m !== bookie.key)
                    );
                  }}
                />

                <Headless.Label className={"text-xs"}>
                  {bookie.label}
                </Headless.Label>

                {bookie.countryCode && (
                  <>
                    {bookie.countryCode == "eu" ? (
                      <img
                        src="/flags/eu.svg"
                        alt="EU"
                        className="inline w-5 h-5"
                      />
                    ) : (
                      <Flag code={bookie.countryCode} className="w-5 h-5" />
                    )}
                  </>
                )}
              </Headless.Field>
            </SidebarItem>
          ))}
      </SidebarSection>
      <SidebarSection>
        <SidebarHeading>Inactive Bookies</SidebarHeading>
        <div className="flex flex-wrap gap-2">
          {bookiesThatAreSupported ? (
            _.uniqBy(bookiesThatAreSupported, "countryCode").map((c) => (
              <Dropdown key={c.key}>
                <DropdownButton
                  key={c.countryCode}
                  className="mt-2 bg-white dark:bg-zinc-700 cursor-pointer"
                  outline
                >
                  {c.countryCode && (
                    <>
                      {c.countryCode == "eu" ? (
                        <img
                          src="/flags/eu.svg"
                          alt="EU"
                          className="inline w-8 h-8"
                        />
                      ) : (
                        <Flag
                          code={c?.countryCode}
                          className="inline w-8 h-8"
                        />
                      )}
                    </>
                  )}
                </DropdownButton>
                <DropdownMenu>
                  <div className="flex flex-col p-2">
                    {_.sortBy(bookiesThatAreSupported, "label")
                      .filter(
                        (b) =>
                          !settings.bookmakers.includes(b.key) &&
                          b.countryCode == c.countryCode
                      )
                      .map((bookie) => (
                        <CheckboxField
                          key={bookie.key}
                          onClick={() => {
                            if (settings.bookmakers.length > 39) {
                              alert("You can only select up to 40 bookmakers.");
                              return;
                            }
                            updateSettings("bookmakers", [
                              ...settings.bookmakers,
                              bookie.key,
                            ]);
                          }}
                          className="cursor-pointer mb-1 dark:text-white"
                        >
                          <Checkbox
                            name="markets"
                            value={bookie.key}
                            checked={false}
                            onClick={() => {
                              if (settings.bookmakers.length > 39) {
                                alert(
                                  "You can only select up to 39 bookmakers."
                                );
                                return;
                              }
                              updateSettings("bookmakers", [
                                ...settings.bookmakers,
                                bookie.key,
                              ]);
                            }}
                          />
                          <Text>{bookie.label}</Text>
                        </CheckboxField>
                      ))}
                  </div>
                </DropdownMenu>
              </Dropdown>
            ))
          ) : (
            <></>
          )}
        </div>
      </SidebarSection>

      <SidebarSpacer />
    </SidebarBody>
  );
}

export default SideBarFilters;
