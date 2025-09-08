"use client";
import {
  createContext,
  useContext,
  useOptimistic,
  type ReactNode,
} from "react";
import type { Settings } from "@/lib/settings";
import {
  resetSettingsAction,
  updateSettingsAction,
} from "@/app/actions/settings";

interface SettingsContextValue {
  settings: Settings;
  updateSettings: <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const Ctx = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial: Settings;
}) {
  // useOptimistic takes initial state and a reducer
  const [optimistic, addOptimistic] = useOptimistic(
    initial,
    (state: Settings, action: Partial<Settings>): Settings => ({
      ...state,
      ...action,
    })
  );

  const updateSettings: SettingsContextValue["updateSettings"] = async (
    key,
    value
  ) => {
    // optimistic update: immediately merge new key/value
    addOptimistic({ [key]: value } as Partial<Settings>);

    // then call server action
    const next = await updateSettingsAction({ [key]: value } as any);

    // commit final server state
    addOptimistic(next);
  };

  const resetSettings = async () => {
    addOptimistic(initial); // show immediate reset

    const next = await resetSettingsAction(initial);

    addOptimistic(next); // sync with server’s response
  };

  return (
    <Ctx.Provider
      value={{ settings: optimistic, updateSettings, resetSettings }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
