export type SvgShape =
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; rotate?: number }
  | { kind: "rect"; x: number; y: number; w: number; h: number; rx?: number }
  | { kind: "polygon"; points: string }
  | { kind: "path"; d: string; fillable?: boolean }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number };

export type ColorSlot = "primary" | "secondary" | "accent" | "ink";

export type ColorFill = { shape: SvgShape; slot: ColorSlot };

export type SubjectTemplate = {
  key: string;
  label: string;
  keywords: string[];
  viewBox: string;
  /** Step 1: light construction shapes to block in proportions. */
  guides: SvgShape[];
  /** Step 2: the main silhouette, drawn over the guides. */
  outline: SvgShape[];
  /** Step 3: features and texture added on top of the outline. */
  details: SvgShape[];
  /** Step 4: regions that get filled with color/shading in non-line-art styles. */
  colorFills: ColorFill[];
};

const SUBJECTS: SubjectTemplate[] = [
  {
    key: "cat",
    label: "cat",
    keywords: ["cat", "kitten", "kitty", "feline"],
    viewBox: "0 0 200 200",
    guides: [
      { kind: "circle", cx: 100, cy: 85, r: 40 },
      { kind: "ellipse", cx: 100, cy: 150, rx: 48, ry: 40 },
    ],
    outline: [
      { kind: "circle", cx: 100, cy: 85, r: 40 },
      { kind: "ellipse", cx: 100, cy: 150, rx: 48, ry: 40 },
      { kind: "path", d: "M65,60 L50,25 L85,50 Z" },
      { kind: "path", d: "M135,60 L150,25 L115,50 Z" },
      { kind: "path", d: "M148,160 C175,150 180,110 160,90", fillable: false },
    ],
    details: [
      { kind: "ellipse", cx: 82, cy: 82, rx: 6, ry: 8 },
      { kind: "ellipse", cx: 118, cy: 82, rx: 6, ry: 8 },
      { kind: "polygon", points: "97,95 103,95 100,100" },
      { kind: "path", d: "M100,100 Q90,108 82,102", fillable: false },
      { kind: "path", d: "M100,100 Q110,108 118,102", fillable: false },
      { kind: "line", x1: 60, y1: 92, x2: 20, y2: 88 },
      { kind: "line", x1: 60, y1: 98, x2: 20, y2: 98 },
      { kind: "line", x1: 60, y1: 104, x2: 20, y2: 108 },
      { kind: "line", x1: 140, y1: 92, x2: 180, y2: 88 },
      { kind: "line", x1: 140, y1: 98, x2: 180, y2: 98 },
      { kind: "line", x1: 140, y1: 104, x2: 180, y2: 108 },
    ],
    colorFills: [
      { shape: { kind: "circle", cx: 100, cy: 85, r: 40 }, slot: "primary" },
      { shape: { kind: "ellipse", cx: 100, cy: 150, rx: 48, ry: 40 }, slot: "primary" },
      { shape: { kind: "path", d: "M67,55 L58,32 L80,48 Z" }, slot: "secondary" },
      { shape: { kind: "path", d: "M133,55 L142,32 L120,48 Z" }, slot: "secondary" },
      { shape: { kind: "ellipse", cx: 82, cy: 82, rx: 6, ry: 8 }, slot: "ink" },
      { shape: { kind: "ellipse", cx: 118, cy: 82, rx: 6, ry: 8 }, slot: "ink" },
    ],
  },
  {
    key: "dog",
    label: "dog",
    keywords: ["dog", "puppy", "pup", "canine"],
    viewBox: "0 0 200 200",
    guides: [
      { kind: "circle", cx: 100, cy: 90, r: 38 },
      { kind: "ellipse", cx: 100, cy: 150, rx: 46, ry: 38 },
    ],
    outline: [
      { kind: "circle", cx: 100, cy: 90, r: 38 },
      { kind: "ellipse", cx: 100, cy: 150, rx: 46, ry: 38 },
      { kind: "path", d: "M65,70 C50,90 50,120 70,115 C75,95 72,80 65,70 Z" },
      { kind: "path", d: "M135,70 C150,90 150,120 130,115 C125,95 128,80 135,70 Z" },
      { kind: "ellipse", cx: 100, cy: 105, rx: 18, ry: 14 },
      { kind: "path", d: "M146,155 C170,140 175,115 158,100", fillable: false },
    ],
    details: [
      { kind: "ellipse", cx: 85, cy: 82, rx: 5, ry: 6 },
      { kind: "ellipse", cx: 115, cy: 82, rx: 5, ry: 6 },
      { kind: "path", d: "M100,105 Q90,115 82,108", fillable: false },
      { kind: "path", d: "M100,105 Q110,115 118,108", fillable: false },
    ],
    colorFills: [
      { shape: { kind: "circle", cx: 100, cy: 90, r: 38 }, slot: "primary" },
      { shape: { kind: "ellipse", cx: 100, cy: 150, rx: 46, ry: 38 }, slot: "primary" },
      { shape: { kind: "path", d: "M65,70 C50,90 50,120 70,115 C75,95 72,80 65,70 Z" }, slot: "secondary" },
      { shape: { kind: "path", d: "M135,70 C150,90 150,120 130,115 C125,95 128,80 135,70 Z" }, slot: "secondary" },
      { shape: { kind: "ellipse", cx: 100, cy: 100, rx: 6, ry: 5 }, slot: "ink" },
      { shape: { kind: "ellipse", cx: 85, cy: 82, rx: 5, ry: 6 }, slot: "ink" },
      { shape: { kind: "ellipse", cx: 115, cy: 82, rx: 5, ry: 6 }, slot: "ink" },
    ],
  },
  {
    key: "house",
    label: "house",
    keywords: ["house", "home", "cottage", "cabin"],
    viewBox: "0 0 200 200",
    guides: [
      { kind: "rect", x: 50, y: 100, w: 100, h: 80 },
      { kind: "polygon", points: "50,100 100,50 150,100" },
    ],
    outline: [
      { kind: "rect", x: 50, y: 100, w: 100, h: 80 },
      { kind: "path", d: "M45,102 L100,45 L155,102 Z" },
      { kind: "rect", x: 90, y: 135, w: 20, h: 45 },
      { kind: "rect", x: 125, y: 55, w: 14, h: 30 },
    ],
    details: [
      { kind: "rect", x: 65, y: 115, w: 22, h: 22 },
      { kind: "rect", x: 113, y: 115, w: 22, h: 22 },
      { kind: "line", x1: 76, y1: 115, x2: 76, y2: 137 },
      { kind: "line", x1: 65, y1: 126, x2: 87, y2: 126 },
      { kind: "line", x1: 124, y1: 115, x2: 124, y2: 137 },
      { kind: "line", x1: 113, y1: 126, x2: 135, y2: 126 },
      { kind: "circle", cx: 105, cy: 158, r: 2 },
    ],
    colorFills: [
      { shape: { kind: "path", d: "M45,102 L100,45 L155,102 Z" }, slot: "secondary" },
      { shape: { kind: "rect", x: 50, y: 100, w: 100, h: 80 }, slot: "primary" },
      { shape: { kind: "rect", x: 90, y: 135, w: 20, h: 45 }, slot: "accent" },
      { shape: { kind: "rect", x: 65, y: 115, w: 22, h: 22 }, slot: "accent" },
      { shape: { kind: "rect", x: 113, y: 115, w: 22, h: 22 }, slot: "accent" },
    ],
  },
  {
    key: "tree",
    label: "tree",
    keywords: ["tree", "oak", "pine", "forest"],
    viewBox: "0 0 200 200",
    guides: [
      { kind: "ellipse", cx: 100, cy: 80, rx: 55, ry: 50 },
      { kind: "rect", x: 90, y: 120, w: 20, h: 60 },
    ],
    outline: [
      { kind: "circle", cx: 70, cy: 85, r: 35 },
      { kind: "circle", cx: 100, cy: 60, r: 38 },
      { kind: "circle", cx: 130, cy: 85, r: 35 },
      { kind: "circle", cx: 100, cy: 100, r: 40 },
      { kind: "rect", x: 90, y: 120, w: 20, h: 55, rx: 4 },
    ],
    details: [
      { kind: "line", x1: 95, y1: 130, x2: 95, y2: 170 },
      { kind: "line", x1: 105, y1: 135, x2: 105, y2: 165 },
      { kind: "circle", cx: 65, cy: 70, r: 5 },
      { kind: "circle", cx: 135, cy: 70, r: 5 },
      { kind: "circle", cx: 100, cy: 45, r: 5 },
    ],
    colorFills: [
      { shape: { kind: "circle", cx: 70, cy: 85, r: 35 }, slot: "secondary" },
      { shape: { kind: "circle", cx: 100, cy: 60, r: 38 }, slot: "secondary" },
      { shape: { kind: "circle", cx: 130, cy: 85, r: 35 }, slot: "secondary" },
      { shape: { kind: "circle", cx: 100, cy: 100, r: 40 }, slot: "secondary" },
      { shape: { kind: "rect", x: 90, y: 120, w: 20, h: 55, rx: 4 }, slot: "primary" },
      { shape: { kind: "circle", cx: 65, cy: 70, r: 5 }, slot: "accent" },
      { shape: { kind: "circle", cx: 135, cy: 70, r: 5 }, slot: "accent" },
      { shape: { kind: "circle", cx: 100, cy: 45, r: 5 }, slot: "accent" },
    ],
  },
  {
    key: "sun",
    label: "sun",
    keywords: ["sun", "sunshine", "sunny"],
    viewBox: "0 0 200 200",
    guides: [{ kind: "circle", cx: 100, cy: 100, r: 40 }],
    outline: [
      { kind: "circle", cx: 100, cy: 100, r: 40 },
      { kind: "line", x1: 145, y1: 100, x2: 175, y2: 100 },
      { kind: "line", x1: 131.8, y1: 131.8, x2: 153, y2: 153 },
      { kind: "line", x1: 100, y1: 145, x2: 100, y2: 175 },
      { kind: "line", x1: 68.2, y1: 131.8, x2: 47, y2: 153 },
      { kind: "line", x1: 55, y1: 100, x2: 25, y2: 100 },
      { kind: "line", x1: 68.2, y1: 68.2, x2: 47, y2: 47 },
      { kind: "line", x1: 100, y1: 55, x2: 100, y2: 25 },
      { kind: "line", x1: 131.8, y1: 68.2, x2: 153, y2: 47 },
    ],
    details: [
      { kind: "ellipse", cx: 85, cy: 95, rx: 4, ry: 5 },
      { kind: "ellipse", cx: 115, cy: 95, rx: 4, ry: 5 },
      { kind: "path", d: "M80,110 Q100,125 120,110", fillable: false },
    ],
    colorFills: [
      { shape: { kind: "circle", cx: 100, cy: 100, r: 40 }, slot: "primary" },
      { shape: { kind: "ellipse", cx: 85, cy: 95, rx: 4, ry: 5 }, slot: "ink" },
      { shape: { kind: "ellipse", cx: 115, cy: 95, rx: 4, ry: 5 }, slot: "ink" },
    ],
  },
  {
    key: "star",
    label: "star",
    keywords: ["star", "stars", "starry"],
    viewBox: "0 0 200 200",
    guides: [{ kind: "circle", cx: 100, cy: 100, r: 55 }],
    outline: [
      {
        kind: "polygon",
        points: "100,45 112.9,82.2 152.3,83.0 120.9,106.8 132.3,144.5 100,122 67.7,144.5 79.1,106.8 47.7,83.0 87.1,82.2",
      },
    ],
    details: [
      { kind: "line", x1: 30, y1: 50, x2: 30, y2: 62 },
      { kind: "line", x1: 24, y1: 56, x2: 36, y2: 56 },
      { kind: "line", x1: 170, y1: 145, x2: 170, y2: 157 },
      { kind: "line", x1: 164, y1: 151, x2: 176, y2: 151 },
      { kind: "circle", cx: 160, cy: 50, r: 3 },
    ],
    colorFills: [
      {
        shape: {
          kind: "polygon",
          points:
            "100,45 112.9,82.2 152.3,83.0 120.9,106.8 132.3,144.5 100,122 67.7,144.5 79.1,106.8 47.7,83.0 87.1,82.2",
        },
        slot: "primary",
      },
    ],
  },
  {
    key: "heart",
    label: "heart",
    keywords: ["heart", "love"],
    viewBox: "0 0 200 200",
    guides: [
      { kind: "circle", cx: 75, cy: 85, r: 30 },
      { kind: "circle", cx: 125, cy: 85, r: 30 },
    ],
    outline: [
      {
        kind: "path",
        d: "M100,175 C60,140 30,110 30,80 C30,55 55,40 75,55 C85,63 95,75 100,90 C105,75 115,63 125,55 C145,40 170,55 170,80 C170,110 140,140 100,175 Z",
      },
    ],
    details: [
      { kind: "ellipse", cx: 72, cy: 70, rx: 8, ry: 5, rotate: -20 },
      { kind: "circle", cx: 35, cy: 45, r: 3 },
      { kind: "circle", cx: 165, cy: 45, r: 2.5 },
    ],
    colorFills: [
      {
        shape: {
          kind: "path",
          d: "M100,175 C60,140 30,110 30,80 C30,55 55,40 75,55 C85,63 95,75 100,90 C105,75 115,63 125,55 C145,40 170,55 170,80 C170,110 140,140 100,175 Z",
        },
        slot: "primary",
      },
      { shape: { kind: "ellipse", cx: 72, cy: 70, rx: 8, ry: 5, rotate: -20 }, slot: "accent" },
    ],
  },
  {
    key: "flower",
    label: "flower",
    keywords: ["flower", "rose", "daisy", "tulip", "sunflower", "blossom"],
    viewBox: "0 0 200 200",
    guides: [{ kind: "circle", cx: 100, cy: 100, r: 18 }],
    outline: [
      { kind: "ellipse", cx: 134, cy: 100, rx: 14, ry: 24, rotate: 0 },
      { kind: "ellipse", cx: 117, cy: 129.4, rx: 14, ry: 24, rotate: 60 },
      { kind: "ellipse", cx: 83, cy: 129.4, rx: 14, ry: 24, rotate: 120 },
      { kind: "ellipse", cx: 66, cy: 100, rx: 14, ry: 24, rotate: 180 },
      { kind: "ellipse", cx: 83, cy: 70.6, rx: 14, ry: 24, rotate: 240 },
      { kind: "ellipse", cx: 117, cy: 70.6, rx: 14, ry: 24, rotate: 300 },
      { kind: "circle", cx: 100, cy: 100, r: 18 },
      { kind: "path", d: "M100,116 C98,140 104,160 100,185", fillable: false },
    ],
    details: [
      { kind: "ellipse", cx: 80, cy: 150, rx: 14, ry: 7, rotate: -30 },
      { kind: "ellipse", cx: 120, cy: 160, rx: 14, ry: 7, rotate: 30 },
      { kind: "circle", cx: 92, cy: 95, r: 2 },
      { kind: "circle", cx: 108, cy: 95, r: 2 },
      { kind: "circle", cx: 100, cy: 108, r: 2 },
    ],
    colorFills: [
      { shape: { kind: "ellipse", cx: 134, cy: 100, rx: 14, ry: 24, rotate: 0 }, slot: "primary" },
      { shape: { kind: "ellipse", cx: 117, cy: 129.4, rx: 14, ry: 24, rotate: 60 }, slot: "primary" },
      { shape: { kind: "ellipse", cx: 83, cy: 129.4, rx: 14, ry: 24, rotate: 120 }, slot: "primary" },
      { shape: { kind: "ellipse", cx: 66, cy: 100, rx: 14, ry: 24, rotate: 180 }, slot: "primary" },
      { shape: { kind: "ellipse", cx: 83, cy: 70.6, rx: 14, ry: 24, rotate: 240 }, slot: "primary" },
      { shape: { kind: "ellipse", cx: 117, cy: 70.6, rx: 14, ry: 24, rotate: 300 }, slot: "primary" },
      { shape: { kind: "circle", cx: 100, cy: 100, r: 18 }, slot: "accent" },
      { shape: { kind: "ellipse", cx: 80, cy: 150, rx: 14, ry: 7, rotate: -30 }, slot: "secondary" },
      { shape: { kind: "ellipse", cx: 120, cy: 160, rx: 14, ry: 7, rotate: 30 }, slot: "secondary" },
    ],
  },
  {
    key: "fish",
    label: "fish",
    keywords: ["fish", "goldfish", "shark", "koi"],
    viewBox: "0 0 200 200",
    guides: [{ kind: "ellipse", cx: 90, cy: 100, rx: 55, ry: 35 }],
    outline: [
      { kind: "ellipse", cx: 90, cy: 100, rx: 55, ry: 35 },
      { kind: "polygon", points: "145,100 185,70 185,130" },
      { kind: "path", d: "M70,68 C85,50 105,55 110,68 Z" },
    ],
    details: [
      { kind: "circle", cx: 55, cy: 90, r: 6 },
      { kind: "path", d: "M75,85 Q65,100 75,115", fillable: false },
      { kind: "path", d: "M60,105 Q65,110 70,105", fillable: false },
      { kind: "path", d: "M32,97 Q26,100 32,103", fillable: false },
    ],
    colorFills: [
      { shape: { kind: "ellipse", cx: 90, cy: 100, rx: 55, ry: 35 }, slot: "primary" },
      { shape: { kind: "polygon", points: "145,100 185,70 185,130" }, slot: "secondary" },
      { shape: { kind: "path", d: "M70,68 C85,50 105,55 110,68 Z" }, slot: "secondary" },
      { shape: { kind: "circle", cx: 55, cy: 90, r: 6 }, slot: "ink" },
    ],
  },
  {
    key: "car",
    label: "car",
    keywords: ["car", "truck", "vehicle", "automobile", "race car"],
    viewBox: "0 0 200 200",
    guides: [{ kind: "rect", x: 30, y: 100, w: 140, h: 45, rx: 10 }],
    outline: [
      { kind: "rect", x: 30, y: 100, w: 140, h: 45, rx: 10 },
      { kind: "path", d: "M55,100 L75,65 L135,65 L155,100 Z" },
      { kind: "circle", cx: 65, cy: 150, r: 18 },
      { kind: "circle", cx: 145, cy: 150, r: 18 },
    ],
    details: [
      { kind: "polygon", points: "80,97 78,72 103,72 103,97" },
      { kind: "polygon", points: "107,97 107,72 130,72 132,97" },
      { kind: "line", x1: 105, y1: 100, x2: 105, y2: 143 },
      { kind: "circle", cx: 165, cy: 115, r: 5 },
    ],
    colorFills: [
      { shape: { kind: "rect", x: 30, y: 100, w: 140, h: 45, rx: 10 }, slot: "primary" },
      { shape: { kind: "path", d: "M55,100 L75,65 L135,65 L155,100 Z" }, slot: "secondary" },
      { shape: { kind: "polygon", points: "80,97 78,72 103,72 103,97" }, slot: "accent" },
      { shape: { kind: "polygon", points: "107,97 107,72 130,72 132,97" }, slot: "accent" },
      { shape: { kind: "circle", cx: 65, cy: 150, r: 18 }, slot: "ink" },
      { shape: { kind: "circle", cx: 145, cy: 150, r: 18 }, slot: "ink" },
      { shape: { kind: "circle", cx: 65, cy: 150, r: 6 }, slot: "secondary" },
      { shape: { kind: "circle", cx: 145, cy: 150, r: 6 }, slot: "secondary" },
    ],
  },
  {
    key: "robot",
    label: "robot",
    keywords: ["robot", "droid", "android", "bot"],
    viewBox: "0 0 200 200",
    guides: [
      { kind: "rect", x: 65, y: 40, w: 70, h: 55, rx: 8 },
      { kind: "rect", x: 55, y: 100, w: 90, h: 75, rx: 10 },
    ],
    outline: [
      { kind: "rect", x: 65, y: 40, w: 70, h: 55, rx: 8 },
      { kind: "rect", x: 55, y: 100, w: 90, h: 75, rx: 10 },
      { kind: "line", x1: 100, y1: 40, x2: 100, y2: 20 },
      { kind: "circle", cx: 100, cy: 16, r: 6 },
      { kind: "rect", x: 20, y: 110, w: 28, h: 16, rx: 4 },
      { kind: "rect", x: 152, y: 110, w: 28, h: 16, rx: 4 },
      { kind: "rect", x: 68, y: 178, w: 20, h: 18, rx: 4 },
      { kind: "rect", x: 112, y: 178, w: 20, h: 18, rx: 4 },
    ],
    details: [
      { kind: "rect", x: 78, y: 58, w: 12, h: 10, rx: 2 },
      { kind: "rect", x: 110, y: 58, w: 12, h: 10, rx: 2 },
      { kind: "rect", x: 85, y: 75, w: 30, h: 8, rx: 2 },
      { kind: "line", x1: 95, y1: 75, x2: 95, y2: 83 },
      { kind: "line", x1: 105, y1: 75, x2: 105, y2: 83 },
      { kind: "circle", cx: 100, cy: 135, r: 12 },
      { kind: "rect", x: 70, y: 150, w: 12, h: 12, rx: 2 },
      { kind: "rect", x: 118, y: 150, w: 12, h: 12, rx: 2 },
    ],
    colorFills: [
      { shape: { kind: "rect", x: 65, y: 40, w: 70, h: 55, rx: 8 }, slot: "primary" },
      { shape: { kind: "rect", x: 55, y: 100, w: 90, h: 75, rx: 10 }, slot: "secondary" },
      { shape: { kind: "rect", x: 20, y: 110, w: 28, h: 16, rx: 4 }, slot: "secondary" },
      { shape: { kind: "rect", x: 152, y: 110, w: 28, h: 16, rx: 4 }, slot: "secondary" },
      { shape: { kind: "rect", x: 68, y: 178, w: 20, h: 18, rx: 4 }, slot: "secondary" },
      { shape: { kind: "rect", x: 112, y: 178, w: 20, h: 18, rx: 4 }, slot: "secondary" },
      { shape: { kind: "circle", cx: 100, cy: 16, r: 6 }, slot: "accent" },
      { shape: { kind: "rect", x: 78, y: 58, w: 12, h: 10, rx: 2 }, slot: "accent" },
      { shape: { kind: "rect", x: 110, y: 58, w: 12, h: 10, rx: 2 }, slot: "accent" },
      { shape: { kind: "circle", cx: 100, cy: 135, r: 12 }, slot: "accent" },
    ],
  },
  {
    key: "butterfly",
    label: "butterfly",
    keywords: ["butterfly", "moth", "butterflies"],
    viewBox: "0 0 200 200",
    guides: [{ kind: "ellipse", cx: 100, cy: 100, rx: 8, ry: 40 }],
    outline: [
      { kind: "rect", x: 94, y: 65, w: 12, h: 75, rx: 6 },
      { kind: "path", d: "M96,66 C90,55 82,50 78,42", fillable: false },
      { kind: "path", d: "M104,66 C110,55 118,50 122,42", fillable: false },
      { kind: "path", d: "M94,90 C60,50 20,55 25,95 C28,120 65,120 94,100 Z" },
      { kind: "path", d: "M106,90 C140,50 180,55 175,95 C172,120 135,120 106,100 Z" },
      { kind: "path", d: "M94,105 C70,120 45,150 60,165 C78,175 96,145 96,120 Z" },
      { kind: "path", d: "M106,105 C130,120 155,150 140,165 C122,175 104,145 104,120 Z" },
    ],
    details: [
      { kind: "circle", cx: 55, cy: 80, r: 6 },
      { kind: "circle", cx: 145, cy: 80, r: 6 },
      { kind: "circle", cx: 70, cy: 140, r: 5 },
      { kind: "circle", cx: 130, cy: 140, r: 5 },
      { kind: "circle", cx: 78, cy: 42, r: 3 },
      { kind: "circle", cx: 122, cy: 42, r: 3 },
    ],
    colorFills: [
      { shape: { kind: "rect", x: 94, y: 65, w: 12, h: 75, rx: 6 }, slot: "ink" },
      { shape: { kind: "path", d: "M94,90 C60,50 20,55 25,95 C28,120 65,120 94,100 Z" }, slot: "primary" },
      { shape: { kind: "path", d: "M106,90 C140,50 180,55 175,95 C172,120 135,120 106,100 Z" }, slot: "primary" },
      { shape: { kind: "path", d: "M94,105 C70,120 45,150 60,165 C78,175 96,145 96,120 Z" }, slot: "secondary" },
      { shape: { kind: "path", d: "M106,105 C130,120 155,150 140,165 C122,175 104,145 104,120 Z" }, slot: "secondary" },
      { shape: { kind: "circle", cx: 55, cy: 80, r: 6 }, slot: "accent" },
      { shape: { kind: "circle", cx: 145, cy: 80, r: 6 }, slot: "accent" },
      { shape: { kind: "circle", cx: 70, cy: 140, r: 5 }, slot: "accent" },
      { shape: { kind: "circle", cx: 130, cy: 140, r: 5 }, slot: "accent" },
    ],
  },
  {
    key: "doodle",
    label: "doodle creature",
    keywords: [],
    viewBox: "0 0 200 200",
    guides: [{ kind: "circle", cx: 100, cy: 90, r: 45 }],
    outline: [
      { kind: "circle", cx: 100, cy: 90, r: 45 },
      { kind: "path", d: "M60,130 C50,160 70,185 100,180 C130,185 150,160 140,130 Z" },
      { kind: "path", d: "M60,150 Q40,140 30,150", fillable: false },
      { kind: "path", d: "M140,150 Q160,140 170,150", fillable: false },
    ],
    details: [
      { kind: "circle", cx: 85, cy: 85, r: 5 },
      { kind: "circle", cx: 115, cy: 85, r: 5 },
      { kind: "path", d: "M85,105 Q100,115 115,105", fillable: false },
      { kind: "circle", cx: 100, cy: 55, r: 4 },
    ],
    colorFills: [
      { shape: { kind: "circle", cx: 100, cy: 90, r: 45 }, slot: "primary" },
      { shape: { kind: "path", d: "M60,130 C50,160 70,185 100,180 C130,185 150,160 140,130 Z" }, slot: "secondary" },
      { shape: { kind: "circle", cx: 85, cy: 85, r: 5 }, slot: "ink" },
      { shape: { kind: "circle", cx: 115, cy: 85, r: 5 }, slot: "ink" },
      { shape: { kind: "circle", cx: 100, cy: 55, r: 4 }, slot: "accent" },
    ],
  },
];

export const DOODLE_SUBJECT = SUBJECTS[SUBJECTS.length - 1];

export function allSubjects(): SubjectTemplate[] {
  return SUBJECTS;
}

export function findSubject(key: string): SubjectTemplate {
  return SUBJECTS.find((s) => s.key === key) ?? DOODLE_SUBJECT;
}
