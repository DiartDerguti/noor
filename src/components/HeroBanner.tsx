"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ContinueReading from "./ContinueReading";

const SLIDES = [
  {
    src: "/banner/prishtine.jpg",
    place: "Xhamia e Madhe (Fatih), Prishtinë",
    credit: "Fikret Ahmeti, CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Sultan_Mehmet_Fatih_Mosque_2.jpg",
    position: "center 40%",
  },
  {
    src: "/banner/prizren.jpg",
    place: "Xhamia e Sinan Pashës, Prizren",
    credit: "Ravi Dwivedi, CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Sinan_Pasha_Mosque,_Prizren,_Kosovo.jpg",
    position: "center 45%",
  },
  {
    src: "/banner/shkup.jpg",
    place: "Xhamia e Jahja Pashës, Shkup",
    credit: "Mitatos, CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:%D0%88%D0%B0%D1%85%D1%98%D0%B0-%D0%BF%D0%B0%D1%88%D0%B0.jpg",
    position: "center 35%",
  },
  {
    src: "/banner/tirane.jpg",
    place: "Xhamia e Et'hem Beut, Tiranë",
    credit: "Yastay, CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Detalle_Interior_de_la_Mezquita_de_Et%27hem_Bey_01.jpg",
    position: "center 30%",
  },
];

const INTERVAL = 6000;

export default function HeroBanner({ hijri }: { hijri?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused]);

  const slide = SLIDES[index];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate -mt-16 h-[80vh] min-h-[620px] overflow-hidden"
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
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-paper via-paper/55 to-paper/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-paper/80 via-paper/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-paper/80 to-transparent" />

      <div className="absolute top-1/2 right-3 z-10 flex -translate-y-1/2 flex-col gap-2 sm:right-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={s.place}
            className={`w-1 rounded-full transition-all duration-500 ${
              i === index ? "h-5 bg-white/50" : "h-1 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pt-24 pb-28 sm:pb-36">
        {hijri && (
          <p className="mb-4 self-start rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-ink/90 backdrop-blur">
            {hijri}
          </p>
        )}
        <p className="arabic text-left text-4xl leading-normal text-gold drop-shadow sm:text-5xl">السلام عليكم</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight drop-shadow-lg sm:text-6xl">
          Esselamu alejkum.
        </h1>
        <div className="mt-6 flex justify-end">
          <a
            href={slide.source}
            target="_blank"
            rel="noreferrer"
            className="text-right text-xs leading-snug text-ink/70 hover:text-ink"
          >
            <span className="block font-medium text-ink/90">{slide.place}</span>
            Foto: {slide.credit}
          </a>
        </div>
      </div>
    </section>
  );
}
