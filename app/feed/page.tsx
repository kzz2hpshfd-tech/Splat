"use client";

import { useEffect, useState } from "react";
import { DEMO_BUSINESSES } from "@/lib/businesses";
import { getHistory } from "@/lib/history";

export default function FeedPage() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [areaLabel, setAreaLabel] = useState<string | null>(null);

  useEffect(() => {
    const last = getHistory()[0];
    if (last) setAreaLabel(`${last.location.city}, ${last.location.stateAbbr}`);
  }, []);

  function toggleLike(id: string) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <main className="fixed inset-0 top-[52px] bottom-16 overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      <div className="pointer-events-none sticky top-0 z-10 flex justify-center pt-3">
        <span className="rounded-full border border-white/15 bg-ink/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/50 backdrop-blur-md">
          preview feed{areaLabel ? ` · near ${areaLabel}` : ""} — real business videos coming soon
        </span>
      </div>

      {DEMO_BUSINESSES.map((biz) => (
        <section
          key={biz.id}
          className="relative flex h-full w-full snap-start snap-always flex-col justify-end overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${biz.from} 0%, ${biz.to} 100%)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/25 text-4xl backdrop-blur-sm">
              {biz.emoji}
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between gap-4 p-6 pb-8">
            <div className="max-w-xs">
              <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                {biz.category}
              </span>
              <h2 className="mt-2 font-display text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {biz.name}
              </h2>
              <p className="mt-1.5 text-sm text-white/85">{biz.blurb}</p>
            </div>

            <button
              type="button"
              onClick={() => toggleLike(biz.id)}
              className="flex shrink-0 flex-col items-center gap-1"
              aria-label="like"
            >
              <span
                className={`text-3xl transition-transform ${liked[biz.id] ? "scale-125" : "scale-100 opacity-70"}`}
              >
                {liked[biz.id] ? "❤️" : "🤍"}
              </span>
            </button>
          </div>
        </section>
      ))}
    </main>
  );
}
