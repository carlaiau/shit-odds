"use client";
import { Heading, Subheading } from "@/catalyst/heading";
import { Link } from "@/catalyst/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/catalyst/table";
import Head from "next/head";
import Papa from "papaparse";
import { parse } from "date-fns";
import { useEffect, useState } from "react";

type BetRow = {
  "": null;
  "At Risk": string | null;
  "Bet Result": string | null;
  "Bet Type": string | null;
  Bookmaker: string | null;
  "Chosen Filter": string | null;
  Date: string | null;
  Date_1: string | null;
  "Fixture / Event": string | null;
  "My Variable": string | null;
  Notes: string | null;
  Odds: number | null;
  Profit: string | null;
  "Score / Result": string | null;
  Selection: string | null;
  "Sport / League": string | null;
  Stake: string | null;
  Tipper: string | null;
  Win: string | null;
};

const formatted = (val: number): string =>
  "$" +
  new Intl.NumberFormat("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);

async function fetchPublishedCSV() {
  const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vS6ZidYQM2GmdwhYbW7Q-eUYsUgzFBMzDC7ezmNHShD586DFMT9VdduPf4jfiHdLw7LiNmDptn6dXCx/pub?gid=1540405304&single=true&output=csv`;

  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true, // fetch the CSV file from the URL
      header: true, // use first row as keys
      dynamicTyping: true, // auto-convert numbers/booleans
      skipEmptyLines: true, // ignore blank rows
      complete: (results: any) => resolve(results.data),
      error: reject,
    });
  });
}

const BetsClient = () => {
  const [betsData, setBetsData] = useState<BetRow[]>([]);
  const [pendingBetsData, setPendingBetsData] = useState<BetRow[]>([]);

  useEffect(() => {
    fetchPublishedCSV()
      .then((data) => {
        console.log("Fetched CSV Data:", data);
        if (data && Array.isArray(data)) {
          setBetsData(
            data
              .filter((d) => d.Date && d.Win != "P")
              .sort((bet1, bet2) => {
                if (!bet1.Date || !bet2.Date) return 0;
                const date1 = parse(bet1.Date, "d-MMM-yy", new Date());
                const date2 = parse(bet2.Date, "d-MMM-yy", new Date());

                return date2.getTime() - date1.getTime();
              }) as BetRow[]
          );
          setPendingBetsData(
            data.filter((d) => d.Date && d.Win == "P") as BetRow[]
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching CSV:", error);
      });
  }, []);

  const turnover = (slice: number) => {
    return betsData
      .slice(0, slice)
      .reduce(
        (acc, bet) =>
          acc + (bet.Stake ? parseFloat(bet.Stake.replace(/[^\d.]/g, "")) : 0),
        0
      );
  };

  const profit = (slice: number) => {
    return betsData.slice(0, slice).reduce((acc, bet) => {
      if ((bet.Win == "Y" || bet.Win == "N") && bet.Odds && bet.Stake) {
        const stake = parseFloat(bet.Stake.replace(/[^\d.]/g, ""));
        const odds = bet.Odds;
        const profitValue = bet.Win == "Y" ? (odds - 1) * stake : -stake;
        return acc + profitValue;
      }
      return acc;
    }, 0);
  };

  const rows = [
    {
      label: "total",
      slice: betsData.length,
    },
    {
      label: "last 10",
      slice: 10,
    },
    {
      label: "last 50",
      slice: 50,
    },
    {
      label: "last 100",
      slice: 100,
    },
  ];
  return (
    <>
      <div className="bg-white inline-block rounded-md border border-punt-300 dark:bg-punt-900 dark:border-punt-700 mb-2 ml-5">
        <Link to={`/`}>
          <p className="capitalize text-xl lg:text-xl px-3 py-1">Back Home</p>
        </Link>
      </div>
      <div className="p-5 flex flex-col gap-5">
        {pendingBetsData.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">Pending Bets</h2>
            <div className="bg-white dark:bg-zinc-800 p-2 rounded">
              <Table dense>
                <TableHead>
                  <TableRow>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Sport</TableHeader>
                    <TableHeader>Fixture / Event</TableHeader>
                    <TableHeader>Selection</TableHeader>
                    <TableHeader>Odds</TableHeader>
                    <TableHeader>Stake</TableHeader>
                    <TableHeader>At Risk</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingBetsData.map((bet, index) => (
                    <TableRow key={index}>
                      <TableCell>{bet.Date}</TableCell>
                      <TableCell>{bet["Sport / League"]}</TableCell>
                      <TableCell>{bet["Fixture / Event"]}</TableCell>

                      <TableCell>{bet.Selection}</TableCell>
                      <TableCell>{bet.Odds}</TableCell>
                      <TableCell>{bet.Stake}</TableCell>
                      <TableCell>{bet["At Risk"]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <></>
        )}
        <Heading>Performance</Heading>
        <div className="bg-white dark:bg-zinc-800 p-2 rounded">
          <Table dense>
            <TableHead>
              <TableRow>
                <TableHeader></TableHeader>
                <TableHeader>Bets</TableHeader>
                <TableHeader>Wins</TableHeader>
                <TableHeader>Losses</TableHeader>
                <TableHeader>Refunds</TableHeader>
                <TableHeader>Turnover</TableHeader>
                <TableHeader>Profit</TableHeader>
                <TableHeader>ROI</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(({ label, slice }) => (
                <TableRow
                  className={profit(slice) >= 0 ? "bg-green-100" : "bg-red-100"}
                  key={label}
                >
                  <TableCell>{label}</TableCell>
                  <TableCell>{betsData.slice(0, slice).length}</TableCell>
                  <TableCell>
                    {
                      betsData.slice(0, slice).filter((bet) => bet.Win === "Y")
                        .length
                    }
                  </TableCell>
                  <TableCell>
                    {
                      betsData.slice(0, slice).filter((bet) => bet.Win === "N")
                        .length
                    }
                  </TableCell>
                  <TableCell>
                    {
                      betsData.slice(0, slice).filter((bet) => bet.Win === "R")
                        .length
                    }
                  </TableCell>
                  <TableCell>{formatted(turnover(slice))}</TableCell>
                  <TableCell>{formatted(profit(slice))}</TableCell>
                  <TableCell>
                    {((profit(slice) / turnover(slice)) * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Heading>Completed Bets</Heading>
        <Subheading>Showing last 100 bets</Subheading>
        {
          <div className="bg-white dark:bg-zinc-800 p-2 rounded">
            <Table className="mb-10" dense>
              <TableHead>
                <TableRow>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Sport</TableHeader>
                  <TableHeader>Fixture / Event</TableHeader>
                  <TableHeader>Selection</TableHeader>
                  <TableHeader>Odds</TableHeader>
                  <TableHeader>Stake</TableHeader>
                  <TableHeader>Win</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {betsData.slice(0, 100).map((bet, index) => (
                  <TableRow
                    key={index}
                    className={
                      bet.Win === "Y"
                        ? "bg-green-100"
                        : bet.Win == "R"
                        ? "bg-amber-100"
                        : "bg-red-100"
                    }
                  >
                    <TableCell>{bet.Date}</TableCell>
                    <TableCell>{bet["Sport / League"]}</TableCell>
                    <TableCell>{bet["Fixture / Event"]}</TableCell>
                    <TableCell>{bet.Selection}</TableCell>
                    <TableCell>{bet.Odds}</TableCell>
                    <TableCell>{bet.Stake}</TableCell>
                    <TableCell>
                      {bet.Win == "Y"
                        ? "Won"
                        : bet.Win == "R"
                        ? "Refund"
                        : "Lost"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        }
      </div>
    </>
  );
};

export default BetsClient;
