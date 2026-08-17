import { ColorFill, ColorSlot, SubjectTemplate, SvgShape } from "./subjects";
import { INK, Palette, StylePreset } from "./styles";

function resolveColor(slot: ColorSlot, palette: Palette): string {
  if (slot === "ink") return INK;
  return palette[slot];
}

function shapeEl(shape: SvgShape, key: string, props: React.SVGProps<SVGElement>) {
  switch (shape.kind) {
    case "circle":
      return <circle key={key} cx={shape.cx} cy={shape.cy} r={shape.r} {...(props as React.SVGProps<SVGCircleElement>)} />;
    case "ellipse":
      return (
        <ellipse
          key={key}
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          transform={shape.rotate ? `rotate(${shape.rotate} ${shape.cx} ${shape.cy})` : undefined}
          {...(props as React.SVGProps<SVGEllipseElement>)}
        />
      );
    case "rect":
      return (
        <rect
          key={key}
          x={shape.x}
          y={shape.y}
          width={shape.w}
          height={shape.h}
          rx={shape.rx ?? 0}
          {...(props as React.SVGProps<SVGRectElement>)}
        />
      );
    case "polygon":
      return <polygon key={key} points={shape.points} {...(props as React.SVGProps<SVGPolygonElement>)} />;
    case "path":
      return <path key={key} d={shape.d} {...(props as React.SVGProps<SVGPathElement>)} />;
    case "line":
      return <line key={key} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} {...(props as React.SVGProps<SVGLineElement>)} />;
  }
}

type StepLayers = { guides: SvgShape[]; guideOpacity: number; outline: SvgShape[]; details: SvgShape[]; fills: ColorFill[] };

export function stepLayers(subject: SubjectTemplate, style: StylePreset, step: number): StepLayers {
  if (step <= 1) return { guides: subject.guides, guideOpacity: 0.85, outline: [], details: [], fills: [] };
  if (step === 2) return { guides: subject.guides, guideOpacity: 0.3, outline: subject.outline, details: [], fills: [] };
  if (step === 3) return { guides: [], guideOpacity: 0, outline: subject.outline, details: subject.details, fills: [] };
  return {
    guides: [],
    guideOpacity: 0,
    outline: subject.outline,
    details: subject.details,
    fills: style.useFill ? subject.colorFills : [],
  };
}

export const TOTAL_STEPS = 4;

export function SubjectSvg({
  subject,
  style,
  palette,
  step,
  uid,
  className,
}: {
  subject: SubjectTemplate;
  style: StylePreset;
  palette: Palette;
  step: number;
  uid: string;
  className?: string;
}) {
  const layers = stepLayers(subject, style, step);
  const hatchId = `sketchy-hatch-${uid}`;
  const filterId = `sketchy-wc-${uid}`;

  return (
    <svg
      viewBox={subject.viewBox}
      className={className}
      shapeRendering={style.crisp ? "crispEdges" : undefined}
      role="img"
      aria-label={`${subject.label} drawing, step ${step}`}
    >
      <defs>
        <pattern id={hatchId} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#fffdf9" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#4a4038" strokeWidth="1.4" />
        </pattern>
        {style.roughFilter && (
          <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" />
          </filter>
        )}
      </defs>
      <g>
        {layers.guides.map((shape, i) =>
          shapeEl(shape, `g${i}`, {
            fill: "none",
            stroke: "#c9bfae",
            strokeWidth: 1.5,
            strokeDasharray: "4 3",
            opacity: layers.guideOpacity,
          })
        )}
        <g filter={style.roughFilter ? `url(#${filterId})` : undefined}>
          {layers.fills.map((cf, i) => {
            const fill = cf.slot === "ink" ? INK : style.hatch ? `url(#${hatchId})` : resolveColor(cf.slot, palette);
            return shapeEl(cf.shape, `f${i}`, {
              fill,
              stroke: "none",
              fillOpacity: style.fillOpacity ?? 1,
            });
          })}
        </g>
        {layers.outline.map((shape, i) =>
          shapeEl(shape, `o${i}`, {
            fill: "none",
            stroke: style.strokeColor,
            strokeWidth: style.strokeWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          })
        )}
        {layers.details.map((shape, i) =>
          shapeEl(shape, `d${i}`, {
            fill: "none",
            stroke: style.strokeColor,
            strokeWidth: Math.max(1, style.strokeWidth - 1),
            strokeLinecap: "round",
            strokeLinejoin: "round",
          })
        )}
      </g>
    </svg>
  );
}
