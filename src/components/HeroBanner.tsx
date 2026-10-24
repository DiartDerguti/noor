"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/banner/xhamia-1.webp", position: "center 45%" },
  { src: "/banner/xhamia-2.webp", position: "center 50%" },
];

const INTERVAL = 3500;

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(1);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(
      () => {
        setIndex((i) => (i + 1) % SLIDES.length);
        setLoaded((n) => Math.min(SLIDES.length, n + 1));
      },
      INTERVAL,
    );
    return () => clearTimeout(timer);
  }, [index, paused]);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate -mt-16 h-[56vh] min-h-[420px] overflow-hidden sm:h-[80vh] sm:min-h-[620px]"
    >
      {SLIDES.slice(0, Math.max(loaded, index + 1) + 1).map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt="Xhamia"
          fill
          priority={i === 0}
          fetchPriority={i === 0 ? "high" : "low"}
          quality={60}
          sizes="100vw"
          style={{ objectPosition: s.position }}
          className={`-z-20 scale-[1.04] object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${
            i === index ? "scale-100 opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="from-paper via-paper/55 to-paper/10 absolute inset-0 -z-10 bg-gradient-to-t" />
      <div className="from-paper/80 via-paper/20 absolute inset-0 -z-10 bg-gradient-to-r to-transparent" />
      <div className="from-paper/80 absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b to-transparent" />

      <div className="absolute top-1/2 right-3 z-10 flex -translate-y-1/2 flex-col gap-2 sm:right-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Foto ${i + 1}`}
            className={`w-1 rounded-full transition-all duration-500 ${
              i === index
                ? "h-5 bg-white/50"
                : "h-1 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <p className="arabic text-gold text-left text-4xl leading-normal drop-shadow sm:text-5xl">
          السلام عليكم
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight drop-shadow-lg sm:text-6xl">
          Esselamu alejkum.
        </h1>
        <p className="text-ink/85 mt-3 max-w-md text-base leading-relaxed drop-shadow sm:text-lg">
          Kurani, hadithet, lutjet, kohët e namazit etj, në shqip. Falas dhe pa internet.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            ["/kurani", "Lexo Kuranin"],
            ["/hadithe", "Hadithet"],
            ["/mburoja", "Lutjet"],
          ].map(([href, label], i) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-medium backdrop-blur transition-colors ${
                i === 0
                  ? "bg-emerald-deep text-paper hover:opacity-90"
                  : "border border-white/20 bg-black/25 text-ink hover:border-gold"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
