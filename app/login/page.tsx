"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-sand-100 flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <span className="font-display text-2xl font-semibold text-forest-600">
          Zuri
        </span>
        <h1 className="font-display text-2xl font-semibold text-ink mt-6">
          Welcome back
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input
            type="email"
            required
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-clay-600">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-sm text-ink-muted mt-6">
          New to Zuri?{" "}
          <Link href="/signup" className="text-clay-600 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
