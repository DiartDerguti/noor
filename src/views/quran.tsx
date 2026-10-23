import { TOTAL_JUZ, TOTAL_PAGES, TRANSLATIONS, getSection, getSurah, getSurahs, revelationLabel, type SurahGroup, type SurahMeta } from "@/lib/quran";
import { getMushafPages, type MushafPageData } from "@/lib/mushaf";
import { SaveLastRead } from "@/components/ContinueReading";
import TranslationTabs from "@/components/TranslationTabs";
import AyahList from "@/components/AyahList";
import ReaderNav from "@/components/ReaderNav";
import SectionHeader from "@/components/SectionHeader";
import { MushafPages } from "@/components/MushafPage";
import ReaderSidebar from "@/components/ReaderSidebar";
import { Suspense } from "react";

// Each reader view has a loader that works on the server and, from the same local data, in the offline app.

export function ReaderFrame({ surahs, children }: { surahs: SurahMeta[]; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 lg:px-4">
      <Suspense>
        <ReaderSidebar surahs={surahs} />
      </Suspense>
      <div className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</div>
    </div>
  );
}

export function parseSurah(value: string) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : null;
}

export function parseSection(kind: "faqe" | "xhuz", value: string) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= (kind === "faqe" ? TOTAL_PAGES : TOTAL_JUZ) ? n : null;
}

const pagesOf = (groups: SurahGroup[]) => [...new Set(groups.flatMap((g) => g.ayahs.map((a) => a.page)))];

export async function loadSurah(number: number, mushaf: boolean) {
  const [{ meta, ayahs }, surahs] = await Promise.all([
    getSurah(number, mushaf ? [] : TRANSLATIONS.map((t) => t.id)),
    getSurahs(),
  ]);
  const pages = mushaf ? await getMushafPages(pagesOf([{ surah: meta, ayahs }])) : [];
  return { number, mushaf, meta, ayahs, surahs, pages };
}

export type SurahData = Awaited<ReturnType<typeof loadSurah>>;

export function SurahView({ number, mushaf, meta, ayahs, surahs, pages }: SurahData) {
  const name = (n: number) => surahs.find((s) => s.number === n)?.englishName ?? `Sureja ${n}`;
  const suffix = mushaf ? "/mushaf" : "";

  return (
    <div className="mx-auto max-w-3xl px-4">
      {!mushaf && <SaveLastRead number={number} name={meta.englishName} />}

      <header className="pattern relative -mx-4 overflow-hidden px-4 pt-12 pb-10 text-center sm:rounded-b-[2.5rem]">
        <div className="from-paper/30 to-paper absolute inset-0 bg-gradient-to-b" />
        <div className="relative">
          <h1 className="arabic text-emerald-deep py-2 text-5xl leading-[1.9]">{meta.name}</h1>
          <p className="font-serif text-2xl font-semibold">
            {meta.englishName} <span className="text-muted font-normal">({meta.albanianName})</span>
          </p>
          <p className="text-muted mt-2 text-sm">
            Sureja {meta.number} · {revelationLabel(meta.revelationType)} · {meta.numberOfAyahs} ajete
          </p>
        </div>
      </header>

      <TranslationTabs
        title={`${meta.englishName} (${meta.albanianName})`}
        subtitle={mushaf ? `Sureja ${number} · Mushaf` : `Sureja ${number} · ${meta.numberOfAyahs} ajete`}
        basePath={`/kurani/${number}`}
        mushafHref={`/kurani/${number}/mushaf`}
        mushaf={mushaf}
      />

      {mushaf ? <MushafPages pages={pages} surahs={surahs} /> : <AyahList groups={[{ surah: meta, ayahs }]} />}

      <ReaderNav
        label={meta.englishName}
        position={`Sureja ${number} / 114`}
        prev={number > 1 ? { href: `/kurani/${number - 1}${suffix}`, label: name(number - 1) } : null}
        next={number < 114 ? { href: `/kurani/${number + 1}${suffix}`, label: name(number + 1) } : null}
      />
    </div>
  );
}

export async function loadSection(kind: "faqe" | "xhuz", n: number, mushaf: boolean) {
  const [groups, surahs] = await Promise.all([
    getSection(kind === "faqe" ? "page" : "juz", n, mushaf ? [] : TRANSLATIONS.map((t) => t.id)),
    getSurahs(),
  ]);
  const pages: MushafPageData[] = mushaf ? await getMushafPages(pagesOf(groups)) : [];
  return { kind, n, mushaf, groups, surahs, pages };
}

export type SectionData = Awaited<ReturnType<typeof loadSection>>;

export function SectionView({ kind, n, mushaf, groups, surahs, pages }: SectionData) {
  const word = kind === "faqe" ? "Faqja" : "Xhuzi";
  const total = kind === "faqe" ? TOTAL_PAGES : TOTAL_JUZ;
  const base = `/kurani/${kind}`;
  const suffix = mushaf ? "/mushaf" : "";
  const first = groups[0];
  const last = groups[groups.length - 1];
  const range =
    kind === "faqe"
      ? groups.map((g) => `${g.surah.englishName} ${g.ayahs[0].numberInSurah}–${g.ayahs[g.ayahs.length - 1].numberInSurah}`).join(", ")
      : `${first.surah.englishName} ${first.ayahs[0].numberInSurah} – ${last.surah.englishName} ${last.ayahs[last.ayahs.length - 1].numberInSurah}`;

  return (
    <div className="mx-auto max-w-3xl px-4">
      <SectionHeader eyebrow={`${word} ${n} nga ${total}`} title={`${word} ${n}`} subtitle={range} />
      <TranslationTabs
        title={`${word} ${n}`}
        subtitle={range}
        basePath={`${base}/${n}`}
        mushafHref={`${base}/${n}/mushaf`}
        mushaf={mushaf}
      />
      {mushaf ? <MushafPages pages={pages} surahs={surahs} /> : <AyahList groups={groups} showSurahHeaders />}
      <ReaderNav
        label={`${word} ${n}`}
        position={range}
        prev={n > 1 ? { href: `${base}/${n - 1}${suffix}`, label: `${word} ${n - 1}` } : null}
        next={n < total ? { href: `${base}/${n + 1}${suffix}`, label: `${word} ${n + 1}` } : null}
      />
    </div>
  );
}
