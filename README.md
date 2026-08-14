# splat

Punch in your ZIP. Watch the globe spin. Get splatted on the map exactly where you are. Get a list
of fun things to do near you, tuned to who you're with — romantic trip, mom-in-law-approved,
girls trip, solo reset, whatever.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- `@anthropic-ai/sdk` for persona-aware activity generation, with a built-in template fallback so
  the app works with zero configuration
- [zippopotam.us](https://api.zippopotam.us) for free, keyless ZIP → city/state/lat-lng lookups
- Search history persisted client-side (`localStorage`) to power the **For You** page

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optionally set `ANTHROPIC_API_KEY` (see `.env.example`) to get live AI-generated activity ideas
instead of the curated template set.

## Structure

- `app/page.tsx` — landing page: ZIP input + persona/vibe/budget picker
- `app/results/page.tsx` — globe-spin → splat animation, then the activity grid
- `app/for-you/page.tsx` — personalized feed built from past searches
- `components/GlobeSplat.tsx` — the hero animation
- `lib/activities.ts` — activity generation (Claude + fallback template)
- `lib/zip.ts` — ZIP geocoding
- `lib/history.ts` — localStorage-backed search history
