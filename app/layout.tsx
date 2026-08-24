import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { ZuriProvider } from "@/lib/data/context";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zuri — Eat good, feel better.",
  description:
    "Zuri is your AI food bestie — it figures out what to eat, tracks it, and keeps you on track. Built first for Nigerians and Africans.",
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
    <html lang="en" className={`${display.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ZuriProvider>{children}</ZuriProvider>
      </body>
    </html>
  );
}
