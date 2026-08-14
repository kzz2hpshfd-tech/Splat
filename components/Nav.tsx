import SplatLogo from "./SplatLogo";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-ink/60 border-b border-white/5">
      <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-center">
        <SplatLogo />
      </div>
    </header>
  );
}
