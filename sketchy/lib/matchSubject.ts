import { allSubjects, DOODLE_SUBJECT, SubjectTemplate } from "./subjects";

export function matchSubject(prompt: string): SubjectTemplate {
  const text = prompt.toLowerCase();
  let best: SubjectTemplate | null = null;
  let bestLen = 0;

  for (const subject of allSubjects()) {
    for (const keyword of subject.keywords) {
      if (text.includes(keyword) && keyword.length > bestLen) {
        best = subject;
        bestLen = keyword.length;
      }
    }
  }

  return best ?? DOODLE_SUBJECT;
}
