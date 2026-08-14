import Link from "next/link";
import SplatLogo from "./SplatLogo";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-ink/60 border-b border-white/5">
      <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-between">
        <SplatLogo />
        <nav className="flex items-center gap-5 text-sm font-semibold text-white/80">
          <Link href="/for-you" className="hover:text-splat-cyan transition-colors">
            For You
          </Link>
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-splat-pink to-splat-purple px-4 py-1.5 text-white hover:opacity-90 transition-opacity"
          >
            New Splat
          </Link>
        </nav>
      </div>
    </header>
  );
}
