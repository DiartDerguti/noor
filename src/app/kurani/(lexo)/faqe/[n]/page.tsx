import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { TOTAL_PAGES, TRANSLATIONS, getSection } from "@/lib/quran";
import TranslationTabs from "@/components/TranslationTabs";
import AyahList from "@/components/AyahList";
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
    title: `Faqja ${n} e Mushafit`,
    description: `Faqja ${n} nga ${TOTAL_PAGES} e Kuranit, me tekstin arab dhe përkthimin shqip.`,
    path: `/kurani/faqe/${n}`,
  });
}

export default async function Reader({ params }: Props) {
  const n = parse((await params).n);
  if (!n) notFound();

  const groups = await getSection(
    "page",
    n,
    TRANSLATIONS.map((t) => t.id),
  );
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
        title={`Faqja ${n}`}
        subtitle={range}
        basePath={`/kurani/faqe/${n}`}
        mushafHref={`/kurani/faqe/${n}/mushaf`}
      />
      <AyahList groups={groups} showSurahHeaders />
      <ReaderNav
        label={`Faqja ${n}`}
        position={range}
        prev={
          n > 1
            ? { href: `/kurani/faqe/${n - 1}`, label: `Faqja ${n - 1}` }
            : null
        }
        next={
          n < TOTAL_PAGES
            ? { href: `/kurani/faqe/${n + 1}`, label: `Faqja ${n + 1}` }
            : null
        }
      />
    </div>
  );
}
