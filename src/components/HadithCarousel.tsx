"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { id: string; title: string; source: string };

const INTERVAL = 7000;

export default function HadithCarousel({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % items.length), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, items.length]);

  if (items.length === 0) return null;
  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);
  const item = items[index];

  return (
    <figure
      className="select-none lg:border-l lg:border-gold/50 lg:pl-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        if (startX.current !== null) {
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }
        startX.current = null;
        setPaused(false);
      }}
    >
      <div className="grid">
        {items.map((h, i) => (
          <blockquote
            key={h.id}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 font-serif text-xl leading-relaxed text-ink/90 transition-all duration-700 sm:text-2xl ${
              i === index ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0"
            }`}
          >
            {h.title}
          </blockquote>
        ))}
      </div>

      <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>{item.source}</span>
          <Link href={`/hadithe/${item.id}`} className="font-medium text-emerald-deep underline-offset-4 hover:underline">
            Lexo hadithin →
          </Link>
        </span>
        <span className="flex items-center gap-1.5">
          {items.map((h, i) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Hadithi ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-5 bg-gold" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
