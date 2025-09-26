import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/catalyst/table";
import { buildTableData, EventData } from "./renderUtils";

function fmt(n?: number, digits = 2) {
  return typeof n === "number" && Number.isFinite(n) ? n.toFixed(digits) : "-";
}

export function OddsTable({
  event,
  marketKey = "player_rush_yds",
}: {
  event: EventData;
  marketKey?: string;
}) {
  const data = buildTableData(event, marketKey);

  console.log(Array.from(new Set(event.bookmakers.map((b) => b.key))));
  // Stable column order
  const bookmakerTitles = Array.from(
    new Set(event.bookmakers.map((b) => b.title))
  ).sort((a, b) => a.localeCompare(b));

  const playerRows = Object.entries(data).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <Table className="bg-white rounded-md" striped>
      <TableHead>
        <TableRow>
          <TableHeader className="w-48">Player</TableHeader>
          {bookmakerTitles.map((bm) => (
            <TableHeader key={bm}>{bm}</TableHeader>
          ))}
          <TableHeader>Average</TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {playerRows.map(([player, byBook]) => {
          // Collect for averages
          const points: number[] = [];
          const overs: number[] = [];
          const unders: number[] = [];

          bookmakerTitles.forEach((bm) => {
            const v = byBook[bm];
            if (!v) return;
            if (Number.isFinite(v.point)) points.push(v.point);
            if (Number.isFinite(v.over)) overs.push(v.over as number);
            if (Number.isFinite(v.under)) unders.push(v.under as number);
          });

          const avgPoint =
            points.length > 0
              ? points.reduce((a, b) => a + b, 0) / points.length
              : undefined;
          const avgOver =
            overs.length > 0
              ? overs.reduce((a, b) => a + b, 0) / overs.length
              : undefined;
          const avgUnder =
            unders.length > 0
              ? unders.reduce((a, b) => a + b, 0) / unders.length
              : undefined;

          return (
            <TableRow key={player}>
              <TableCell className="font-medium">{player}</TableCell>

              {bookmakerTitles.map((bm) => {
                const v = byBook[bm];
                return (
                  <TableCell key={bm}>
                    {v
                      ? `${fmt(v.point, 1)} (${fmt(v.over)} / ${fmt(v.under)})`
                      : "-"}
                  </TableCell>
                );
              })}

              <TableCell className="font-semibold pr-2">
                {avgPoint !== undefined
                  ? `${fmt(avgPoint, 1)} (${fmt(avgOver)} / ${fmt(avgUnder)})`
                  : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
