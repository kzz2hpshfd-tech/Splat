export type StyleKey = "line" | "cartoon" | "watercolor" | "pixel" | "shade";

export type StylePreset = {
  key: StyleKey;
  label: string;
  emoji: string;
  blurb: string;
  strokeWidth: number;
  strokeColor: string;
  useFill: boolean;
  fillOpacity?: number;
  roughFilter?: boolean;
  crisp?: boolean;
  hatch?: boolean;
  dash?: string;
};

export const STYLES: StylePreset[] = [
  {
    key: "line",
    label: "Line Art",
    emoji: "✏️",
    blurb: "Clean single-line outlines, no color.",
    strokeWidth: 3,
    strokeColor: "#241c14",
    useFill: false,
  },
  {
    key: "cartoon",
    label: "Cartoon",
    emoji: "🎨",
    blurb: "Bold outlines with bright flat color.",
    strokeWidth: 5,
    strokeColor: "#241c14",
    useFill: true,
  },
  {
    key: "watercolor",
    label: "Watercolor",
    emoji: "💧",
    blurb: "Soft wobbly edges with translucent color washes.",
    strokeWidth: 2,
    strokeColor: "#4a4038",
    useFill: true,
    fillOpacity: 0.72,
    roughFilter: true,
  },
  {
    key: "pixel",
    label: "Pixel",
    emoji: "🕹️",
    blurb: "Blocky retro edges, flat color fills.",
    strokeWidth: 1.5,
    strokeColor: "#241c14",
    useFill: true,
    crisp: true,
  },
  {
    key: "shade",
    label: "Pencil Shade",
    emoji: "✍️",
    blurb: "Graphite outlines with cross-hatch shading.",
    strokeWidth: 1.5,
    strokeColor: "#4a4038",
    useFill: true,
    hatch: true,
  },
];

export function findStyle(key: string): StylePreset {
  return STYLES.find((s) => s.key === key) ?? STYLES[0];
}

export type Palette = { primary: string; secondary: string; accent: string };

export const INK = "#241c14";

export const PALETTES: Palette[] = [
  { primary: "#ff6b5b", secondary: "#ffb020", accent: "#1fb6a8" },
  { primary: "#3ea6ff", secondary: "#8b5cf6", accent: "#ffb020" },
  { primary: "#1fb6a8", secondary: "#ff6b5b", accent: "#3ea6ff" },
];

export function paletteAt(index: number): Palette {
  return PALETTES[((index % PALETTES.length) + PALETTES.length) % PALETTES.length];
}
