"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StylePicker from "@/components/StylePicker";
import { StyleKey } from "@/lib/styles";

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [styleKey, setStyleKey] = useState<StyleKey>("cartoon");
  const [touched, setTouched] = useState(false);

  const promptValid = prompt.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!promptValid) return;

    const params = new URLSearchParams({ prompt: prompt.trim(), styleKey });
    router.push(`/options?${params.toString()}`);
  }

  return (
    <main className="relative mx-auto max-w-2xl px-5 pb-16 pt-16 sm:pt-24">
      <p className="inline-block rounded-full border border-ink/15 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-ink/50">
        say it, style it, draw it
      </p>
      <h1 className="mt-6 font-display text-6xl leading-[1.05] sm:text-7xl">
        <span className="text-gradient">sketchy</span>
      </h1>
      <p className="mt-4 max-w-xl text-balance text-base text-ink/60 sm:text-lg">
        Tell it what you want to draw, pick a style, then pick your favorite final result — it'll
        walk you through it step by step, picture by picture (or play it like a video).
      </p>

      <form onSubmit={handleSubmit} className="paper-card mt-8 space-y-5 rounded-[2rem] p-6">
        <div>
          <label htmlFor="prompt" className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
            What do you want to draw?
          </label>
          <textarea
            id="prompt"
            rows={2}
            placeholder="a sleepy cat, a race car, a house on a hill..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full resize-none rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-lg outline-none placeholder-ink/30 focus:border-sketchy-coral"
          />
          {touched && !promptValid && <p className="mt-1 text-xs font-semibold text-sketchy-coral">tell me what to draw first</p>}
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Pick a style</label>
          <StylePicker value={styleKey} onChange={setStyleKey} />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-ink py-4 font-display text-2xl text-paper transition-transform hover:scale-[1.01] active:scale-[0.98]"
        >
          show me some ideas ✏️
        </button>
      </form>

      <p className="mx-auto mt-4 max-w-md text-center text-xs text-ink/40">
        You'll get 3 finished-look options to pick from, then a step-by-step tutorial to draw the
        one you choose.
      </p>
    </main>
  );
}
