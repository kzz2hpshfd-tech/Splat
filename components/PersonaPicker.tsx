"use client";

import { BUDGETS, PERSONAS, VIBES } from "@/lib/personas";

type PersonaPickerProps = {
  personaId: string;
  vibeId?: string;
  budgetId?: string;
  onPersonaChange: (id: string) => void;
  onVibeChange: (id: string | undefined) => void;
  onBudgetChange: (id: string | undefined) => void;
  compact?: boolean;
};

export default function PersonaPicker({
  personaId,
  vibeId,
  budgetId,
  onPersonaChange,
  onVibeChange,
  onBudgetChange,
  compact = false,
}: PersonaPickerProps) {
  return (
    <div className="space-y-5">
      <div>
        {!compact && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Who's this for?
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {PERSONAS.map((p) => {
            const active = p.id === personaId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPersonaChange(p.id)}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-splat-pink to-splat-purple text-white shadow-[0_0_20px_rgba(255,46,166,0.45)] scale-105"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <span className="mr-1.5">{p.emoji}</span>
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {!compact && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Vibe</p>
        )}
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => {
            const active = v.id === vibeId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onVibeChange(active ? undefined : v.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-splat-cyan text-ink"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <span className="mr-1">{v.emoji}</span>
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {!compact && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Budget</p>
        )}
        <div className="flex gap-2">
          {BUDGETS.map((b) => {
            const active = b.id === budgetId;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onBudgetChange(active ? undefined : b.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  active ? "bg-splat-lime text-ink" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
