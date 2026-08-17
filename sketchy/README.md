# sketchy

Say what you want to draw, pick a style, and pick your favorite finished look out of 3 options —
then get a real step-by-step tutorial (picture-by-picture, or play it like a video) to draw it
yourself.

A standalone app, separate from the `splat` app at the repo root.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- `@anthropic-ai/sdk` for AI-flavored concept titles/blurbs/step captions, with a built-in
  deterministic fallback so the app works with zero configuration
- No image-generation API — the drawings themselves are a hand-built library of procedural SVG
  "subject templates" (cat, dog, house, tree, sun, star, heart, flower, fish, car, robot,
  butterfly, plus a generic doodle fallback), rendered progressively across 4 fixed steps: block
  in shapes → outline → details → color/shading. Free-text prompts are keyword-matched to the
  nearest template.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or set `PORT` if running alongside the
`splat` app, which also defaults to 3000).

Optionally set `ANTHROPIC_API_KEY` (see `.env.example`) to get AI-written concept names, mood
blurbs, and step captions instead of the built-in template text. The drawings themselves are
always generated locally regardless of the key.

## Structure

- `app/page.tsx` — landing page: drawing prompt + style picker
- `app/options/page.tsx` — 3 final-product concepts to pick from
- `app/steps/page.tsx` — step-by-step tutorial viewer (picture slideshow + "play like a video"
  autoplay)
- `lib/subjects.ts` — the procedural SVG subject library (guides/outline/details/colorFills per
  subject)
- `lib/styles.ts` — style presets (Line Art, Cartoon, Watercolor, Pixel, Pencil Shade) and color
  palettes
- `lib/matchSubject.ts` — keyword matching from free text to a subject template
- `lib/render.tsx` — composes a subject + style + palette + step into SVG
- `lib/generate.ts` — Claude-backed (with fallback) concept/caption generation
- `lib/session.ts` — passes the picked concept from the options page to the steps page
