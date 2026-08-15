export type ScaleCalibration = {
  /** grams represented by one unit of raw pressure (raw=1 means "typical firm touch") */
  scaleFactor: number;
  knownGrams: number;
  rawAtCalibration: number;
  calibratedAt: number;
};

const STORAGE_KEY = "splat:scale-calibration";

export function getCalibration(): ScaleCalibration | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ScaleCalibration;
    if (!parsed || typeof parsed.scaleFactor !== "number" || !Number.isFinite(parsed.scaleFactor)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveCalibration(knownGrams: number, rawAtCalibration: number): ScaleCalibration {
  const calibration: ScaleCalibration = {
    scaleFactor: knownGrams / rawAtCalibration,
    knownGrams,
    rawAtCalibration,
    calibratedAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(calibration));
  }
  return calibration;
}

export function clearCalibration() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
