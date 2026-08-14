import { Suspense } from "react";
import ResultsClient from "@/components/ResultsClient";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-white/40">loading…</div>}>
      <ResultsClient />
    </Suspense>
  );
}
