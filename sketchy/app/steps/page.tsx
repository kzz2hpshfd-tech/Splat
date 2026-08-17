"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Concept } from "@/lib/generate";
import { loadConcept } from "@/lib/session";
import { SubjectSvg, TOTAL_STEPS } from "@/lib/render";
import { findSubject } from "@/lib/subjects";
import { findStyle, paletteAt } from "@/lib/styles";

const AUTOPLAY_MS = 2800;

function StepsInner() {
  const router = useRouter();
  const [concept, setConcept] = useState<Concept | null | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setConcept(loadConcept());
  }, []);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= TOTAL_STEPS) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing]);

  if (concept === undefined) return null;

  if (concept === null) {
    return (
      <main className="mx-auto max-w-lg px-5 pb-16 pt-24 text-center">
        <h1 className="font-display text-3xl">lost the drawing…</h1>
        <p className="mt-2 text-ink/60">Pick something to draw first and we'll take it from there.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-2xl bg-ink px-6 py-3 font-display text-xl text-paper"
        >
          start over
        </button>
      </main>
    );
  }

  const subject = findSubject(concept.subjectKey);
  const style = findStyle(concept.styleKey);
  const palette = paletteAt(concept.paletteIndex);
  const caption = concept.steps[step - 1] ?? "";
  const isLast = step >= TOTAL_STEPS;

  function goTo(n: number) {
    setPlaying(false);
    setStep(Math.min(TOTAL_STEPS, Math.max(1, n)));
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pb-16 pt-10">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="text-sm font-semibold text-ink/50 hover:text-ink">
          ← back to options
        </button>
        <button onClick={() => router.push("/")} className="text-sm font-semibold text-ink/50 hover:text-ink">
          draw something else
        </button>
      </div>

      <h1 className="mt-4 text-center font-display text-4xl">{concept.title}</h1>

      <div className="paper-card relative mt-6 rounded-[2rem] p-5">
        <div className="mx-auto aspect-square w-full max-w-sm">
          <SubjectSvg subject={subject} style={style} palette={palette} step={step} uid={`${concept.id}-view`} className="h-full w-full" />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => goTo(n)}
              aria-label={`Go to step ${n}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                n === step ? "w-6 bg-sketchy-coral" : "bg-ink/15 hover:bg-ink/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white/70 p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
          step {step} of {TOTAL_STEPS}
        </p>
        <p className="mt-2 text-lg leading-snug">{caption}</p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => goTo(step - 1)}
          disabled={step === 1}
          className="rounded-2xl border-2 border-ink/15 px-5 py-3 font-semibold disabled:opacity-30"
        >
          ← prev
        </button>
        <button
          onClick={() => {
            if (isLast) {
              setPlaying(false);
              return;
            }
            setPlaying((p) => !p);
          }}
          className="rounded-2xl bg-ink px-6 py-3 font-display text-xl text-paper"
        >
          {playing ? "⏸ pause" : isLast ? "✓ done" : "▶ play like a video"}
        </button>
        <button
          onClick={() => goTo(step + 1)}
          disabled={isLast}
          className="rounded-2xl border-2 border-ink/15 px-5 py-3 font-semibold disabled:opacity-30"
        >
          next →
        </button>
      </div>

      {isLast && (
        <p className="mt-6 text-center text-ink/60">
          Nice work! Grab paper and follow the {TOTAL_STEPS} steps above, or{" "}
          <button onClick={() => router.push("/")} className="font-semibold text-sketchy-coral underline underline-offset-2">
            draw something new
          </button>
          .
        </p>
      )}
    </main>
  );
}

export default function StepsPage() {
  return (
    <Suspense fallback={null}>
      <StepsInner />
    </Suspense>
  );
}
