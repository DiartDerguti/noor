"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { COMPARE, DEFAULT_TRANSLATION, TRANSLATIONS } from "@/lib/quran";
import { OPEN_NAV_EVENT } from "./ReaderSidebar";

export const TRANSLATION_KEY = "noor:tr";
const NAV_ID = "perkthimi";
const listeners = new Set<() => void>();

function read() {
  try {
    return localStorage.getItem(TRANSLATION_KEY) ?? DEFAULT_TRANSLATION;
  } catch {
    return DEFAULT_TRANSLATION;
  }
}

function save(value: string) {
  try {
    localStorage.setItem(TRANSLATION_KEY, value);
  } catch {}
  document.documentElement.dataset.tr = value;
  listeners.forEach((l) => l());
}

function subscribeScroll(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  window.addEventListener("resize", listener);
  return () => {
    window.removeEventListener("scroll", listener);
    window.removeEventListener("resize", listener);
  };
}

function pastTabs() {
  const el = document.getElementById(NAV_ID);
  return el ? el.getBoundingClientRect().bottom < 64 : false;
}

const TABS = [
  ...TRANSLATIONS.map((t) => ({
    key: t.id as string,
    label: t.name,
    short: t.name.split(" ").pop()!,
  })),
  { key: COMPARE, label: "Krahaso", short: "Krahaso" },
];

export default function TranslationTabs({
  basePath,
  mushafHref,
  mushaf = false,
  title,
  subtitle,
}: {
  basePath: string;
  mushafHref: string;
  mushaf?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const selected = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => DEFAULT_TRANSLATION,
  );
  const scrolled = useSyncExternalStore(subscribeScroll, pastTabs, () => false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const current = mushaf
    ? "Arabisht"
    : (TABS.find((t) => t.key === selected)?.short ?? "Nahi");
  const visible = scrolled || open;

  const item = (active: boolean) =>
    `flex-1 rounded-xl px-3 py-2 text-center whitespace-nowrap transition-colors sm:rounded-full sm:py-1.5 ${
      active ? "bg-emerald-deep text-paper" : "text-muted hover:text-ink"
    }`;

  const option = (active: boolean) =>
    `flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
      active ? "bg-emerald-soft text-emerald-deep" : "hover:bg-paper/70"
    }`;

  return (
    <>
      <nav
        id={NAV_ID}
        aria-label="Përkthimi"
        className="bg-paper/90 -mx-4 mb-6 px-4 py-3 backdrop-blur sm:sticky sm:top-16 sm:z-20"
      >
        <div className="border-line bg-card grid grid-cols-2 gap-1 rounded-2xl border p-1 text-sm sm:flex sm:rounded-full [&>*:last-child]:col-span-2">
          {TABS.map((t) =>
            mushaf ? (
              <Link
                key={t.key}
                href={basePath}
                onClick={() => save(t.key)}
                className={item(false)}
              >
                {t.label}
              </Link>
            ) : (
              <button
                key={t.key}
                type="button"
                onClick={() => save(t.key)}
                className={item(selected === t.key)}
              >
                {t.label}
              </button>
            ),
          )}
          <Link href={mushafHref} className={item(mushaf)}>
            Arabisht
          </Link>
        </div>
      </nav>

      <div
        ref={menuRef}
        className={`border-line/70 bg-paper/90 fixed inset-x-0 top-16 z-30 border-b backdrop-blur-md transition-all duration-300 lg:hidden ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="relative flex items-center gap-2 px-4 py-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_NAV_EVENT))}
            aria-label="Hap listën e sureve"
            className="border-gold/50 bg-card flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="text-gold size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
            Lista
          </button>

          <div className="min-w-0 flex-1 text-center leading-tight">
            {title && (
              <p className="truncate font-serif text-[15px] font-semibold">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-muted truncate text-[11px]">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Zgjidh përkthimin"
            className="border-gold/50 bg-card flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="text-gold size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
              <circle cx="16" cy="6" r="2" />
              <circle cx="10" cy="12" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
            {current}
          </button>
        </div>

        {open && (
          <div className="border-line bg-card absolute top-full right-4 mt-2 w-56 rounded-2xl border p-1.5 shadow-2xl shadow-black/50">
            {TABS.map((t) => {
              const active = !mushaf && selected === t.key;
              return mushaf ? (
                <Link
                  key={t.key}
                  href={basePath}
                  onClick={() => save(t.key)}
                  className={option(false)}
                >
                  {t.label}
                </Link>
              ) : (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    save(t.key);
                    setOpen(false);
                  }}
                  className={option(active)}
                >
                  {t.label}
                  {active && <span aria-hidden>✓</span>}
                </button>
              );
            })}
            <Link
              href={mushafHref}
              onClick={() => setOpen(false)}
              className={option(mushaf)}
            >
              Arabisht
              {mushaf && <span aria-hidden>✓</span>}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
