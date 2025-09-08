// app/api/event/[sport]/[eventId]/market/route.ts
import { NextResponse } from "next/server";
import { getOddsForEventServer } from "@/lib/odds";
import { getSettingsFromCookies } from "@/lib/settings";

export const dynamic = "force-dynamic"; // or cache: 'no-store'
export const revalidate = 0;

type Ctx = {
  params: { sport: string; eventId: string };
};

export async function GET(req: Request, { params }: Ctx) {
  const { searchParams } = new URL(req.url);
  const market = searchParams.get("market") ?? "";
  if (!market) {
    return NextResponse.json({ error: "market missing" }, { status: 400 });
  }

  const settings = await getSettingsFromCookies();
  const bookmakers = settings?.bookmakers ?? [];

  const data = await getOddsForEventServer(
    params.sport, // already underscores from client
    params.eventId,
    [market],
    bookmakers
  );

  if (!data) {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }

  return NextResponse.json(data);
}
