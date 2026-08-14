"use client";

import { useEffect, useMemo, useState } from "react";

type Phase = "spin" | "impact" | "settled";

type GlobeSplatProps = {
  cityLabel?: string;
  onComplete?: () => void;
};

const DROPLETS = [
  { angle: 20, dist: 70, size: 14, delay: 0 },
  { angle: 65, dist: 85, size: 10, delay: 40 },
  { angle: 110, dist: 65, size: 18, delay: 20 },
  { angle: 160, dist: 90, size: 9, delay: 70 },
  { angle: 205, dist: 75, size: 13, delay: 10 },
  { angle: 250, dist: 60, size: 11, delay: 60 },
  { angle: 295, dist: 88, size: 16, delay: 30 },
  { angle: 335, dist: 68, size: 10, delay: 50 },
];

export default function GlobeSplat({ cityLabel, onComplete }: GlobeSplatProps) {
  const [phase, setPhase] = useState<Phase>("spin");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("impact"), 1300);
    const t2 = setTimeout(() => {
      setPhase("settled");
      onComplete?.();
    }, 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const droplets = useMemo(() => DROPLETS, []);

  return (
    <div className="relative mx-auto h-72 w-72 select-none">
      {/* impact ring */}
      {phase !== "spin" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-splat-cyan/40 animate-ping" />
        </div>
      )}

      {/* globe */}
      <div
        className="perspective absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in"
        style={{
          opacity: phase === "spin" ? 1 : 0,
          transform: phase === "spin" ? "scale(1) translateY(0)" : "scale(0.15) translateY(40px)",
        }}
      >
        <div className="relative h-48 w-48 rounded-full animate-spin-slow shadow-[0_0_60px_rgba(124,58,237,0.55)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 25%, #7dd3fc 0%, transparent 35%), radial-gradient(circle at 70% 70%, #22d3ee 0%, transparent 45%), repeating-linear-gradient(100deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 3px, transparent 3px, transparent 18px), linear-gradient(135deg, #a3e635 0%, #22d3ee 35%, #7c3aed 70%, #c026d3 100%)",
            backgroundBlendMode: "screen, screen, overlay, normal",
          }}
        >
          <div className="absolute inset-0 rounded-full shadow-[inset_-18px_-18px_50px_rgba(11,7,20,0.65)]" />
        </div>
      </div>

      {/* splat burst */}
      {phase !== "spin" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-32 w-32 animate-blob animate-splat-in"
            style={{
              background:
                "linear-gradient(135deg, #ff2ea6 0%, #c026d3 40%, #7c3aed 75%, #22d3ee 100%)",
              boxShadow: "0 0 45px rgba(255,46,166,0.55)",
            }}
          />
        </div>
      )}

      {droplets.map((d, i) => {
        const rad = (d.angle * Math.PI) / 180;
        const x = Math.cos(rad) * d.dist;
        const y = Math.sin(rad) * d.dist;
        const settled: boolean = phase !== "spin";
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full transition-all ease-out"
            style={{
              width: d.size,
              height: d.size,
              background: i % 2 === 0 ? "#ff2ea6" : "#22d3ee",
              transitionDuration: "600ms",
              transitionDelay: `${d.delay}ms`,
              transform: settled
                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                : "translate(-50%, -50%) scale(0)",
              opacity: phase === "settled" ? 0.85 : 1,
            }}
          />
        );
      })}

      {/* pin */}
      {phase !== "spin" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pin-drop text-4xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]">
            📍
          </div>
        </div>
      )}

      {cityLabel && phase === "settled" && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full pt-3 text-center animate-splat-in">
          <p className="font-display text-xl text-gradient">{cityLabel}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">splatted</p>
        </div>
      )}
    </div>
  );
}
