"use client";

import { STYLES, StyleKey } from "@/lib/styles";

export default function StylePicker({
  value,
  onChange,
}: {
  value: StyleKey;
  onChange: (key: StyleKey) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {STYLES.map((style) => {
        const active = style.key === value;
        return (
          <button
            key={style.key}
            type="button"
            onClick={() => onChange(style.key)}
            className={`flex items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all ${
              active
                ? "border-sketchy-coral bg-sketchy-coral/10 shadow-[0_2px_0_rgba(255,107,91,0.4)]"
                : "border-ink/10 bg-white/60 hover:border-ink/25"
            }`}
          >
            <span className="text-2xl leading-none">{style.emoji}</span>
            <span>
              <span className="block font-display text-xl leading-none">{style.label}</span>
              <span className="mt-1 block text-xs text-ink/60">{style.blurb}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
