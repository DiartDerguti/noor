import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { TOTAL_JUZ, getSection, getSurahs, readTranslation } from "@/lib/quran";
import TranslationTabs from "@/components/TranslationTabs";
import AyahList from "@/components/AyahList";
import { MushafPages } from "@/components/MushafPage";
import ReaderNav from "@/components/ReaderNav";
import SectionHeader from "@/components/SectionHeader";

type Props = {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ p?: string }>;
};

function parse(value: string) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= TOTAL_JUZ ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parse((await params).n);
  if (!n) return { title: "Kurani" };
  return pageMeta({
    title: `Xhuzi ${n}`,
    description: `Xhuzi ${n} nga ${TOTAL_JUZ} i Kuranit, me tekstin arab dhe përkthimin shqip.`,
    path: `/kurani/xhuz/${n}`,
  });
}

export default async function JuzReader({ params, searchParams }: Props) {
  const n = parse((await params).n);
  if (!n) notFound();

  const { compare, arabicOnly, selected, active, query } = readTranslation((await searchParams).p);
  const [groups, surahs] = await Promise.all([getSection("juz", n, selected), getSurahs()]);
  const first = groups[0];
  const last = groups[groups.length - 1];
  const range = `${first.surah.englishName} ${first.ayahs[0].numberInSurah} – ${last.surah.englishName} ${last.ayahs[last.ayahs.length - 1].numberInSurah}`;

  return (
    <div className="mx-auto max-w-3xl px-4">
      <SectionHeader eyebrow={`Xhuzi ${n} nga ${TOTAL_JUZ}`} title={`Xhuzi ${n}`} subtitle={range} />
      <TranslationTabs basePath={`/kurani/xhuz/${n}`} active={active} />
      {arabicOnly ? (
        <MushafPages pages={[...new Set(groups.flatMap((g) => g.ayahs.map((a) => a.page)))]} surahs={surahs} />
      ) : (
        <AyahList groups={groups} compare={compare} showSurahHeaders />
      )}
      <ReaderNav
        label={`Xhuzi ${n}`}
        position={range}
        prev={n > 1 ? { href: `/kurani/xhuz/${n - 1}${query}`, label: `Xhuzi ${n - 1}` } : null}
        next={n < TOTAL_JUZ ? { href: `/kurani/xhuz/${n + 1}${query}`, label: `Xhuzi ${n + 1}` } : null}
      />
    </div>
  );
}
