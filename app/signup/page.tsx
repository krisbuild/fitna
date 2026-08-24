"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/onboarding");
    } else {
      setCheckEmail(true);
    }
  }

  return (
    <div className="min-h-screen bg-night flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <span className="font-display text-2xl font-semibold text-cream">
          Zuri
        </span>
        <h1 className="font-display text-2xl font-semibold text-cream mt-6">
          Create your account
        </h1>

        {checkEmail ? (
          <p className="text-cream-soft mt-6">
            Check your inbox at <strong>{email}</strong> to confirm your
            account, then sign in.
          </p>
        ) : (
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
              minLength={6}
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-clay-300">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}

        <p className="text-sm text-cream-soft mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-clay-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
