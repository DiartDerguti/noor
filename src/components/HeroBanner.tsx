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
      className="relative isolate -mt-16 h-[80vh] min-h-[520px] overflow-hidden"
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
        <p className="mt-3 max-w-lg text-pretty text-ink/85 sm:text-lg">
          Kurani në shqip nga Hasan Efendi Nahi, Sherif Ahmeti dhe Feti Mehdiu, dhe hadithe të sakta nga Buhariu e
          Muslimi.
        </p>
        <ContinueReading />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={s.place}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-gold" : "w-3 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

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
