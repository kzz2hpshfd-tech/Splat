"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearHistory, getHistory, type SearchEntry } from "@/lib/history";
import { findPersona } from "@/lib/personas";
import ActivityCard from "@/components/ActivityCard";
import Blob from "@/components/Blob";

export default function ForYouPage() {
  const [history, setHistory] = useState<SearchEntry[] | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  if (history === null) {
    return <main className="py-24 text-center text-white/40">loading…</main>;
  }

  if (history.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="font-display text-3xl text-gradient">nothing splatted yet</p>
        <p className="mt-3 text-white/60">
          run a search and it'll show up here, building out your own personal map of things to do.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-splat-pink to-splat-cyan px-6 py-3 font-display text-sm text-ink"
        >
          splat your first ZIP
        </Link>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-24 pt-10">
      <Blob className="h-64 w-64 -top-10 -left-16 -z-10" from="#7c3aed" to="#ff2ea6" />

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-splat-cyan">for you</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">
            your <span className="text-gradient">splat</span> history
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            clearHistory();
            setHistory([]);
          }}
          className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white/50 hover:text-white/80"
        >
          clear
        </button>
      </div>

      <div className="mt-10 space-y-12">
        {history.map((entry) => {
          const persona = findPersona(entry.personaId);
          return (
            <section key={entry.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl">
                    {entry.location.city}, {entry.location.stateAbbr}
                  </h2>
                  <p className="text-sm text-white/50">
                    {persona.emoji} {persona.label} &middot; ZIP {entry.location.zip} &middot;{" "}
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/results?zip=${entry.location.zip}&personaId=${entry.personaId}${
                    entry.vibeId ? `&vibeId=${entry.vibeId}` : ""
                  }${entry.budgetId ? `&budgetId=${entry.budgetId}` : ""}`}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  re-splat this
                </Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {entry.activities.slice(0, 4).map((activity, i) => (
                  <ActivityCard key={activity.id} activity={activity} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-block rounded-full bg-gradient-to-r from-splat-pink to-splat-cyan px-6 py-3 font-display text-sm text-ink"
        >
          new search
        </Link>
      </div>
    </main>
  );
}
