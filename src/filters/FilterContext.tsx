import { createContext, useContext, useState, type ReactNode } from "react";
import type { BcuCategory } from "../data/bcuApi";

export type ProgramFilter = BcuCategory | "all";

type FilterState = {
  program: ProgramFilter;
  setProgram: (p: ProgramFilter) => void;
  period: string | null;
  setPeriod: (p: string | null) => void;
  availablePeriods: string[];
  setAvailablePeriods: (p: string[]) => void;
};

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [program, setProgram] = useState<ProgramFilter>("all");
  const [period, setPeriod] = useState<string | null>(null);
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([]);

  return (
    <FilterContext.Provider value={{ program, setProgram, period, setPeriod, availablePeriods, setAvailablePeriods }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterState {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside FilterProvider");
  return ctx;
}
