import { Suspense } from "react";
import Link from "next/link";
import { RIYAD_SOURCE } from "@/lib/riyad";
import SearchInput from "@/components/SearchInput";

export function RiyadFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <header className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3 pt-6 pb-6 sm:grid-cols-[1fr_auto_1fr] sm:pt-8">
        <Link
          href="/hadithe"
          aria-label="Hadithet"
          className="group border-line bg-card text-muted hover:border-gold hover:text-ink inline-flex items-center gap-2 justify-self-start rounded-full border p-1.5 text-sm transition-colors sm:pr-4"
        >
          <span className="bg-emerald-soft text-emerald-deep grid size-7 place-items-center rounded-full transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span className="hidden sm:inline">Hadithet</span>
        </Link>
        <h1 className="text-center font-serif text-xl font-semibold tracking-tight text-balance sm:text-3xl">
          Rijadus Salihin i Imam Neveviut
        </h1>
        <span aria-hidden />
      </header>
      <Suspense>
        <SearchInput basePath="/hadithe/rijadus-salihin" />
      </Suspense>
      {children}
      <p className="text-muted mt-10 text-sm">
        Përkthimi shqip është marrë nga{" "}
        <a href={RIYAD_SOURCE} target="_blank" rel="noreferrer" className="text-emerald-deep underline-offset-4 hover:underline">
          mburoja.al/hadithe
        </a>
        .
      </p>
    </div>
  );
}
