export type Persona = {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
};

export const PERSONAS: Persona[] = [
  { id: "romantic", label: "Romantic trip", emoji: "\u{1F48B}", blurb: "just the two of you" },
  { id: "mom", label: "Mom / mother-in-law", emoji: "\u{1F490}", blurb: "keep everyone happy" },
  { id: "girls-trip", label: "Girls trip", emoji: "✨", blurb: "the whole crew" },
  { id: "guys-trip", label: "Guys trip", emoji: "\u{1F3C0}", blurb: "no notes needed" },
  { id: "family", label: "Family day", emoji: "\u{1F46A}", blurb: "kid-approved, parent-approved" },
  { id: "solo", label: "Solo reset", emoji: "\u{1F9D8}", blurb: "just you, no agenda" },
  { id: "first-date", label: "First date", emoji: "\u{1F440}", blurb: "low-pressure, high-charm" },
  { id: "squad", label: "Squad night out", emoji: "\u{1F525}", blurb: "loud, fun, late" },
];

export type Vibe = { id: string; label: string; emoji: string };

export const VIBES: Vibe[] = [
  { id: "chill", label: "Chill", emoji: "\u{1F343}" },
  { id: "adventurous", label: "Adventurous", emoji: "⛰️" },
  { id: "foodie", label: "Foodie", emoji: "\u{1F35C}" },
  { id: "artsy", label: "Artsy", emoji: "\u{1F3A8}" },
  { id: "nightlife", label: "Nightlife", emoji: "\u{1F303}" },
  { id: "outdoorsy", label: "Outdoorsy", emoji: "\u{1F333}" },
];

export type Budget = { id: string; label: string };

export const BUDGETS: Budget[] = [
  { id: "free", label: "Free" },
  { id: "$", label: "$" },
  { id: "$$", label: "$$" },
  { id: "$$$", label: "$$$" },
];

export function findPersona(id: string | null | undefined): Persona {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}

export function findVibe(id: string | null | undefined): Vibe | undefined {
  return VIBES.find((v) => v.id === id);
}
