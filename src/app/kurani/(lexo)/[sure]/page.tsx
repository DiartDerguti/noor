import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { getSurahs, revelationLabel } from "@/lib/quran";
import { SurahView, loadSurah, parseSurah } from "@/views/quran";

export const revalidate = 604800;

type Props = { params: Promise<{ sure: string }> };

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ sure: String(i + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parseSurah((await params).sure);
  const surah = n
    ? (await getSurahs().catch(() => [])).find((s) => s.number === n)
    : undefined;
  if (!surah) return { title: "Kurani" };
  return pageMeta({
    title: `Sureja ${surah.englishName} (${surah.number})`,
    description: `Sureja ${surah.englishName}, ${surah.numberOfAyahs} ajete, e shpallur në ${revelationLabel(surah.revelationType)}. Teksti arab me përkthimin shqip të Nahit, Ahmetit dhe Mehdiut.`,
    path: `/kurani/${surah.number}`,
  });
}

export default async function SurahPage({ params }: Props) {
  const number = parseSurah((await params).sure);
  if (!number) notFound();
  return <SurahView {...await loadSurah(number, false)} />;
}
