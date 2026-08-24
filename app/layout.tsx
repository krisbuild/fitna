import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ZuriProvider } from "@/lib/data/context";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zuri — Eat well. Build well. Live well.",
  description:
    "Zuri is an AI nutrition coach and Nigerian healthy cookbook that adapts to your Season — Lean, Build, or Balance — with meal scripts made for the way you actually eat.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1F3A2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ZuriProvider>{children}</ZuriProvider>
      </body>
    </html>
  );
}
