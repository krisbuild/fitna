import Link from "next/link";
import { IconArrowRight, IconBook, IconChat, IconLeaf } from "@/components/icons";
import { SEASONS } from "@/lib/types";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sand-100">
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <span className="font-display text-2xl font-semibold tracking-tight text-forest-600">
          Zuri
        </span>
        <Link href="/dashboard" className="btn-ghost !py-2.5 !px-4 text-sm">
          Open Zuri
        </Link>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 sm:pt-16 sm:pb-28">
        <div className="max-w-2xl">
          <span className="label-caps text-clay-600">
            Nutrition &amp; fitness, built for how Africa eats
          </span>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] font-semibold text-ink mt-4">
            Your food. Your goals.
            <br />
            <span className="italic text-clay-500">One Season at a time.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed">
            Zuri is an AI nutrition coach and Nigerian healthy cookbook in
            one — it learns whether you're in a Lean, Build, or Balance
            Season and reshapes your meal ideas, targets, and coaching
            around it. No foreign food database. No guesswork with jollof
            portions.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/onboarding" className="btn-primary text-base">
              Start your Season
              <IconArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link href="#seasons" className="btn-ghost text-base">
              See how Seasons work
            </Link>
          </div>
        </div>
      </section>

      <section id="seasons" className="max-w-6xl mx-auto px-6 pb-24 scroll-mt-20">
        <h2 className="label-caps text-ink-muted mb-6">Pick your Season</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {Object.values(SEASONS).map((s) => (
            <div key={s.id} className="card p-6">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full mb-4"
                style={{ backgroundColor: s.color }}
              />
              <h3 className="font-display text-xl font-semibold text-ink">
                {s.name}
              </h3>
              <p className="text-sm text-clay-600 font-medium mt-1">
                {s.tagline}
              </p>
              <p className="text-sm text-ink-soft mt-3 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="card p-6">
            <IconLeaf className="h-6 w-6 text-forest-500 mb-4" />
            <h3 className="font-display text-lg font-semibold">
              Meal Scripts
            </h3>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">
              Auto-generated daily meal ideas built from your Season, your
              targets, and real Nigerian dishes — not a generic 1200-calorie
              template.
            </p>
          </div>
          <div className="card p-6">
            <IconBook className="h-6 w-6 text-clay-500 mb-4" />
            <h3 className="font-display text-lg font-semibold">
              The Kitchen
            </h3>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">
              A growing cookbook of healthier takes on the food you already
              love — grilled instead of fried, portioned instead of
              guessed, still unmistakably home.
            </p>
          </div>
          <div className="card p-6">
            <IconChat className="h-6 w-6 text-gold-500 mb-4" />
            <h3 className="font-display text-lg font-semibold">
              Your Coach
            </h3>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">
              Ask anything — from "is amala okay in a Lean Season" to
              "what should I eat before a workout" — and get answers built
              for your goal and your food culture.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-ink-muted">
          <span>Zuri — eat well, build well, live well.</span>
          <span>Made for Nigeria &amp; Africa, built to travel.</span>
        </div>
      </footer>
    </div>
  );
}
