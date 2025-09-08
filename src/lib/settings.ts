// lib/settings.ts
import { cookies } from "next/headers";

export interface Settings {
  bookmakers: string[];
  defaultMarket: string;
  includeLive?: boolean;
}

export const defaultSettings: Settings = {
  bookmakers: [
    "ladbrokes_au",
    "pinnacle",
    "sportsbet",
    "bet365_au",
    "unibet",
    "tab",
    "tabtouch",
  ],
  defaultMarket: "h2h",
};

const COOKIE_KEY = "app-settings";

export async function getSettingsFromCookies(): Promise<Settings> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_KEY)?.value;
  try {
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}
