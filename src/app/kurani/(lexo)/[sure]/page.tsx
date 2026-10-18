import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { getSurah, getSurahs, readTranslation, revelationLabel } from "@/lib/quran";
import { SaveLastRead } from "@/components/ContinueReading";
import TranslationTabs from "@/components/TranslationTabs";
import AyahList from "@/components/AyahList";
import { MushafPages } from "@/components/MushafPage";
import ReaderNav from "@/components/ReaderNav";

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
  const surah = n ? (await getSurahs().catch(() => [])).find((s) => s.number === n) : undefined;
  if (!surah) return { title: "Kurani" };
  return pageMeta({
    title: `Sureja ${surah.englishName} (${surah.number})`,
    description: `Sureja ${surah.englishName}, ${surah.numberOfAyahs} ajete, e shpallur në ${revelationLabel(surah.revelationType)}. Teksti arab me përkthimin shqip të Nahit, Ahmetit dhe Mehdiut.`,
    path: `/kurani/${surah.number}`,
  });
}

export default async function SurahPage({ params, searchParams }: Props) {
  const number = parseSurah((await params).sure);
  if (!number) notFound();

  const { compare, arabicOnly, selected, active, query } = readTranslation((await searchParams).p);
  const [{ meta, ayahs }, surahs] = await Promise.all([getSurah(number, selected), getSurahs()]);
  const name = (n: number) => surahs.find((s) => s.number === n)?.englishName ?? `Sureja ${n}`;

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

      <TranslationTabs basePath={`/kurani/${number}`} active={active} />

      {arabicOnly ? (
        <MushafPages pages={[...new Set(ayahs.map((a) => a.page))]} surahs={surahs} />
      ) : (
        <AyahList groups={[{ surah: meta, ayahs }]} compare={compare} />
      )}

      <ReaderNav
        label={meta.englishName}
        position={`Sureja ${number} / 114`}
        prev={number > 1 ? { href: `/kurani/${number - 1}${query}`, label: name(number - 1) } : null}
        next={number < 114 ? { href: `/kurani/${number + 1}${query}`, label: name(number + 1) } : null}
      />
    </div>
  );
}
