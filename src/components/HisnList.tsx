"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { dayNumber, fold, useFavorites } from "@/lib/hisn-client";

type Entry = { n: number; title: string };

const noop = () => () => {};

export function HisnShell({
  chapters,
  heading,
  children,
}: {
  chapters: Entry[];
  heading: React.ReactNode;
  children: React.ReactNode;
}) {
  const reading = /^\/mburoja\/\d+/.test(usePathname());

  return (
    <>
      <div className={reading ? "hidden lg:block" : ""}>{heading}</div>
      <div className="lg:border-line lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 lg:border-t xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside
          className={`lg:border-line lg:sticky lg:top-16 lg:block lg:h-[calc(100dvh-4rem)] lg:border-r lg:py-6 lg:pr-6 ${reading ? "hidden" : "block"}`}
        >
          <HisnList chapters={chapters} />
        </aside>
        <div className={`min-w-0 ${reading ? "block" : "hidden lg:block"}`}>{children}</div>
      </div>
    </>
  );
}

export default function HisnList({ chapters }: { chapters: Entry[] }) {
  const pathname = usePathname();
  const active = Number(pathname.split("/")[2]) || 0;
  const favs = useFavorites();
  const [tab, setTab] = useState<"all" | "fav">("all");
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLUListElement>(null);
  const today = useSyncExternalStore(
    noop,
    () => dayNumber(chapters.length),
    () => 0,
  );

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>("[data-active]");
    const list = listRef.current?.parentElement;
    if (!el || !list || window.innerWidth < 1024) return;
    const top = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2;
    list.scrollTo({ top: Math.max(0, top) });
  }, [active]);

  const items = useMemo(() => {
    const q = fold(search.trim());
    const pool = tab === "fav" ? chapters.filter((c) => favs.includes(c.n)) : chapters;
    if (!q) return pool;
    return pool.filter((c) => String(c.n) === q || fold(c.title).includes(q));
  }, [chapters, favs, search, tab]);

  const dotd = today ? chapters[today - 1] : null;

  return (
    <div className="flex h-full flex-col">
      <label className="relative block">
        <span className="sr-only">Kërko një dua</span>
        <svg
          viewBox="0 0 24 24"
          className="text-muted pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko një dua..."
          className="border-line bg-card placeholder:text-muted focus:border-gold w-full rounded-2xl border py-3 pr-4 pl-11 text-sm outline-none"
        />
      </label>

      {dotd && !search && tab === "all" && (
        <Link
          href={`/mburoja/${dotd.n}`}
          className="group border-gold/40 from-gold-soft to-card hover:border-gold mt-4 block rounded-2xl border bg-gradient-to-br p-4 transition-colors"
        >
          <span className="text-gold text-[11px] font-medium tracking-[0.2em] uppercase">Duaja e ditës</span>
          <span className="mt-1 flex items-center justify-between gap-3">
            <span className="font-serif text-lg leading-snug">{dotd.title}</span>
            <span className="text-emerald-deep transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </span>
        </Link>
      )}

      <div className="border-line mt-4 flex gap-6 border-b text-sm" role="tablist">
        {(
          [
            ["all", "Të gjitha", chapters.length],
            ["fav", "Favoritet", favs.length],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`-mb-px flex items-center gap-2 border-b-2 pb-2.5 font-medium transition-colors ${
              tab === key ? "border-emerald-deep text-ink" : "text-muted hover:text-ink border-transparent"
            }`}
          >
            {label}
            <span
              className={`rounded-full px-1.5 text-[11px] tabular-nums ${tab === key ? "bg-emerald-soft text-emerald-deep" : "bg-card text-muted"}`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="lg:-mr-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-3">
        <ul ref={listRef} className="divide-line/70 divide-y">
          {items.map((c) => {
            const isActive = c.n === active;
            const isFav = favs.includes(c.n);
            return (
              <li key={c.n}>
                <Link
                  href={`/mburoja/${c.n}`}
                  data-active={isActive || undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center gap-4 rounded-xl px-2 py-3.5 transition-colors ${
                    isActive ? "bg-emerald-soft" : "hover:bg-card"
                  }`}
                >
                  <span
                    className={`w-7 shrink-0 text-right font-serif text-sm tabular-nums ${isActive ? "text-emerald-deep" : "text-gold/70"}`}
                  >
                    {c.n}
                  </span>
                  <span
                    className={`flex-1 text-[15px] leading-snug ${isActive ? "text-emerald-deep font-medium" : "text-ink/90 group-hover:text-ink"}`}
                  >
                    {c.title}
                  </span>
                  {isFav && (
                    <svg viewBox="0 0 24 24" className="text-gold size-3.5 shrink-0" fill="currentColor" aria-label="Favorite">
                      <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.3 4.5 7 4.5c2 0 3.5 1 5 2.8 1.5-1.8 3-2.8 5-2.8 3.7 0 6 3.8 4.5 7.3C19.5 16.4 12 21 12 21Z" />
                    </svg>
                  )}
                  <span className="text-muted text-sm transition-transform group-hover:translate-x-0.5 lg:hidden" aria-hidden>
                    ›
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {items.length === 0 && (
          <p className="border-line text-muted mt-4 rounded-2xl border border-dashed p-6 text-center text-sm">
            {tab === "fav" && !search
              ? "Nuk ke ende dua të preferuara. Shtyp zemrën te një dua për ta ruajtur këtu."
              : "Nuk u gjet asnjë dua. Provo një fjalë tjetër."}
          </p>
        )}
      </div>
    </div>
  );
}
