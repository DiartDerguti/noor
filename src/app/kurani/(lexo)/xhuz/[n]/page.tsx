import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { TOTAL_JUZ } from "@/lib/quran";
import { SectionView, loadSection, parseSection } from "@/views/quran";

export const revalidate = 604800;

type Props = { params: Promise<{ n: string }> };

const parse = (value: string) => parseSection("xhuz", value);

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parse((await params).n);
  if (!n) return { title: "Kurani" };
  return pageMeta({
    title: `Xhuzi ${n}`,
    description: `Xhuzi ${n} nga ${TOTAL_JUZ} e Kuranit, me tekstin arab dhe përkthimin shqip.`,
    path: `/kurani/xhuz/${n}`,
  });
}

export default async function Reader({ params }: Props) {
  const n = parse((await params).n);
  if (!n) notFound();
  return <SectionView {...await loadSection("xhuz", n, false)} />;
}
