import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BASMALA,
  DEFAULT_TRANSLATION,
  TRANSLATIONS,
  getSurah,
  isTranslationId,
  revelationLabel,
  translationName,
  type TranslationId,
} from "@/lib/quran";
import { SaveLastRead } from "@/components/ContinueReading";

type Props = {
  params: Promise<{ sure: string }>;
  searchParams: Promise<{ p?: string }>;
};

function parseSurah(value: string) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parseSurah((await params).sure);
  return { title: n ? `Sureja ${n}` : "Kurani" };
}

export default async function SurahPage({ params, searchParams }: Props) {
  const number = parseSurah((await params).sure);
  if (!number) notFound();

  const { p } = await searchParams;
  const compare = p === "te-gjitha";
  const selected: TranslationId[] = compare
    ? TRANSLATIONS.map((t) => t.id)
    : [isTranslationId(p) ? p : DEFAULT_TRANSLATION];

  const { meta, ayahs } = await getSurah(number, selected);
  const tabs = [...TRANSLATIONS.map((t) => ({ key: t.id as string, label: t.name })), { key: "te-gjitha", label: "Krahaso" }];
  const activeTab = compare ? "te-gjitha" : selected[0];

  return (
    <div className="mx-auto max-w-3xl px-4">
      <SaveLastRead number={number} name={meta.englishName} />

      <header className="pattern relative -mx-4 overflow-hidden px-4 pt-12 pb-10 text-center sm:rounded-b-[2.5rem]">
        <div className="absolute inset-0 bg-gradient-to-b from-paper/30 to-paper" />
        <div className="relative">
          <h1 className="arabic py-2 text-5xl leading-[1.9] text-emerald-deep">{meta.name}</h1>
          <p className="font-serif text-2xl font-semibold">{meta.englishName}</p>
          <p className="mt-2 text-sm text-muted">
            Sureja {meta.number} · {revelationLabel(meta.revelationType)} · {meta.numberOfAyahs} ajete
          </p>
        </div>
      </header>

      <nav aria-label="Përkthimi" className="sticky top-16 z-20 -mx-4 mb-6 bg-paper/90 px-4 py-3 backdrop-blur">
        <div className="flex gap-1 overflow-x-auto rounded-full border border-line bg-card p-1 text-sm">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.key === DEFAULT_TRANSLATION ? `/kurani/${number}` : `/kurani/${number}?p=${t.key}`}
              scroll={false}
              className={`flex-1 rounded-full px-3 py-1.5 text-center whitespace-nowrap transition-colors ${
                activeTab === t.key ? "bg-emerald-deep text-paper" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </nav>

      {number !== 1 && number !== 9 && <p className="arabic mb-8 text-center text-3xl text-gold">{BASMALA}</p>}

      <ol className="divide-y divide-line">
        {ayahs.map((a) => (
          <li key={a.number} id={`ajeti-${a.numberInSurah}`} className="scroll-mt-36 py-8">
            <div className="flex items-center gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-soft text-xs font-medium text-gold tabular-nums">
                {a.numberInSurah}
              </span>
              <p className="arabic flex-1 text-[1.75rem] sm:text-3xl">{a.arabic}</p>
            </div>
            <div className="mt-4 space-y-4 sm:pl-12">
              {a.translations.map((t) => (
                <div key={t.id}>
                  {compare && <p className="mb-1 text-xs font-medium tracking-wide text-gold uppercase">{translationName(t.id)}</p>}
                  <p className="font-serif text-lg leading-relaxed text-ink/90">{t.text}</p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid grid-cols-2 gap-3">
        {number > 1 ? (
          <Link href={`/kurani/${number - 1}`} className="rounded-2xl border border-line bg-card p-4 hover:border-gold">
            <span className="text-xs text-muted">← E mëparshmja</span>
            <span className="block font-medium">Sureja {number - 1}</span>
          </Link>
        ) : (
          <span />
        )}
        {number < 114 && (
          <Link href={`/kurani/${number + 1}`} className="rounded-2xl border border-line bg-card p-4 text-right hover:border-gold">
            <span className="text-xs text-muted">Pasardhësja →</span>
            <span className="block font-medium">Sureja {number + 1}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
