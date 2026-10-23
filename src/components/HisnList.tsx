"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { fold, useFavorites } from "@/lib/hisn-client";

type Entry = { n: number; title: string };

function subscribeScroll(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  return () => window.removeEventListener("scroll", listener);
}

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
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 240,
    () => false,
  );

  return (
    <>
      <div className={reading ? "hidden lg:block" : ""}>{heading}</div>
      <div className="lg:border-line lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-10">
        <aside
          className={`lg:border-line lg:sticky lg:top-16 lg:block lg:h-[calc(100dvh-4rem)] lg:border-r lg:pt-6 lg:pr-4 ${reading ? "hidden" : "block pt-6"}`}
        >
          <HisnList chapters={chapters} />
        </aside>
        <div className={`min-w-0 ${reading ? "block" : "hidden lg:block"}`}>{children}</div>
      </div>
      {reading && <HisnDrawer chapters={chapters} visible={scrolled} />}
    </>
  );
}

function HisnDrawer({ chapters, visible }: { chapters: Entry[]; visible: boolean }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("[data-active]")?.scrollIntoView({ block: "center" });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Hap listën e lutjeve"
        aria-expanded={open}
        className={`border-gold/50 bg-card/80 text-gold fixed top-24 left-0 z-30 flex flex-col items-center gap-1.5 rounded-r-2xl border border-l-0 px-2 py-3 shadow-[0_8px_24px_-6px_rgb(0_0_0/0.6)] backdrop-blur-md transition-all duration-300 ${
          visible && !open ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-full opacity-0"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
        <span className="text-[10px] font-medium tracking-wider uppercase [writing-mode:vertical-rl]">Lutjet</span>
      </button>

      <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} role="dialog" aria-modal aria-label="Lista e lutjeve">
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          ref={panelRef}
          className={`border-line bg-paper absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto rounded-r-[1.75rem] border-r px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="font-serif text-lg font-semibold">Lutjet</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Mbyll"
              className="border-line text-muted hover:text-ink grid size-9 place-items-center rounded-full border transition-colors"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          {open && <HisnList chapters={chapters} onNavigate={() => setOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

export default function HisnList({ chapters, onNavigate }: { chapters: Entry[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = Number(pathname.split("/")[2]) || 0;
  const favs = useFavorites();
  const [tab, setTab] = useState<"all" | "fav">("all");
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>("[data-active]");
    const list = listRef.current?.parentElement;
    if (!el || !list || window.innerWidth < 1024) return;
    const box = list.getBoundingClientRect();
    const bottom = Math.min(box.bottom, window.innerHeight);
    const item = el.getBoundingClientRect();
    if (item.top >= box.top + 24 && item.bottom <= bottom - 24) return;
    const top = list.scrollTop + item.top - (box.top + bottom) / 2 + item.height / 2;
    list.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [active]);

  const items = useMemo(() => {
    const q = fold(search.trim());
    const pool = tab === "fav" ? chapters.filter((c) => favs.includes(c.n)) : chapters;
    if (!q) return pool;
    return pool.filter((c) => String(c.n) === q || fold(c.title).includes(q));
  }, [chapters, favs, search, tab]);

  return (
    <div className="flex h-full flex-col">
      <label className="relative block">
        <span className="sr-only">Kërko një dua</span>
        <svg
          viewBox="0 0 24 24"
          className="text-muted pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2"
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
          className="border-line bg-card placeholder:text-muted focus:border-gold w-full rounded-xl border py-2.5 pr-3 pl-9 text-[13px] outline-none"
        />
      </label>

      <div className="border-line mt-3 flex gap-5 border-b text-[13px]" role="tablist">
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
            className={`-mb-px flex items-center gap-1.5 border-b-2 pb-2 font-medium transition-colors ${
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

      <div className="pt-2 lg:-mr-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-3 lg:pb-6 lg:[mask-image:linear-gradient(to_bottom,transparent,#000_14px,#000_calc(100%-28px),transparent)]">
        <ul ref={listRef} className="space-y-0.5">
          {items.map((c) => {
            const isActive = c.n === active;
            const isFav = favs.includes(c.n);
            return (
              <li key={c.n}>
                <Link
                  href={`/mburoja/${c.n}`}
                  onClick={onNavigate}
                  data-active={isActive || undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center gap-2.5 rounded-xl border p-1.5 pr-2.5 transition-colors ${
                    isActive
                      ? "border-emerald-deep/40 bg-emerald-soft"
                      : "hover:border-line hover:bg-card border-transparent"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-lg border font-serif text-[11px] tabular-nums transition-colors ${
                      isActive
                        ? "border-emerald-deep bg-emerald-deep text-paper font-semibold"
                        : "border-line bg-card text-gold/80 group-hover:border-gold/40"
                    }`}
                  >
                    {c.n}
                  </span>
                  <span
                    className={`flex-1 text-[13px] leading-snug ${isActive ? "text-emerald-deep font-medium" : "text-ink/85 group-hover:text-ink"}`}
                  >
                    {c.title}
                  </span>
                  {isFav && (
                    <svg viewBox="0 0 24 24" className="text-gold size-3 shrink-0" fill="currentColor" aria-label="Favorite">
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
