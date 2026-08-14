import Anthropic from "@anthropic-ai/sdk";
import type { ZipLocation } from "./zip";
import { findPersona, findVibe } from "./personas";

export type Activity = {
  id: string;
  title: string;
  category: string;
  description: string;
  whyItFits: string;
  priceTier: "Free" | "$" | "$$" | "$$$";
};

export type SearchParams = {
  location: ZipLocation;
  personaId: string;
  vibeId?: string;
  budgetId?: string;
};

export type ActivitiesResult = {
  activities: Activity[];
  source: "ai" | "fallback";
  reason?: string;
};

function describeKeyShape(): string {
  const raw = process.env.ANTHROPIC_API_KEY;
  if (raw === undefined) return "env var is not set on this deployment at all";
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "env var is set but empty/blank";
  if (trimmed !== raw) return `env var has leading/trailing whitespace (len ${raw.length}, trimmed ${trimmed.length})`;
  if (!trimmed.startsWith("sk-ant-")) {
    return `env var is set (len ${trimmed.length}) but doesn't start with "sk-ant-" — wrong value pasted?`;
  }
  return `looks structurally valid (len ${trimmed.length}, starts with sk-ant-)`;
}

/**
 * Asks Claude for a persona-aware list of local activities. Falls back to a
 * deterministic template generator when no API key is configured, so the
 * app always works out of the box.
 *
 * Reads process.env fresh on every call (not cached at module load) and
 * reports the key's shape on failure, so a misconfigured/malformed key is
 * diagnosable from the UI alone, without digging through deployment logs.
 */
export async function generateActivities(params: SearchParams): Promise<ActivitiesResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (!apiKey) {
    const reason = `no working ANTHROPIC_API_KEY (${describeKeyShape()})`;
    console.error(`[splat] ${reason}`);
    return { activities: generateFromTemplate(params), source: "fallback", reason };
  }

  try {
    return { activities: await generateWithClaude(params, apiKey), source: "ai" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const reason = `AI call failed: ${message}`;
    console.error(`[splat] ${reason} — key shape: ${describeKeyShape()}`, err);
    return { activities: generateFromTemplate(params), source: "fallback", reason };
  }
}

async function generateWithClaude(
  { location, personaId, vibeId, budgetId }: SearchParams,
  apiKey: string
): Promise<Activity[]> {
  const anthropic = new Anthropic({ apiKey });
  const persona = findPersona(personaId);
  const vibe = findVibe(vibeId);

  const prompt = `You are a hyper-local concierge for a fun, young-skewing app called "splat". A user just splatted down on the map at ${location.city}, ${location.state} (ZIP ${location.zip}).

Trip type: "${persona.label}" (${persona.blurb})
${vibe ? `Vibe: ${vibe.label}` : ""}
${budgetId ? `Budget: ${budgetId}` : ""}

Suggest 6 real, specific, genuinely fun things to do near ${location.city}, ${location.state} that fit this trip type and vibe. Prefer real, well-known local spots/venues/neighborhoods over generic descriptions when you're confident they exist; otherwise give a specific, concrete type of activity (not vague filler like "explore the area").

Return ONLY a JSON array, no prose, no markdown fences, in this exact shape:
[{"title":"<short punchy name>","category":"<one of: Food & Drink, Outdoors, Nightlife, Arts & Culture, Chill, Adventure>","description":"<1-2 sentences, specific and concrete>","whyItFits":"<short phrase tying it to the trip type, e.g. 'low-key enough for mom, cute enough for a date'>","priceTier":"<one of: Free, $, $$, $$$>"}]`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("no text block");

  const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned) as Omit<Activity, "id">[];

  return parsed.map((a, i) => ({ ...a, id: `${location.zip}-${personaId}-${i}` }));
}

