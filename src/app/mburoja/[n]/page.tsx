import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { getChapter, HISN_TOTAL } from "@/lib/hisn";
import { DuaView } from "@/views/mburoja";

type Props = { params: Promise<{ n: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: HISN_TOTAL }, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chapter = getChapter(Number((await params).n));
  if (!chapter) return { title: "Mburoja e Muslimanit" };
  const first = chapter.items.find((i) => i.translation)?.translation ?? chapter.items[0]?.text ?? "";
  return pageMeta({
    title: `${chapter.title} · Mburoja e Muslimanit`,
    description: first.length > 155 ? `${first.slice(0, 152)}…` : first,
    path: `/mburoja/${chapter.n}`,
  });
}

export default async function DuaPage({ params }: Props) {
  const chapter = getChapter(Number((await params).n));
  if (!chapter) notFound();
  return <DuaView chapter={chapter} />;
}
