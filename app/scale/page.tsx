import Blob from "@/components/Blob";
import PressureScale from "@/components/PressureScale";

export const metadata = {
  title: "finger scale · splat",
  description: "Weigh things in grams using your device's real touch-pressure sensor.",
};

export default function ScalePage() {
  return (
    <main className="relative isolate overflow-hidden px-5 pb-16 pt-12">
      <Blob className="h-72 w-72 -top-10 -left-16" from="#22d3ee" to="#7c3aed" />
      <Blob className="h-64 w-64 top-52 -right-20" from="#ff2ea6" to="#a3e635" />

      <div className="relative mx-auto max-w-sm text-center">
        <p className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
          press to weigh
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
          <span className="text-gradient">finger scale</span>
        </h1>
        <p className="mx-auto mt-3 mb-8 max-w-xs text-sm text-white/60">
          Calibrate once against a known weight, then press to get a live gram reading from your
          screen&apos;s actual pressure sensor.
        </p>

        <PressureScale />
      </div>
    </main>
  );
}
