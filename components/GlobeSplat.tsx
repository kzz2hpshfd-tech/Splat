"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import landTopologyJson from "world-atlas/land-110m.json";

const landTopology = landTopologyJson as unknown as Parameters<typeof feature>[0];

type Phase = "spin" | "homing" | "impact" | "settled";

type GlobeSplatProps = {
  targetLat?: number;
  targetLng?: number;
  cityLabel?: string;
  onComplete?: () => void;
};

const SIZE = 288;
const CENTER = SIZE / 2;
const RADIUS = 112;
const SPIN_DEG_PER_MS = 300 / 1000; // fast, energetic spin
const MIN_SPIN_MS = 1100;
const MAX_SPIN_WAIT_MS = 5000;
const HOMING_MS = 550;
const IMPACT_MS = 750;
const BASE_TILT = -18;

const DROPLETS = [
  { angle: 20, dist: 90, size: 14, delay: 0 },
  { angle: 65, dist: 105, size: 10, delay: 40 },
  { angle: 110, dist: 82, size: 18, delay: 20 },
  { angle: 160, dist: 110, size: 9, delay: 70 },
  { angle: 205, dist: 92, size: 13, delay: 10 },
  { angle: 250, dist: 75, size: 11, delay: 60 },
  { angle: 295, dist: 108, size: 16, delay: 30 },
  { angle: 335, dist: 84, size: 10, delay: 50 },
];

function normalizeDeg(deg: number) {
  let d = deg % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const landFeature = feature(landTopology, landTopology.objects.land) as unknown as GeoPermissibleObjects;
const graticule = geoGraticule10();

export default function GlobeSplat({ targetLat, targetLng, cityLabel, onComplete }: GlobeSplatProps) {
  const [phase, setPhase] = useState<Phase>("spin");
  const [rotation, setRotation] = useState<[number, number]>([0, BASE_TILT]);
  const [landPath, setLandPath] = useState("");
  const [graticulePath, setGraticulePath] = useState("");

  const targetRef = useRef<{ lat?: number; lng?: number }>({});
  const phaseRef = useRef<Phase>("spin");
  const homingStartRef = useRef<{ rotation: [number, number]; time: number } | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    targetRef.current = { lat: targetLat, lng: targetLng };
  }, [targetLat, targetLng]);

  const projection = useMemo(
    () => geoOrthographic().translate([CENTER, CENTER]).scale(RADIUS).clipAngle(90).precision(0.4),
    []
  );
  const pathGen = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    function tick(now: number) {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const currentPhase = phaseRef.current;

      if (currentPhase === "spin") {
        const lambda = normalizeDeg(elapsed * SPIN_DEG_PER_MS);
        const target = targetRef.current;
        const haveTarget = target.lat !== undefined && target.lng !== undefined;
        const canHome = elapsed >= MIN_SPIN_MS && haveTarget;
        const mustHome = elapsed >= MAX_SPIN_WAIT_MS;

        if (canHome || mustHome) {
          homingStartRef.current = { rotation: [lambda, BASE_TILT], time: now };
          phaseRef.current = "homing";
          setPhase("homing");
        } else {
          projection.rotate([lambda, BASE_TILT]);
          setRotation([lambda, BASE_TILT]);
        }
      } else if (currentPhase === "homing") {
        const homing = homingStartRef.current!;
        const t = Math.min(1, (now - homing.time) / HOMING_MS);
        const eased = easeInOutCubic(t);
        const target = targetRef.current;
        const targetLambda = normalizeDeg(-(target.lng ?? 0));
        const targetPhi = Math.max(-55, Math.min(55, -(target.lat ?? 20)));

        const lambda = homing.rotation[0] + normalizeDeg(targetLambda - homing.rotation[0]) * eased;
        const phi = homing.rotation[1] + (targetPhi - homing.rotation[1]) * eased;
        projection.rotate([lambda, phi]);
        setRotation([lambda, phi]);

        if (t >= 1) {
          phaseRef.current = "impact";
          setPhase("impact");
          homingStartRef.current = { rotation: [lambda, phi], time: now };
        }
      } else if (currentPhase === "impact") {
        const started = homingStartRef.current!;
        if (now - started.time >= IMPACT_MS && !completedRef.current) {
          completedRef.current = true;
          phaseRef.current = "settled";
          setPhase("settled");
          onComplete?.();
          return;
        }
      } else {
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    projection.rotate(rotation);
    setLandPath(pathGen(landFeature) ?? "");
    setGraticulePath(pathGen(graticule as GeoPermissibleObjects) ?? "");
  }, [rotation, projection, pathGen]);

  const droplets = useMemo(() => DROPLETS, []);
  const impactOrSettled = phase === "impact" || phase === "settled";

  return (
    <div className="relative mx-auto h-72 w-72 select-none">
      {impactOrSettled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-splat-cyan/40 animate-ping" />
        </div>
      )}

      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in"
        style={{
          opacity: impactOrSettled ? 0 : 1,
          transform: impactOrSettled ? "scale(0.15) translateY(40px)" : "scale(1) translateY(0)",
        }}
      >
        <div className="relative h-full w-full rounded-full shadow-[0_0_60px_rgba(124,58,237,0.55)]">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full">
            <defs>
              <radialGradient id="oceanGradient" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#3a2160" />
                <stop offset="55%" stopColor="#1b0f33" />
                <stop offset="100%" stopColor="#0b0714" />
              </radialGradient>
              <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a3e635" />
                <stop offset="35%" stopColor="#22d3ee" />
                <stop offset="70%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#c026d3" />
              </linearGradient>
            </defs>
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#oceanGradient)" />
            <path d={graticulePath} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
            <path d={landPath} fill="url(#landGradient)" stroke="rgba(11,7,20,0.5)" strokeWidth={0.6} />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          </svg>
          <div className="absolute inset-0 rounded-full shadow-[inset_-18px_-18px_50px_rgba(11,7,20,0.65)]" />
        </div>
      </div>

      {impactOrSettled && (
        <div className="absolute inset-0 flex items-center justify-center animate-splat-in">
          <div
            className="h-32 w-32 animate-blob"
            style={{
              background: "linear-gradient(135deg, #ff2ea6 0%, #c026d3 40%, #7c3aed 75%, #22d3ee 100%)",
              boxShadow: "0 0 45px rgba(255,46,166,0.55)",
            }}
          />
        </div>
      )}

      {droplets.map((d, i) => {
        const rad = (d.angle * Math.PI) / 180;
        const x = Math.cos(rad) * d.dist;
        const y = Math.sin(rad) * d.dist;
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
              transform: impactOrSettled
                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                : "translate(-50%, -50%) scale(0)",
              opacity: phase === "settled" ? 0.85 : 1,
            }}
          />
        );
      })}

      {impactOrSettled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pin-drop text-4xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]">📍</div>
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
