import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { getCategories, getCategoryPage } from "@/lib/hadith";
import HadithTopic from "@/components/HadithTopic";

export const revalidate = 86400;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const categories = await getCategories().catch(() => []);
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = (await getCategories()).find((c) => c.id === id);
  if (!category) return { title: "Hadithe" };
  return pageMeta({
    title: category.title,
    description: `Hadithe për temën "${category.title}" nga Buhariu dhe Muslimi, me shpjegim në shqip.`,
    path: `/hadithe/tema/${id}`,
  });
}

export default async function TopicPage({ params }: Props) {
  const { id } = await params;
  const category = (await getCategories()).find((c) => c.id === id);
  if (!category) notFound();

  const { hadiths, lastPage } = await getCategoryPage(id, 1);
  return <HadithTopic category={category} hadiths={hadiths} lastPage={lastPage} />;
}
