"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  IconBook,
  IconChart,
  IconChat,
  IconGear,
  IconHome,
  IconPlate,
} from "@/components/icons";
import { Profile, SEASONS } from "@/lib/types";
import { SeasonBadge } from "@/components/ui/SeasonBadge";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Today", icon: IconHome },
  { href: "/plate", label: "Plate", icon: IconPlate },
  { href: "/kitchen", label: "Kitchen", icon: IconBook },
  { href: "/journey", label: "Journey", icon: IconChart },
  { href: "/coach", label: "Coach", icon: IconChat },
];

export function AppShell({
  profile,
  children,
}: {
  profile: Profile | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const season = profile?.season ?? "glow";
  const seasonInfo = SEASONS[season];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ ["--season-color" as string]: seasonInfo.color }}
    >
      <header className="sticky top-0 z-20 bg-night/90 backdrop-blur border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-display text-xl font-extrabold tracking-tight text-cream">
              zuri
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {profile && <SeasonBadge season={season} size="sm" />}
            <Link
              href="/settings"
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/5 text-cream-soft"
              aria-label="Settings"
            >
              <IconGear className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-10">
        <div className="sm:flex sm:gap-8">
          <nav className="hidden sm:flex sm:flex-col sm:w-48 sm:shrink-0 gap-1 pt-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl2 px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-night-200 border border-white/[0.08] text-cream"
                      : "text-cream-soft hover:bg-white/5"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-20 bg-night-100/95 backdrop-blur border-t border-white/[0.08]">
        <div className="grid grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-pop" : "text-cream-soft"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