const TEMPLATES: Record<string, Omit<Activity, "id" | "description">[]> = {
  romantic: [
    { title: "Sunset patio for two", category: "Food & Drink", whyItFits: "candlelit, unrushed, easy to talk", priceTier: "$$" },
    { title: "Golden-hour walk downtown", category: "Outdoors", whyItFits: "free, pretty, great for photos", priceTier: "Free" },
    { title: "Small-batch dessert crawl", category: "Food & Drink", whyItFits: "shareable, low pressure", priceTier: "$" },
    { title: "Late-night rooftop bar", category: "Nightlife", whyItFits: "views + cocktails = a moment", priceTier: "$$" },
    { title: "Indie art house double feature", category: "Arts & Culture", whyItFits: "cozy, an easy excuse to sit close", priceTier: "$" },
    { title: "Paddle boats at the local park", category: "Outdoors", whyItFits: "silly, active, zero phones", priceTier: "$" },
  ],
  mom: [
    { title: "Botanical garden stroll", category: "Outdoors", whyItFits: "pretty, easy pace, great photo ops", priceTier: "$" },
    { title: "Farm-to-table brunch spot", category: "Food & Drink", whyItFits: "nice enough to impress, not stuffy", priceTier: "$$" },
    { title: "Local art museum", category: "Arts & Culture", whyItFits: "something to talk about after", priceTier: "$" },
    { title: "Afternoon tea or bakery cafe", category: "Chill", whyItFits: "sit-down, unhurried, classic", priceTier: "$" },
    { title: "Scenic overlook or lighthouse", category: "Outdoors", whyItFits: "free, memorable, easy walk", priceTier: "Free" },
    { title: "Boutique shopping strip", category: "Chill", whyItFits: "browsing beats sitting still", priceTier: "$$" },
  ],
  "girls-trip": [
    { title: "Rooftop brunch with bottomless mimosas", category: "Food & Drink", whyItFits: "the whole crew, obviously", priceTier: "$$" },
    { title: "Trendy photo-op mural walk", category: "Arts & Culture", whyItFits: "content for the group chat", priceTier: "Free" },
    { title: "Wine or paint night", category: "Chill", whyItFits: "everyone's in, no expertise needed", priceTier: "$$" },
    { title: "Dance floor with good playlists", category: "Nightlife", whyItFits: "peak group energy", priceTier: "$$" },
    { title: "Boutique spa afternoon", category: "Chill", whyItFits: "reset before the night out", priceTier: "$$$" },
    { title: "Late-night taco spot", category: "Food & Drink", whyItFits: "the unofficial end-of-night tradition", priceTier: "$" },
  ],
  "guys-trip": [
    { title: "Local brewery flight", category: "Food & Drink", whyItFits: "easy hang, no plan needed", priceTier: "$$" },
    { title: "Batting cages or mini golf", category: "Adventure", whyItFits: "instant competition", priceTier: "$" },
    { title: "Sports bar for the game", category: "Nightlife", whyItFits: "loud, easy, food included", priceTier: "$$" },
    { title: "Hiking trail with a view", category: "Outdoors", whyItFits: "free, active, brag-worthy photo", priceTier: "Free" },
    { title: "BBQ joint worth the wait", category: "Food & Drink", whyItFits: "everyone agrees on meat", priceTier: "$$" },
    { title: "Arcade bar", category: "Nightlife", whyItFits: "competitive without trying too hard", priceTier: "$$" },
  ],
  family: [
    { title: "Interactive science or kids' museum", category: "Arts & Culture", whyItFits: "built for every age in the group", priceTier: "$$" },
    { title: "Local zoo or aquarium", category: "Outdoors", whyItFits: "a whole afternoon, easy win", priceTier: "$$" },
    { title: "Splash pad or lakefront park", category: "Outdoors", whyItFits: "free, burns energy fast", priceTier: "Free" },
    { title: "Pizza place with an arcade corner", category: "Food & Drink", whyItFits: "food + fun in one stop", priceTier: "$" },
    { title: "Mini golf", category: "Adventure", whyItFits: "genuinely fun for adults too", priceTier: "$" },
    { title: "Ice cream shop with a walkable strip", category: "Chill", whyItFits: "easy reward, easy walk", priceTier: "$" },
  ],
  solo: [
    { title: "Independent coffee shop with a window seat", category: "Chill", whyItFits: "no agenda required", priceTier: "$" },
    { title: "Quiet nature trail", category: "Outdoors", whyItFits: "just you and your thoughts", priceTier: "Free" },
    { title: "Bookstore browse", category: "Chill", whyItFits: "an hour disappears easily", priceTier: "Free" },
    { title: "Local gallery or small museum", category: "Arts & Culture", whyItFits: "go at your own pace", priceTier: "$" },
    { title: "Solo counter seat at a good restaurant", category: "Food & Drink", whyItFits: "more normal than you think", priceTier: "$$" },
    { title: "Sunset spot with a view", category: "Outdoors", whyItFits: "free, grounding, worth the trip alone", priceTier: "Free" },
  ],
  "first-date": [
    { title: "Casual coffee or boba spot", category: "Food & Drink", whyItFits: "low stakes, easy to leave if needed", priceTier: "$" },
    { title: "Mini golf or an arcade", category: "Adventure", whyItFits: "built-in conversation, less eye contact pressure", priceTier: "$" },
    { title: "Walkable market or night market", category: "Outdoors", whyItFits: "always something to point at", priceTier: "Free" },
    { title: "Trivia night at a local bar", category: "Nightlife", whyItFits: "instant teamwork, low pressure", priceTier: "$" },
    { title: "Small live music venue", category: "Nightlife", whyItFits: "shared experience without forced talking", priceTier: "$$" },
    { title: "Ice cream walk-and-talk", category: "Chill", whyItFits: "classic for a reason", priceTier: "$" },
  ],
  squad: [
    { title: "Karaoke room booking", category: "Nightlife", whyItFits: "guaranteed chaos, guaranteed fun", priceTier: "$$" },
    { title: "Late-night food hall", category: "Food & Drink", whyItFits: "something for everyone's cravings", priceTier: "$" },
    { title: "Bar with a backyard or patio", category: "Nightlife", whyItFits: "room for the whole squad", priceTier: "$$" },
    { title: "Bowling with a bar attached", category: "Adventure", whyItFits: "competitive and social", priceTier: "$$" },
    { title: "Rooftop with a DJ", category: "Nightlife", whyItFits: "peak group energy, good photos", priceTier: "$$$" },
    { title: "24-hour diner run", category: "Food & Drink", whyItFits: "the night isn't over yet", priceTier: "$" },
  ],
};

function generateFromTemplate({ location, personaId, vibeId, budgetId }: SearchParams): Activity[] {
  const items = TEMPLATES[personaId] ?? TEMPLATES.romantic;
  const vibe = findVibe(vibeId);

  return items.map((item, i) => {
    const vibeClause = vibe ? `, tuned for a ${vibe.label.toLowerCase()} mood` : "";
    const budgetClause = budgetId ? ` if you're keeping it around ${budgetId}` : "";
    return {
      ...item,
      id: `${location.zip}-${personaId}-${vibeId ?? "any"}-${budgetId ?? "any"}-${i}`,
      description: `A ${item.category.toLowerCase()} pick near ${location.city}, ${location.stateAbbr}${vibeClause} — the kind of spot locals actually go back to${budgetClause}.`,
    };
  });
}
