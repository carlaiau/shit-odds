// app/api/event/[sport]/[eventId]/market/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOddsForEventServer } from "@/lib/odds";
import { getSettingsFromCookies } from "@/lib/settings";

export const dynamic = "no-cache"; // or cache: 'no-store'
export const revalidate = 0;

type Params = { sport: string; eventId: string };

export async function GET(req: Request, ctx: { params: Promise<Params> }) {
  const { sport, eventId } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const market = searchParams.get("market") ?? "";
  if (!market) {
    return NextResponse.json({ error: "market missing" }, { status: 400 });
  }

  const settings = await getSettingsFromCookies();
  const bookmakers = settings?.bookmakers ?? [];

  const data = await getOddsForEventServer(
    sport,
    eventId,
    [market],
    bookmakers
  );

  if (!data) {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "CDN-Cache-Control": "no-store",
    },
  });
}
