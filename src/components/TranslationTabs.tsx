import Link from "next/link";
import { ARABIC_ONLY, COMPARE, DEFAULT_TRANSLATION, TRANSLATIONS } from "@/lib/quran";

const TABS = [
  ...TRANSLATIONS.map((t) => ({ key: t.id as string, label: t.name })),
  { key: COMPARE, label: "Krahaso" },
  { key: ARABIC_ONLY, label: "Arabisht" },
];

export default function TranslationTabs({ basePath, active }: { basePath: string; active: string }) {
  return (
    <nav aria-label="Përkthimi" className="sticky top-16 z-20 -mx-4 mb-6 bg-paper/90 px-4 py-3 backdrop-blur">
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-card p-1 text-sm sm:flex sm:rounded-full [&>*:last-child]:col-span-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === DEFAULT_TRANSLATION ? basePath : `${basePath}?p=${t.key}`}
            scroll={false}
            className={`flex-1 rounded-xl px-3 py-2 text-center whitespace-nowrap transition-colors sm:rounded-full sm:py-1.5 ${
              active === t.key ? "bg-emerald-deep text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
