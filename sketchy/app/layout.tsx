import type { Metadata, Viewport } from "next";
import "./globals.css";
import { caveat, inter } from "./fonts";

export const metadata: Metadata = {
  title: "sketchy",
  description: "Say what you want to draw, pick a style, and get a step-by-step tutorial to make it.",
};

export const viewport: Viewport = {
  themeColor: "#faf6ee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${caveat.variable} ${inter.variable}`}>
      <body className="font-body text-ink antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
