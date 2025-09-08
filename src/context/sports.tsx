// context/SportContext.tsx
"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { GetSportsResult } from "@/types";

type SportContextType = {
  data: GetSportsResult[] | undefined;
  loading: boolean; // since it's server-provided, usually false
  error: Error | null; // pass null from server unless you caught an error
};

const SportContext = createContext<SportContextType | undefined>(undefined);

export function SportProvider({
  children,
  initialData,
  error = null,
}: {
  children: ReactNode;
  initialData: GetSportsResult[] | undefined;
  error?: Error | null;
}) {
  return (
    <SportContext.Provider value={{ data: initialData, loading: false, error }}>
      {children}
    </SportContext.Provider>
  );
}

export function useSportData() {
  const ctx = useContext(SportContext);
  if (!ctx) throw new Error("useSportData must be used within SportProvider");
  return ctx;
}
