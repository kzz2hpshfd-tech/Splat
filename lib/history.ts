import type { Activity } from "./activities";
import type { ZipLocation } from "./zip";

export type SearchEntry = {
  id: string;
  location: ZipLocation;
  personaId: string;
  vibeId?: string;
  budgetId?: string;
  activities: Activity[];
  createdAt: number;
};

const STORAGE_KEY = "splat:history";
const MAX_ENTRIES = 24;

export function getHistory(): SearchEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SearchEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSearch(entry: Omit<SearchEntry, "id" | "createdAt">): SearchEntry {
  const full: SearchEntry = {
    ...entry,
    id: `${entry.location.zip}-${entry.personaId}-${Date.now()}`,
    createdAt: Date.now(),
  };

  if (typeof window === "undefined") return full;

  const existing = getHistory();
  const next = [full, ...existing].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return full;
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
