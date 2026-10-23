import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { TOTAL_PAGES } from "@/lib/quran";
import { SectionView, loadSection, parseSection } from "@/views/quran";

export const revalidate = 604800;

type Props = { params: Promise<{ n: string }> };

const parse = (value: string) => parseSection("faqe", value);

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
  return <SectionView {...await loadSection("faqe", n, false)} />;
}
