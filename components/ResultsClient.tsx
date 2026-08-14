"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GlobeSplat from "@/components/GlobeSplat";
import PersonaPicker from "@/components/PersonaPicker";
import ActivityCard from "@/components/ActivityCard";
import Blob from "@/components/Blob";
import type { Activity } from "@/lib/activities";
import type { ZipLocation } from "@/lib/zip";
import { saveSearch } from "@/lib/history";
import { findPersona } from "@/lib/personas";

type FetchState = "idle" | "loading" | "error" | "done";

export default function ResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const zip = searchParams.get("zip") ?? "";
  const personaId = searchParams.get("personaId") ?? "romantic";
  const vibeId = searchParams.get("vibeId") ?? undefined;
  const budgetId = searchParams.get("budgetId") ?? undefined;

  const [state, setState] = useState<FetchState>("idle");
  const [location, setLocation] = useState<ZipLocation | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setAnimationDone(false);

    fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zip, personaId, vibeId, budgetId }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data: { location: ZipLocation; activities: Activity[]; source: "ai" | "fallback" }) => {
        if (cancelled) return;
        setLocation(data.location);
        setActivities(data.activities);
        setSource(data.source);
        setState("done");
        saveSearch({ location: data.location, personaId, vibeId, budgetId, activities: data.activities });
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [zip, personaId, vibeId, budgetId]);

  const persona = findPersona(personaId);
  const ready = state === "done" && animationDone;

  function updateParams(next: { personaId?: string; vibeId?: string; budgetId?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.personaId !== undefined) params.set("personaId", next.personaId);
    if ("vibeId" in next) {
      if (next.vibeId) params.set("vibeId", next.vibeId);
      else params.delete("vibeId");
    }
    if ("budgetId" in next) {
      if (next.budgetId) params.set("budgetId", next.budgetId);
      else params.delete("budgetId");
    }
    router.push(`/results?${params.toString()}`);
  }

  if (!/^\d{5}$/.test(zip)) {
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="font-display text-2xl text-gradient">no ZIP, no splat</p>
        <a href="/" className="mt-4 inline-block text-sm font-semibold text-splat-cyan underline">
          go pick one
        </a>
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="font-display text-2xl text-gradient">that splat missed</p>
        <p className="mt-2 text-sm text-white/60">couldn't find anything for ZIP {zip}. double-check it and try again.</p>
        <a href="/" className="mt-4 inline-block text-sm font-semibold text-splat-cyan underline">
          try another ZIP
        </a>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-4xl px-5 pb-24 pt-10">
      <Blob className="h-64 w-64 -top-10 -right-16 -z-10" from="#22d3ee" to="#a3e635" />

      {!ready && (
        <div className="flex flex-col items-center justify-center py-16">
          <GlobeSplat
            targetLat={location?.lat}
            targetLng={location?.lng}
            cityLabel={location ? `${location.city}, ${location.stateAbbr}` : undefined}
            onComplete={() => setAnimationDone(true)}
          />
          <p className="mt-16 text-sm font-semibold uppercase tracking-[0.3em] text-white/40">
            {state === "loading" ? "splatting you down…" : "locking it in…"}
          </p>
        </div>
      )}

      {ready && location && (
        <div className="animate-splat-in">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-splat-cyan">
              splatted at {location.zip}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">
              <span className="text-gradient">{location.city}, {location.stateAbbr}</span>
            </h1>
            <p className="mt-3 text-white/60">
              {persona.emoji} fun things to do &mdash; {persona.label.toLowerCase()}
            </p>
            {source && (
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                {source === "ai" ? "✨ ai-generated" : "📋 curated list (no ANTHROPIC_API_KEY set)"}
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              {showFilters ? "hide filters" : "tweak this search \u{1F39B}️"}
            </button>
          </div>

          {showFilters && (
            <div className="mx-auto mt-4 max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <PersonaPicker
                personaId={personaId}
                vibeId={vibeId}
                budgetId={budgetId}
                onPersonaChange={(id) => updateParams({ personaId: id })}
                onVibeChange={(id) => updateParams({ vibeId: id })}
                onBudgetChange={(id) => updateParams({ budgetId: id })}
                compact
              />
            </div>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {activities.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/"
              className="inline-block rounded-full bg-gradient-to-r from-splat-pink to-splat-cyan px-6 py-3 font-display text-sm text-ink"
            >
              splat somewhere new
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
