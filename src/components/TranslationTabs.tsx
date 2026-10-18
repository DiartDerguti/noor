"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { COMPARE, DEFAULT_TRANSLATION, TRANSLATIONS } from "@/lib/quran";

export const TRANSLATION_KEY = "noor:tr";
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

const TABS = [
  ...TRANSLATIONS.map((t) => ({ key: t.id as string, label: t.name })),
  { key: COMPARE, label: "Krahaso" },
];

export default function TranslationTabs({
  basePath,
  mushafHref,
  mushaf = false,
}: {
  basePath: string;
  mushafHref: string;
  mushaf?: boolean;
}) {
  const selected = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => DEFAULT_TRANSLATION,
  );

  const item = (active: boolean) =>
    `flex-1 rounded-xl px-3 py-2 text-center whitespace-nowrap transition-colors sm:rounded-full sm:py-1.5 ${
      active ? "bg-emerald-deep text-paper" : "text-muted hover:text-ink"
    }`;

  return (
    <nav aria-label="Përkthimi" className="sticky top-16 z-20 -mx-4 mb-6 bg-paper/90 px-4 py-3 backdrop-blur">
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-card p-1 text-sm sm:flex sm:rounded-full [&>*:last-child]:col-span-2">
        {TABS.map((t) =>
          mushaf ? (
            <Link key={t.key} href={basePath} onClick={() => save(t.key)} className={item(false)}>
              {t.label}
            </Link>
          ) : (
            <button key={t.key} type="button" onClick={() => save(t.key)} className={item(selected === t.key)}>
              {t.label}
            </button>
          ),
        )}
        <Link href={mushafHref} className={item(mushaf)}>
          Arabisht
        </Link>
      </div>
    </nav>
  );
}
