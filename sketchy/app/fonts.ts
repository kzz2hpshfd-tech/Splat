import { Caveat, Inter } from "next/font/google";

export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
