// app/actions/settings.ts
"use server";

import { cookies } from "next/headers";
import type { Settings } from "@/lib/settings";

const COOKIE_KEY = "app-settings";

export async function updateSettingsAction(partial: Partial<Settings>) {
  const jar = await cookies();
  const current = jar.get(COOKIE_KEY)?.value;
  let existing: Settings = { bookmakers: [], defaultMarket: "h2h" };
  try {
    existing = current ? JSON.parse(current) : existing;
  } catch {}

  const next = { ...existing, ...partial };
  jar.set(COOKIE_KEY, JSON.stringify(next), { httpOnly: false, path: "/" });
  return next;
}

export async function resetSettingsAction(defaults: Settings) {
  const jar = await cookies();
  jar.set(COOKIE_KEY, JSON.stringify(defaults), { httpOnly: false, path: "/" });
  return defaults;
}
