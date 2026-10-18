"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/banner/prishtine.jpg",
    place: "Xhamia e Madhe (Fatih), Prishtinë",
    credit: "Fikret Ahmeti, CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Sultan_Mehmet_Fatih_Mosque_2.jpg",
    position: "center 40%",
  },
  {
    src: "/banner/prizren.jpg",
    place: "Xhamia e Sinan Pashës, Prizren",
    credit: "Ravi Dwivedi, CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Sinan_Pasha_Mosque,_Prizren,_Kosovo.jpg",
    position: "center 45%",
  },
  {
    src: "/banner/shkup.jpg",
    place: "Xhamia e Jahja Pashës, Shkup",
    credit: "Mitatos, CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:%D0%88%D0%B0%D1%85%D1%98%D0%B0-%D0%BF%D0%B0%D1%88%D0%B0.jpg",
    position: "center 35%",
  },
  {
    src: "/banner/tirane.jpg",
    place: "Xhamia e Et'hem Beut, Tiranë",
    credit: "Yastay, CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Detalle_Interior_de_la_Mezquita_de_Et%27hem_Bey_01.jpg",
    position: "center 30%",
  },
];

const INTERVAL = 6000;

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL,
    );
    return () => clearTimeout(timer);
  }, [index, paused]);

  const slide = SLIDES[index];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate -mt-16 h-[72vh] min-h-[520px] overflow-hidden sm:h-[80vh] sm:min-h-[620px]"
    >
      {SLIDES.map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.place}
          fill
          priority={i === 0}
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

      <a
        href={slide.source}
        target="_blank"
        rel="noreferrer"
        className="text-ink/50 hover:text-ink sm:text-ink/70 absolute right-4 bottom-16 z-10 max-w-[60%] text-right text-[10px] leading-snug sm:right-6 sm:bottom-24 sm:text-xs"
      >
        <span className="text-ink/70 sm:text-ink/90 block font-medium">
          {slide.place}
        </span>
        Foto: {slide.credit}
      </a>

      <div className="absolute top-1/2 right-3 z-10 flex -translate-y-1/2 flex-col gap-2 sm:right-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={s.place}
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
      </div>
    </section>
  );
}
