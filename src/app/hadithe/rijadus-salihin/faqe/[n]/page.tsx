import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { getRiyadPage, RIYAD_PAGES, riyadPath } from "@/lib/riyad";
import RiyadList from "@/components/RiyadList";

type Props = { params: Promise<{ n: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: RIYAD_PAGES }, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return pageMeta({
    title: `Rijadus Salihin · Faqja ${n}`,
    description: `Hadithe nga Rijadus Salihin i Imam Neveviut në shqip, faqja ${n} nga ${RIYAD_PAGES}.`,
    path: riyadPath(Number(n)),
  });
}

export default async function RiyadPageN({ params }: Props) {
  const page = Number((await params).n);
  if (page === 1) redirect(riyadPath());
  if (!Number.isInteger(page) || page < 1 || page > RIYAD_PAGES) notFound();
  return <RiyadList hadiths={getRiyadPage(page)} page={page} />;
}
