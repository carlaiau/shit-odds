"use client";
import {
  createContext,
  useContext,
  useOptimistic,
  startTransition,
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
    // 1) optimistic update inside a transition
    startTransition(() => {
      addOptimistic({ [key]: value } as Partial<Settings>);
    });

    // 2) server action
    const next = await updateSettingsAction({ [key]: value } as any);

    // 3) reconcile with server state inside a transition
    startTransition(() => {
      addOptimistic(next);
    });
  };

  const resetSettings = async () => {
    startTransition(() => {
      addOptimistic(initial);
    });

    const next = await resetSettingsAction(initial);

    startTransition(() => {
      addOptimistic(next);
    });
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
