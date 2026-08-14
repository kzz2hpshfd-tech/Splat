"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Splat", icon: "\u{1F4A5}" },
  { href: "/feed", label: "Feed", icon: "\u{1F3AC}" },
  { href: "/for-you", label: "For You", icon: "✨" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold"
            >
              <span
                className={`text-xl transition-transform ${active ? "scale-110" : "opacity-50"}`}
                aria-hidden="true"
              >
                {tab.icon}
              </span>
              <span className={active ? "text-gradient font-bold" : "text-white/40"}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
