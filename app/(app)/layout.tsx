"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useZuri } from "@/lib/data/context";
import { Profile } from "@/lib/types";
import { AppShell } from "@/components/nav/AppShell";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adapter, authState } = useZuri();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null | "loading">(
    "loading"
  );

  useEffect(() => {
    if (authState === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (!adapter) return;
    adapter.getProfile().then((p) => {
      setProfile(p);
      if (!p) router.replace("/onboarding");
    });
  }, [adapter, authState, router]);

  if (authState === "loading" || profile === "loading" || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <div className="flex flex-col items-center gap-3 text-cream-soft">
          <span className="font-display text-2xl font-extrabold text-cream">zuri</span>
          <span className="text-sm">setting your table…</span>
        </div>
      </div>
    );
  }

  return <AppShell profile={profile}>{children}</AppShell>;
}
