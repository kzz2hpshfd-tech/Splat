"use client";

import { Concept } from "@/lib/generate";
import { SubjectSvg, TOTAL_STEPS } from "@/lib/render";
import { findSubject } from "@/lib/subjects";
import { findStyle, paletteAt } from "@/lib/styles";

export default function ConceptCard({ concept, onPick }: { concept: Concept; onPick: () => void }) {
  const subject = findSubject(concept.subjectKey);
  const style = findStyle(concept.styleKey);
  const palette = paletteAt(concept.paletteIndex);

  return (
    <button
      type="button"
      onClick={onPick}
      className="paper-card group flex w-full flex-col items-center rounded-[1.75rem] p-5 text-center transition-transform hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="aspect-square w-full max-w-[220px] rounded-2xl bg-white/70 p-3">
        <SubjectSvg
          subject={subject}
          style={style}
          palette={palette}
          step={TOTAL_STEPS}
          uid={concept.id}
          className="h-full w-full"
        />
      </div>
      <h3 className="mt-4 font-display text-2xl leading-none">{concept.title}</h3>
      <p className="mt-2 text-sm text-ink/60">{concept.blurb}</p>
      <span className="mt-4 rounded-full bg-ink px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-paper group-hover:bg-sketchy-coral">
        teach me this one
      </span>
    </button>
  );
}
