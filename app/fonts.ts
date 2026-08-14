import { Bungee, Inter } from "next/font/google";

export const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
