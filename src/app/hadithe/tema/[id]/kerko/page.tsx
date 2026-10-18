import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCategories, searchCategory } from "@/lib/hadith";
import HadithTopic from "@/components/HadithTopic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = { title: "Kërko", robots: { index: false } };

export default async function TopicSearch({ params, searchParams }: Props) {
  const { id } = await params;
  const query = ((await searchParams).q ?? "").trim();
  if (!query) redirect(`/hadithe/tema/${id}`);

  const category = (await getCategories()).find((c) => c.id === id);
  if (!category) notFound();

  const { hadiths, matches } = await searchCategory(id, query);
  return <HadithTopic category={category} hadiths={hadiths} query={query} matches={matches} />;
}
