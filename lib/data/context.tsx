"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { DataAdapter } from "./adapter";
import { LocalAdapter } from "./local-adapter";
import { SupabaseAdapter } from "./supabase-adapter";

type AuthState = "loading" | "demo" | "authenticated" | "unauthenticated";

interface ZuriContextValue {
  adapter: DataAdapter | null;
  authState: AuthState;
  isSupabaseConfigured: boolean;
  signOut: () => Promise<void>;
}

const ZuriContext = createContext<ZuriContextValue | null>(null);

export function ZuriProvider({ children }: { children: React.ReactNode }) {
  const [adapter, setAdapter] = useState<DataAdapter | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAdapter(new LocalAdapter());
      setAuthState("demo");
      return;
    }

    const client = getSupabaseClient();
    let unsub: (() => void) | undefined;

    client.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAdapter(new SupabaseAdapter(client, data.session.user.id));
        setAuthState("authenticated");
      } else {
        setAdapter(null);
        setAuthState("unauthenticated");
      }
    });

    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAdapter(new SupabaseAdapter(client, session.user.id));
        setAuthState("authenticated");
      } else {
        setAdapter(null);
        setAuthState("unauthenticated");
      }
    });
    unsub = () => sub.subscription.unsubscribe();

    return () => unsub?.();
  }, []);

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await getSupabaseClient().auth.signOut();
    }
  };

  const value = useMemo(
    () => ({ adapter, authState, isSupabaseConfigured, signOut }),
    [adapter, authState]
  );

  return <ZuriContext.Provider value={value}>{children}</ZuriContext.Provider>;
}

export function useZuri(): ZuriContextValue {
  const ctx = useContext(ZuriContext);
  if (!ctx) throw new Error("useZuri must be used within ZuriProvider");
  return ctx;
}
