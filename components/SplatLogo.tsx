import Link from "next/link";

export default function SplatLogo({ size = "text-2xl" }: { size?: string }) {
  return (
    <Link href="/" className={`font-display ${size} tracking-tight inline-flex items-center gap-1 group`}>
      <span className="text-gradient drop-shadow-[0_0_18px_rgba(255,46,166,0.45)] group-hover:animate-wobble">
        splat
      </span>
      <span className="inline-block h-[0.35em] w-[0.35em] rounded-full bg-splat-cyan translate-y-[0.05em] shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
    </Link>
  );
}
