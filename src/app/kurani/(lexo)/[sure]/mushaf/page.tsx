import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { getSurahs } from "@/lib/quran";
import { SurahView, loadSurah, parseSurah } from "@/views/quran";

export const revalidate = 604800;

type Props = { params: Promise<{ sure: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parseSurah((await params).sure);
  const surah = n
    ? (await getSurahs().catch(() => [])).find((s) => s.number === n)
    : undefined;
  if (!surah) return { title: "Kurani" };
  return pageMeta({
    title: `Sureja ${surah.englishName} në Mushaf`,
    description: `Sureja ${surah.englishName} në arabisht, faqe për faqe si në Mushafin e Medinës.`,
    path: `/kurani/${surah.number}/mushaf`,
  });
}

export default async function SurahPage({ params }: Props) {
  const number = parseSurah((await params).sure);
  if (!number) notFound();
  return <SurahView {...await loadSurah(number, true)} />;
}
