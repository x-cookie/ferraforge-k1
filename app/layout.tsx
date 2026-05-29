import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Ferra — CLAUDE.md Forge",
  description: "Ferra is an AI agent with 59 curated skills. Paste a GitHub URL or describe your stack — she generates a production-ready CLAUDE.md, skill pack, hooks, and setup guide in 30 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} ${instrumentSerif.variable}`}
      style={{
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
      }}
    >
      <body>{children}</body>
    </html>
  );
}
