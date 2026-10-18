import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { TOTAL_PAGES, getSection, getSurahs } from "@/lib/quran";
import TranslationTabs from "@/components/TranslationTabs";
import { MushafPages } from "@/components/MushafPage";
import ReaderNav from "@/components/ReaderNav";
import SectionHeader from "@/components/SectionHeader";

export const revalidate = 604800;

type Props = { params: Promise<{ n: string }> };

function parse(value: string) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= TOTAL_PAGES ? n : null;
}

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parse((await params).n);
  if (!n) return { title: "Kurani" };
  return pageMeta({
    title: `Faqja ${n} e Mushafit në Mushaf`,
    description: `Faqja ${n} nga ${TOTAL_PAGES} e Kuranit në arabisht, si në Mushafin e Medinës.`,
    path: `/kurani/faqe/${n}/mushaf`,
  });
}

export default async function Reader({ params }: Props) {
  const n = parse((await params).n);
  if (!n) notFound();

  const [groups, surahs] = await Promise.all([
    getSection("page", n, []),
    getSurahs(),
  ]);
  const range = groups
    .map(
      (g) =>
        `${g.surah.englishName} ${g.ayahs[0].numberInSurah}–${g.ayahs[g.ayahs.length - 1].numberInSurah}`,
    )
    .join(", ");

  return (
    <div className="mx-auto max-w-3xl px-4">
      <SectionHeader
        eyebrow={`Faqja ${n} nga ${TOTAL_PAGES}`}
        title={`Faqja ${n}`}
        subtitle={range}
      />
      <TranslationTabs
        basePath={`/kurani/faqe/${n}`}
        mushafHref={`/kurani/faqe/${n}/mushaf`}
        mushaf
      />
      <MushafPages
        pages={[...new Set(groups.flatMap((g) => g.ayahs.map((a) => a.page)))]}
        surahs={surahs}
      />
      <ReaderNav
        label={`Faqja ${n}`}
        position={range}
        prev={
          n > 1
            ? { href: `/kurani/faqe/${n - 1}/mushaf`, label: `Faqja ${n - 1}` }
            : null
        }
        next={
          n < TOTAL_PAGES
            ? { href: `/kurani/faqe/${n + 1}/mushaf`, label: `Faqja ${n + 1}` }
            : null
        }
      />
    </div>
  );
}
