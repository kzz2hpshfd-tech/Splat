"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConceptCard from "@/components/ConceptCard";
import { Concept } from "@/lib/generate";
import { saveConcept } from "@/lib/session";
import { findStyle } from "@/lib/styles";

function OptionsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const prompt = params.get("prompt") ?? "";
  const styleKey = params.get("styleKey") ?? "cartoon";

  const [concepts, setConcepts] = useState<Concept[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);

  useEffect(() => {
    if (!prompt) {
      router.replace("/");
      return;
    }

    let cancelled = false;
    setConcepts(null);
    setError(null);

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, styleKey }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Something went wrong");
          return;
        }
        setConcepts(data.concepts);
        setSource(data.source);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't reach the drawing engine — try again.");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, styleKey]);

  function handlePick(concept: Concept) {
    saveConcept(concept);
    router.push(`/steps?id=${concept.id}`);
  }

  const style = findStyle(styleKey);

  return (
    <main className="mx-auto max-w-4xl px-5 pb-16 pt-14">
      <button
        onClick={() => router.push("/")}
        className="mb-6 text-sm font-semibold text-ink/50 hover:text-ink"
      >
        ← start over
      </button>

      <h1 className="font-display text-4xl sm:text-5xl">
        pick your favorite <span className="text-gradient">{prompt}</span>
      </h1>
      <p className="mt-2 text-ink/60">
        3 takes in {style.emoji} {style.label.toLowerCase()} style — pick one and I'll teach you how to draw it.
      </p>

      {error && (
        <div className="mt-8 rounded-2xl border-2 border-sketchy-coral/40 bg-sketchy-coral/10 p-5 text-sketchy-coral">
          {error}
        </div>
      )}

      {!error && !concepts && (
        <div className="mt-16 flex flex-col items-center gap-4 text-ink/50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink/15 border-t-sketchy-coral" />
          <p>sketching out some ideas…</p>
        </div>
      )}

      {concepts && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {concepts.map((c) => (
              <ConceptCard key={c.id} concept={c} onPick={() => handlePick(c)} />
            ))}
          </div>
          {source === "fallback" && (
            <p className="mt-6 text-center text-xs text-ink/35">
              Using built-in ideas (no ANTHROPIC_API_KEY configured) — still fully drawable.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default function OptionsPage() {
  return (
    <Suspense fallback={null}>
      <OptionsInner />
    </Suspense>
  );
}
