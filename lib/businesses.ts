export type DemoBusiness = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  emoji: string;
  from: string;
  to: string;
};

/**
 * Placeholder content — no real video backend yet. Structured so a real
 * business-video feed (upload, storage, accounts) can slot in later without
 * changing the Feed page's rendering.
 */
export const DEMO_BUSINESSES: DemoBusiness[] = [
  {
    id: "1",
    name: "Neon Cat Coffee",
    category: "Coffee Shop",
    blurb: "Cortados and a wall of plants. Open till midnight on weekends.",
    emoji: "☕",
    from: "#ff2ea6",
    to: "#7c3aed",
  },
  {
    id: "2",
    name: "Static & Vinyl",
    category: "Record Store",
    blurb: "Crate-digging, in-store sets every Friday, coffee bar in the back.",
    emoji: "🎧",
    from: "#22d3ee",
    to: "#7c3aed",
  },
  {
    id: "3",
    name: "Loop Arcade Bar",
    category: "Nightlife",
    blurb: "Pinball, skeeball, and a cocktail list that takes itself just seriously enough.",
    emoji: "🕹️",
    from: "#fb923c",
    to: "#c026d3",
  },
  {
    id: "4",
    name: "Terra Plant Co.",
    category: "Boutique",
    blurb: "Low-light plants that actually survive apartment life. Repotting bar on Saturdays.",
    emoji: "🪴",
    from: "#a3e635",
    to: "#22d3ee",
  },
  {
    id: "5",
    name: "Blackout Tattoo",
    category: "Studio",
    blurb: "Walk-in flash days every other Sunday. Fine-line specialists.",
    emoji: "🖤",
    from: "#c026d3",
    to: "#5b21b6",
  },
  {
    id: "6",
    name: "Flourtown Bakery",
    category: "Bakery",
    blurb: "Sourdough sells out by 10am. Worth setting an alarm for.",
    emoji: "🥐",
    from: "#fde047",
    to: "#fb923c",
  },
  {
    id: "7",
    name: "Grid Climbing Gym",
    category: "Fitness",
    blurb: "Bouldering for beginners, a genuinely good playlist, day passes available.",
    emoji: "🧗",
    from: "#22d3ee",
    to: "#a3e635",
  },
  {
    id: "8",
    name: "Hazy Days Bottle Shop",
    category: "Bar",
    blurb: "Rotating local taps, patio seating, dog-friendly.",
    emoji: "🍻",
    from: "#ff2ea6",
    to: "#fb923c",
  },
];
