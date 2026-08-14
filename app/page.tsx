"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Blob from "@/components/Blob";
import DripEdge from "@/components/DripEdge";
import PersonaPicker from "@/components/PersonaPicker";
import { PERSONAS } from "@/lib/personas";

export default function HomePage() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [personaId, setPersonaId] = useState(PERSONAS[0].id);
  const [vibeId, setVibeId] = useState<string | undefined>(undefined);
  const [budgetId, setBudgetId] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  const zipValid = /^\d{5}$/.test(zip);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!zipValid) return;

    const params = new URLSearchParams({ zip, personaId });
    if (vibeId) params.set("vibeId", vibeId);
    if (budgetId) params.set("budgetId", budgetId);
    router.push(`/results?${params.toString()}`);
  }

  return (
    <main className="relative isolate overflow-hidden">
      <Blob className="h-72 w-72 -top-10 -left-16" from="#ff2ea6" to="#7c3aed" />
      <Blob className="h-80 w-80 top-40 -right-24" from="#22d3ee" to="#7c3aed" />
      <Blob className="h-56 w-56 bottom-0 left-1/3" from="#a3e635" to="#22d3ee" />

      <section className="relative mx-auto max-w-3xl px-5 pb-10 pt-16 text-center sm:pt-24">
        <p className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
          zip in, plans out
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-7xl">
          <span className="text-gradient">splat</span>
          <span className="block text-2xl sm:text-3xl mt-3 text-white/80 font-body font-semibold">
            yourself onto the map
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-white/60 sm:text-lg">
          Punch in your ZIP, watch the globe spin, get splatted right where you stand — then get
          fun things to do that actually fit who you're with. Romantic trip with your mother-in-law?
          We got you. Never not have a fun thing to do again.
        </p>
      </section>

      <div className="relative mx-auto max-w-2xl px-5">
        <div className="rounded-t-[2rem] bg-gradient-to-r from-splat-pink via-splat-magenta to-splat-cyan px-6 pt-6 pb-1 shadow-[0_0_60px_rgba(124,58,237,0.35)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="zip" className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-ink/70">
                Your ZIP code
              </label>
              <input
                id="zip"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                placeholder="90210"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className="w-full rounded-2xl border-0 bg-ink px-5 py-4 font-display text-3xl tracking-[0.2em] text-white placeholder-white/20 outline-none ring-2 ring-transparent focus:ring-splat-cyan"
              />
              {touched && !zipValid && (
                <p className="mt-1 text-xs font-semibold text-ink/80">enter a valid 5-digit ZIP</p>
              )}
            </div>

            <div className="rounded-2xl bg-ink/90 p-4">
              <PersonaPicker
                personaId={personaId}
                vibeId={vibeId}
                budgetId={budgetId}
                onPersonaChange={setPersonaId}
                onVibeChange={setVibeId}
                onBudgetChange={setBudgetId}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-ink py-4 font-display text-xl text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              splat me 💥
            </button>
          </form>
        </div>
        <div className="h-16 -mt-1">
          <DripEdge flip className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.35)]" />
        </div>
      </div>

      <p className="relative mx-auto mt-4 max-w-md px-5 text-center text-xs text-white/40">
        Every search gets saved to your{" "}
        <a href="/for-you" className="font-semibold text-splat-cyan underline underline-offset-2">
          For You
        </a>{" "}
        page, so you can build out a whole itinerary over time.
      </p>
    </main>
  );
}
