"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { TOTAL_JUZ, TOTAL_PAGES, type SurahMeta } from "@/lib/quran";

export const OPEN_NAV_EVENT = "noor:open-nav";

type Tab = "sure" | "xhuz" | "faqe";

const TABS: { key: Tab; label: string }[] = [
  { key: "sure", label: "Sure" },
  { key: "xhuz", label: "Xhuz" },
  { key: "faqe", label: "Faqe" },
];

const simplify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "");

function current(pathname: string): { tab: Tab; value: number } {
  const [, , a, b] = pathname.split("/");
  if (a === "faqe") return { tab: "faqe", value: Number(b) };
  if (a === "xhuz") return { tab: "xhuz", value: Number(b) };
  return { tab: "sure", value: Number(a) };
}

function Panel({ surahs, onNavigate }: { surahs: SurahMeta[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const p = useSearchParams().get("p");
  const query = p ? `?p=${p}` : "";
  const active = current(pathname);
  const [tab, setTab] = useState<Tab>(active.tab);
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.querySelector("[data-active]")?.scrollIntoView({ block: "center" });
  }, [tab, pathname]);

  const items = useMemo(() => {
    const q = simplify(search);
    if (tab === "sure") {
      return surahs
        .filter((s) => !q || String(s.number) === q || simplify(s.englishName).includes(q))
        .map((s) => ({
          key: s.number,
          href: `/kurani/${s.number}${query}`,
          label: s.englishName,
          arabic: s.name.replace("سُورَةُ ", ""),
          active: active.tab === "sure" && active.value === s.number,
        }));
    }
    const total = tab === "xhuz" ? TOTAL_JUZ : TOTAL_PAGES;
    const word = tab === "xhuz" ? "Xhuzi" : "Faqja";
    return Array.from({ length: total }, (_, i) => i + 1)
      .filter((n) => !q || String(n).startsWith(q))
      .map((n) => ({
        key: n,
        href: `/kurani/${tab}/${n}${query}`,
        label: `${word} ${n}`,
        arabic: "",
        active: active.tab === tab && active.value === n,
      }));
  }, [tab, search, surahs, query, active.tab, active.value]);

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-3 gap-1 rounded-full border border-line bg-card p-1 text-sm">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setTab(t.key);
              setSearch("");
            }}
            className={`rounded-full py-1.5 transition-colors ${
              tab === t.key ? "bg-emerald-deep font-medium text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        inputMode={tab === "sure" ? "text" : "numeric"}
        placeholder="Kërko..."
        className="mt-3 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-gold"
      />

      <div ref={listRef} className="mt-3 -mr-2 min-h-0 flex-1 overflow-y-auto pr-2">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                onClick={onNavigate}
                data-active={item.active || undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                  item.active ? "bg-emerald-soft text-emerald-deep" : "text-ink/85 hover:bg-card"
                }`}
              >
                {tab === "sure" && <span className="w-6 text-xs text-muted tabular-nums">{item.key}</span>}
                <span className={`flex-1 truncate ${item.active ? "font-medium" : ""}`}>{item.label}</span>
                {item.arabic && <span className="arabic text-base leading-none text-gold/80">{item.arabic}</span>}
              </Link>
            </li>
          ))}
        </ul>
        {items.length === 0 && <p className="py-6 text-center text-sm text-muted">Asnjë rezultat.</p>}
      </div>
    </div>
  );
}

export default function ReaderSidebar({ surahs }: { surahs: SurahMeta[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_NAV_EVENT, show);
    return () => window.removeEventListener(OPEN_NAV_EVENT, show);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-72 shrink-0 border-r border-line py-6 pr-5 lg:block">
        <Panel surahs={surahs} />
      </aside>

      <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 flex h-[80dvh] flex-col rounded-t-3xl border-t border-line bg-paper px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] transition-transform duration-300 ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="mx-auto h-1 w-10 rounded-full bg-line" />
          </div>
          {open && <Panel key={pathname} surahs={surahs} onNavigate={() => setOpen(false)} />}
        </div>
      </div>
    </>
  );
}
