"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearCalibration,
  getCalibration,
  saveCalibration,
  type ScaleCalibration,
} from "@/lib/pressureScale";

type SensorSupport = "unknown" | "supported" | "unsupported";

// Values a touchscreen reports when it has no real force sensor: a flat 0.5 while
// touched (the Pointer Events spec's mandated default) or a flat 1 from some
// browsers' touch->force shims. Anything that isn't one of these, or that moves
// around during a single press, means we're looking at a genuine analog signal
// (3D Touch/Force Touch hardware, or a pressure-sensitive stylus).
const FAKE_RAW_VALUES = [0, 0.5, 1];
const FAKE_EPSILON = 0.001;
const VARIATION_EPSILON = 0.02;

function looksFake(value: number) {
  return FAKE_RAW_VALUES.some((fake) => Math.abs(value - fake) < FAKE_EPSILON);
}

export default function PressureScale() {
  const [raw, setRaw] = useState(0);
  const [pressing, setPressing] = useState(false);
  const [sensorSupport, setSensorSupport] = useState<SensorSupport>("unknown");
  const [calibration, setCalibration] = useState<ScaleCalibration | null>(null);
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationGrams, setCalibrationGrams] = useState("24");
  const [calibrationError, setCalibrationError] = useState<string | null>(null);

  const padRef = useRef<HTMLDivElement | null>(null);
  const latestRawRef = useRef(0);
  const gestureValuesRef = useRef<number[]>([]);
  const gestureMaxRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setCalibration(getCalibration());
  }, []);

  const tick = useCallback(() => {
    setRaw(latestRawRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const recordSample = useCallback((value: number) => {
    latestRawRef.current = value;
    gestureValuesRef.current.push(value);
    gestureMaxRef.current = Math.max(gestureMaxRef.current, value);
  }, []);

  const evaluateGesture = useCallback(() => {
    const values = gestureValuesRef.current;
    if (values.length === 0) return;

    const hasNonFakeSample = values.some((v) => !looksFake(v));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const hasVariation = max - min > VARIATION_EPSILON;

    setSensorSupport((prev) => {
      if (prev === "supported") return prev;
      if (hasNonFakeSample || hasVariation) return "supported";
      if (prev === "unknown") return "unsupported";
      return prev;
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      padRef.current?.setPointerCapture(e.pointerId);
      gestureValuesRef.current = [];
      gestureMaxRef.current = 0;
      recordSample(e.pressure);
      setPressing(true);
      setCalibrationError(null);
      rafRef.current = requestAnimationFrame(tick);
    },
    [recordSample, tick]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pressing) return;
      recordSample(e.pressure);
    },
    [pressing, recordSample]
  );

  const finishGesture = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPressing(false);
    latestRawRef.current = 0;
    setRaw(0);
    evaluateGesture();

    if (calibrating) {
      const knownGrams = Number(calibrationGrams);
      const capturedRaw = gestureMaxRef.current;

      if (!Number.isFinite(knownGrams) || knownGrams <= 0) {
        setCalibrationError("Enter a valid weight in grams first.");
        return;
      }
      if (capturedRaw < FAKE_EPSILON || looksFake(capturedRaw)) {
        setCalibrationError(
          "No real pressure signal detected — this device doesn't expose force data, so it can't be calibrated."
        );
        return;
      }

      const next = saveCalibration(knownGrams, capturedRaw);
      setCalibration(next);
      setCalibrating(false);
      setCalibrationError(null);
    }
  }, [calibrating, calibrationGrams, evaluateGesture]);

  const handlePointerUp = useCallback(() => finishGesture(), [finishGesture]);
  const handlePointerCancel = useCallback(() => finishGesture(), [finishGesture]);

  // Some browsers only surface real analog force through legacy Touch.force
  // rather than PointerEvent.pressure — merge in whichever reads higher.
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!pressing) return;
      const force = e.nativeEvent.touches[0]?.force;
      if (typeof force === "number" && force > latestRawRef.current) {
        recordSample(force);
      }
    },
    [pressing, recordSample]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const grams = calibration ? raw * calibration.scaleFactor : null;
  const pct = Math.max(0, Math.min(1, raw));

  return (
    <div className="space-y-6">
      <div
        ref={padRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onTouchMove={handleTouchMove}
        className={`relative mx-auto flex h-56 w-56 select-none flex-col items-center justify-center rounded-full border-4 text-center transition-colors duration-150 ${
          pressing
            ? "border-splat-cyan bg-splat-cyan/10"
            : "border-white/15 bg-white/5"
        }`}
        style={{ touchAction: "none" }}
        role="button"
        aria-label="Press here to weigh"
      >
        <div
          aria-hidden="true"
          className="absolute inset-2 rounded-full bg-gradient-to-br from-splat-pink via-splat-magenta to-splat-cyan transition-opacity duration-100"
          style={{ opacity: pct * 0.35 }}
        />
        <div className="relative">
          {grams !== null ? (
            <>
              <p className="font-display text-5xl tabular-nums text-white">{grams.toFixed(1)}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">grams</p>
            </>
          ) : (
            <>
              <p className="font-display text-4xl tabular-nums text-white/80">{Math.round(pct * 100)}%</p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">pressure</p>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-sm text-white/60">
        {calibrating
          ? "Press and hold with your calibration weight, then lift off."
          : "Press and hold your finger on the pad."}
      </p>

      {sensorSupport === "unsupported" && !calibrating && (
        <div className="rounded-2xl border border-splat-orange/40 bg-splat-orange/10 p-4 text-sm text-white/80">
          <p className="font-semibold text-splat-orange">No force sensor detected</p>
          <p className="mt-1 text-white/60">
            This screen only reports on/off touch, not how hard you're pressing — so a plain finger
            tap can&apos;t be converted to a real gram value here. Live pressure weighing needs a
            3D&nbsp;Touch/Force&nbsp;Touch display (older iPhones, some Mac trackpads) or a
            pressure-sensitive stylus (Apple&nbsp;Pencil, Surface&nbsp;Pen, Wacom).
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-ink/90 p-4">
        {calibration && !calibrating && (
          <p className="mb-3 text-center text-xs text-white/50">
            Calibrated against {calibration.knownGrams}g · {new Date(calibration.calibratedAt).toLocaleString()}
          </p>
        )}

        {calibrating ? (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-white/60">
              Weight of your calibration object (g)
            </label>
            <input
              inputMode="decimal"
              value={calibrationGrams}
              onChange={(e) => setCalibrationGrams(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 font-display text-xl text-white outline-none ring-2 ring-transparent focus:ring-splat-cyan"
              placeholder="e.g. 24 (an AA battery)"
            />
            {calibrationError && <p className="text-xs font-semibold text-splat-orange">{calibrationError}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setCalibrating(false);
                  setCalibrationError(null);
                }}
                className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white/80"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setCalibrating(true);
                setCalibrationError(null);
              }}
              className="flex-1 rounded-xl bg-gradient-to-r from-splat-pink to-splat-purple py-3 text-sm font-semibold text-white"
            >
              {calibration ? "Recalibrate" : "Calibrate"}
            </button>
            {calibration && (
              <button
                type="button"
                onClick={() => {
                  clearCalibration();
                  setCalibration(null);
                }}
                className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white/70"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-white/40">
        Readings come from your device&apos;s real force signal (Pointer Events pressure / touch
        force) scaled against your calibration weight — nothing here is simulated.
      </p>
    </div>
  );
}
