import type { Metadata } from "next";

import "./globals.css";
import { SettingsProvider } from "@/context/settings";
import { SportProvider } from "@/context/sports";

import { getSettingsFromCookies, defaultSettings } from "@/lib/settings";
import { getSportsServer } from "@/lib/odds";
import { FathomAnalytics } from "./fathom";
export const metadata: Metadata = {
  title: "💩 ShitOdds",
  description: "Finding value in a sea of shit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = (await getSettingsFromCookies()) ?? defaultSettings;
  const sports = await getSportsServer(); // SSR fetch
  return (
    <html lang="en">
      <body>
        <FathomAnalytics />
        <SettingsProvider initial={settings}>
          <SportProvider initialData={sports}>{children}</SportProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
