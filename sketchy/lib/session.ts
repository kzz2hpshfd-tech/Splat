import { Concept } from "./generate";

const KEY = "sketchy:concept";

export function saveConcept(concept: Concept) {
  sessionStorage.setItem(KEY, JSON.stringify(concept));
}

export function loadConcept(): Concept | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Concept;
  } catch {
    return null;
  }
}
