import Link from "next/link";
import { IconArrowRight, IconBook, IconChat, IconLeaf } from "@/components/icons";
import { SEASONS } from "@/lib/types";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sand-100 overflow-x-clip">
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <span className="font-display text-2xl font-extrabold tracking-tight text-forest-600">
          zuri
        </span>
        <Link
          href="/dashboard"
          className="btn-ghost !py-2.5 !px-4 text-sm !font-semibold"
        >
          open zuri
        </Link>
      </header>

      <section className="relative max-w-6xl mx-auto px-6 pt-8 pb-20 sm:pt-14 sm:pb-28">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 h-72 w-72 sm:h-96 sm:w-96 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #C7E24C, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute top-40 -left-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #C1502E, transparent 70%)",
          }}
        />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pop text-pop-ink text-xs font-bold px-3.5 py-1.5 -rotate-2">
            🍲 your ai food bestie
          </span>

          <h1 className="font-display text-4xl sm:text-6xl leading-[1.02] font-extrabold text-ink mt-5 tracking-tight">
            Eat good,
            <br />
            Feel better.
          </h1>

          <p className="mt-5 text-xl sm:text-2xl font-semibold text-ink leading-snug">
            your AI food bestie that figures out what to eat, tracks it, and
            keeps you on track.
          </p>

          <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed">
            stop overthinking food, we will figure out the meals. you enjoy
            them.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/onboarding" className="btn-primary text-base !font-bold">
              let's eat
              <IconArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link href="#seasons" className="btn-ghost text-base !font-semibold">
              see how it works
            </Link>
          </div>
        </div>

        <div className="relative mt-14 max-w-sm">
          <div className="card p-4 space-y-2.5 -rotate-1 shadow-lift">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-forest-600 text-sand-50 px-4 py-2.5 text-sm">
                wetin I go chop today? 👀
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-sand-100 px-4 py-2.5 text-sm text-ink">
                jollof + grilled chicken, ~550kcal. logged and on budget. i
                got you 🙌
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="seasons" className="max-w-6xl mx-auto px-6 pb-24 scroll-mt-20">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mb-2">
          pick your season
        </h2>
        <p className="text-ink-soft mb-6">
          losing weight, gaining, staying steady, or building muscle — zuri
          shifts to match.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(SEASONS).map((s, i) => (
            <div
              key={s.id}
              className="card p-5"
              style={{ transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)" }}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full mb-4"
                style={{ backgroundColor: s.color }}
              />
              <h3 className="font-display text-lg font-bold text-ink">
                {s.name}
              </h3>
              <p className="text-sm font-semibold mt-1" style={{ color: s.color }}>
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
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-6">
            <IconLeaf className="h-6 w-6 text-forest-500 mb-4" />
            <h3 className="font-display text-lg font-bold">
              no more "what do I eat" spirals
            </h3>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">
              your Meal Script shows up already built — real Nigerian food,
              matched to your targets. you just eat.
            </p>
          </div>
          <div className="card p-6">
            <IconBook className="h-6 w-6 text-clay-500 mb-4" />
            <h3 className="font-display text-lg font-bold">
              your favs, glowed up
            </h3>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">
              The Kitchen turns the food you already love into versions that
              actually fit your goal — grilled not fried, portioned not
              guessed.
            </p>
          </div>
          <div className="card p-6">
            <IconChat className="h-6 w-6 text-gold-500 mb-4" />
            <h3 className="font-display text-lg font-bold">
              a coach that texts back
            </h3>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">
              ask anything — "is amala okay rn?", "what should I eat before
              the gym?" — and get real answers, not vague vibes.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-ink-muted">
          <span className="font-semibold">zuri — eat good, feel better.</span>
          <span>made for naija &amp; africa, built to travel.</span>
        </div>
      </footer>
    </div>
  );
}
