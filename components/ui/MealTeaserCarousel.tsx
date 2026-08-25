"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  title: string;
}

// Real Zuri food photography standing in for a video reel — a first taste
// of the motion/energy a proper video carousel will have once real clips
// are supplied. Ken Burns pan/zoom + crossfade instead of a static grid.
const SLIDES: Slide[] = [
  { src: "/images/food/nigerian-full-course.jpg", title: "A full course, done right" },
  { src: "/images/food/ofada-rice-ayamase.jpg", title: "Ofada Rice & Ayamase" },
  { src: "/images/food/gizdodo.jpg", title: "Gizdodo — grilled, not fried" },
  { src: "/images/food/egusi-plate.jpg", title: "Egusi Soup, Builder's Portion" },
  { src: "/images/food/party-fried-rice.jpg", title: "Nigerian Party Fried Rice" },
];

const SLIDE_DURATION_MS = 3400;

export function MealTeaserCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[16/10] w-full rounded-xl2 overflow-hidden bg-night-200">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="(min-width: 640px) 42rem, 100vw"
            className="object-cover"
            style={{
              animation:
                i === index
                  ? `zuri-kenburns ${SLIDE_DURATION_MS + 800}ms ease-out forwards`
                  : undefined,
            }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-night-300/80 backdrop-blur-sm px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-pop animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-wide text-cream">
          Meals to cook
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-cream leading-snug">
          {SLIDES[index].title}
        </h3>
      </div>
      <div className="absolute top-3 right-3 flex gap-1">
        {SLIDES.map((slide, i) => (
          <span
            key={slide.src}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? "w-4 bg-pop" : "w-1 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
