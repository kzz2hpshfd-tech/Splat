import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bungee, inter } from "./fonts";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "splat",
  description: "Punch in your ZIP. Get splatted on the map. Never not have a fun thing to do again.",
};

export const viewport: Viewport = {
  themeColor: "#150a29",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bungee.variable} ${inter.variable}`}>
      <body className="font-body text-white antialiased overflow-x-hidden">
        <Nav />
        <div className="pb-20">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
