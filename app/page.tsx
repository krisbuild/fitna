import Link from "next/link";
import Image from "next/image";
import type { Viewport } from "next";
import { IconArrowRight, IconBook, IconChat, IconLeaf } from "@/components/icons";
import { SEASONS } from "@/lib/types";

export const viewport: Viewport = {
  themeColor: "#110C09",
  width: "device-width",
  initialScale: 1,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-night text-cream overflow-x-clip">
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <span className="font-display text-2xl font-extrabold tracking-tight text-cream">
          zuri
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="#modes"
            className="hidden sm:inline text-sm font-semibold text-cream-soft hover:text-cream transition-colors"
          >
            how it works
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-white/[0.15] text-cream text-sm font-semibold px-4 py-2.5 hover:bg-white/5 transition-colors"
          >
            open zuri
          </Link>
        </div>
      </header>

      <section className="relative max-w-6xl mx-auto px-6 pt-6 pb-20 sm:pt-10 sm:pb-28">
        <div
          aria-hidden
          className="absolute -top-32 right-[-10%] h-[32rem] w-[32rem] rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #E27A4C 0%, #C1502E 35%, transparent 70%)",
          }}
        />

        <div className="relative grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-night-300 border border-white/10 text-cream text-xs font-bold px-3.5 py-1.5">
              🔥 your ai food bestie
            </span>

            <h1 className="font-display text-4xl sm:text-6xl leading-[1.02] font-extrabold mt-5 tracking-tight">
              <span className="text-cream">Eat good,</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #FFC65C, #E27A4C)",
                }}
              >
                Feel better.
              </span>
            </h1>

            <p className="mt-5 text-xl sm:text-2xl font-semibold text-cream leading-snug">
              your AI food bestie that figures out what to eat, tracks it,
              and keeps you on track.
            </p>

            <p className="mt-4 text-base sm:text-lg text-cream-soft leading-relaxed max-w-md">
              stop overthinking food, we will figure out the meals. you
              enjoy them.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center rounded-full bg-pop text-pop-ink font-extrabold px-6 py-3.5 text-base hover:brightness-105 active:brightness-95 transition"
              >
                let's eat
                <IconArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="#modes"
                className="inline-flex items-center justify-center rounded-full border border-white/[0.15] text-cream font-semibold px-6 py-3.5 text-base hover:bg-white/5 transition-colors"
              >
                see how it works
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="absolute -inset-6 blur-3xl opacity-40 -z-10"
              style={{
                background:
                  "radial-gradient(circle, #C1502E 0%, transparent 70%)",
              }}
            />
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/images/food/nigerian-full-course.jpg"
                alt="Egusi, pounded yam, jollof rice, grilled chicken and fried plantain"
                fill
                priority
                quality={100}
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-8 -left-6 w-56 rounded-2xl bg-night-200/80 backdrop-blur-md border border-white/10 p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wide text-cream-soft">
                  today
                </span>
                <span className="text-[11px] font-bold text-pop">
                  on track
                </span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] text-cream-soft mb-1">
                    <span>fuel</span>
                    <span>1,480 / 2,150</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[69%] rounded-full" style={{ backgroundColor: "#FFC65C" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-cream-soft mb-1">
                    <span>protein</span>
                    <span>94 / 130g</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[72%] rounded-full" style={{ backgroundColor: "#5FCB8C" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modes" className="max-w-6xl mx-auto px-6 pb-24 scroll-mt-20">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-cream mb-2">
          what's your mode?
        </h2>
        <p className="text-cream-soft mb-6">
          cutting fat, building muscle, or staying steady — zuri shifts to
          match. switch any time, no big commitment.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {Object.values(SEASONS).map((s) => {
            const color = s.color;
            return (
              <div
                key={s.id}
                className="rounded-2xl bg-night-200 border border-white/[0.08] p-5"
                style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.03) inset` }}
              >
                <span className="text-3xl leading-none mb-4 block">
                  {s.emoji}
                </span>
                <h3 className="font-display text-lg font-bold text-cream">
                  {s.name}
                </h3>
                <p className="text-sm font-semibold mt-1" style={{ color }}>
                  {s.tagline}
                </p>
                <p className="text-sm text-cream-soft mt-3 leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-night-200 border border-white/[0.08] p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#5FCB8C]/[0.15] mb-4">
              <IconLeaf className="h-5 w-5" style={{ color: "#5FCB8C" }} />
            </span>
            <h3 className="font-display text-lg font-bold text-cream">
              no more "what do I eat" spirals
            </h3>
            <p className="text-sm text-cream-soft mt-2 leading-relaxed">
              your Meal Script shows up already built — real Nigerian food,
              matched to your targets. you just eat.
            </p>
          </div>
          <div className="rounded-2xl bg-night-200 border border-white/[0.08] p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#E27A4C]/[0.15] mb-4">
              <IconBook className="h-5 w-5" style={{ color: "#E27A4C" }} />
            </span>
            <h3 className="font-display text-lg font-bold text-cream">
              your favs, glowed up
            </h3>
            <p className="text-sm text-cream-soft mt-2 leading-relaxed">
              Meal Inspo turns the food you already love into versions that
              actually fit your goal — grilled not fried, portioned not
              guessed.
            </p>
          </div>
          <div className="rounded-2xl bg-night-200 border border-white/[0.08] p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pop/[0.15] mb-4">
              <IconChat className="h-5 w-5 text-pop" />
            </span>
            <h3 className="font-display text-lg font-bold text-cream">
              a coach that texts back
            </h3>
            <p className="text-sm text-cream-soft mt-2 leading-relaxed">
              ask anything — "is amala okay rn?", "what should I eat before
              the gym?" — and get real answers, not vague vibes.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-cream-soft">
          <span className="font-semibold text-cream">
            zuri — eat good, feel better.
          </span>
          <span>made for naija &amp; africa, built to travel.</span>
        </div>
      </footer>
    </div>
  );
}
