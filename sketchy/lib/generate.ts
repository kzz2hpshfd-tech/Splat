import Anthropic from "@anthropic-ai/sdk";
import { matchSubject } from "./matchSubject";
import { findStyle, StyleKey } from "./styles";
import { TOTAL_STEPS } from "./render";

export type Concept = {
  id: string;
  title: string;
  blurb: string;
  subjectKey: string;
  styleKey: StyleKey;
  paletteIndex: number;
  steps: string[];
};

export type GenerateResult = { concepts: Concept[]; source: "ai" | "fallback"; reason?: string };

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
 * Turns a free-text drawing prompt + chosen art style into 3 final-product
 * concepts, each with 4 step captions. The visual subject is always matched
 * from our fixed template library (matchSubject) since the SVG step engine
 * only knows how to draw those shapes — Claude (when configured) only
 * supplies the creative titles/blurbs/captions layered on top. Falls back to
 * a deterministic template so the app always works with zero configuration.
 */
export async function generateConcepts(prompt: string, styleKey: StyleKey): Promise<GenerateResult> {
  const subject = matchSubject(prompt);
  const style = findStyle(styleKey);
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (!apiKey) {
    const reason = `no working ANTHROPIC_API_KEY (${describeKeyShape()})`;
    console.error(`[sketchy] ${reason}`);
    return { concepts: buildFallback(prompt, subject.key, subject.label, style.key, style.label), source: "fallback", reason };
  }

  try {
    const concepts = await generateWithClaude(prompt, subject.key, subject.label, style.key, style.label, apiKey);
    return { concepts, source: "ai" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const reason = `AI call failed: ${message}`;
    console.error(`[sketchy] ${reason} — key shape: ${describeKeyShape()}`, err);
    return { concepts: buildFallback(prompt, subject.key, subject.label, style.key, style.label), source: "fallback", reason };
  }
}

async function generateWithClaude(
  prompt: string,
  subjectKey: string,
  subjectLabel: string,
  styleKey: StyleKey,
  styleLabel: string,
  apiKey: string
): Promise<Concept[]> {
  const anthropic = new Anthropic({ apiKey });

  const aiPrompt = `You are a friendly art teacher inside a drawing app called "sketchy". A user typed that they want to draw: "${prompt}", in ${styleLabel} style. We matched that to our "${subjectLabel}" drawing template.

Our app always teaches this template in exactly 4 fixed steps:
1. Block in the basic construction shapes (circles/ovals/rectangles) to set proportions.
2. Draw the main outline over those shapes.
3. Add smaller details and features (face, texture, accessories).
4. Add color and finishing touches in ${styleLabel} style.

Give 3 different creative variations of the final "${subjectLabel}" the user could pick as their finished piece (different moods/personalities/color vibes — the actual shapes stay the same, so lean on mood, color, and flavor text to differentiate them). Return ONLY a JSON array, no prose, no markdown fences, in this exact shape:
[{"title":"<punchy 2-4 word name for this variant>","blurb":"<one upbeat sentence describing this variant's mood>","steps":["<step 1 caption, imperative, about blocking in basic shapes for THIS subject>","<step 2 caption, about drawing the main outline>","<step 3 caption, about adding details/features>","<step 4 caption, about adding color/shading to finish, matching this variant's mood>"]}]
Exactly 3 items in the array, each with exactly 4 steps.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    messages: [{ role: "user", content: aiPrompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("no text block");

  const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned) as { title: string; blurb: string; steps: string[] }[];

  return parsed.slice(0, 3).map((c, i) => ({
    id: `${subjectKey}-${styleKey}-${i}`,
    title: c.title,
    blurb: c.blurb,
    subjectKey,
    styleKey,
    paletteIndex: i,
    steps: c.steps.slice(0, TOTAL_STEPS),
  }));
}

const MOODS = [
  { name: "Classic", adj: "warm, friendly" },
  { name: "Cool", adj: "calm, breezy" },
  { name: "Wild", adj: "bold, playful" },
];

function buildFallback(
  prompt: string,
  subjectKey: string,
  subjectLabel: string,
  styleKey: StyleKey,
  styleLabel: string
): Concept[] {
  const trimmedPrompt = prompt.trim() || subjectLabel;

  return MOODS.map((mood, i) => ({
    id: `${subjectKey}-${styleKey}-${i}`,
    title: `${mood.name} ${subjectLabel}`,
    blurb: `A ${mood.adj} take on your "${trimmedPrompt}", drawn in ${styleLabel.toLowerCase()} style.`,
    subjectKey,
    styleKey,
    paletteIndex: i,
    steps: [
      `Lightly sketch the basic shapes to block in the ${subjectLabel}'s proportions.`,
      `Draw the main outline over your guide shapes.`,
      `Add the smaller details and features that make it a ${subjectLabel}.`,
      `Finish with ${styleLabel.toLowerCase()} color and shading for a ${mood.adj} feel.`,
    ],
  }));
}
