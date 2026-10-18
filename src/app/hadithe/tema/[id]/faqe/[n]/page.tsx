import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { getCategories, getCategoryPage } from "@/lib/hadith";
import HadithTopic from "@/components/HadithTopic";

export const revalidate = 86400;

type Props = { params: Promise<{ id: string; n: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, n } = await params;
  const category = (await getCategories()).find((c) => c.id === id);
  if (!category) return { title: "Hadithe" };
  return pageMeta({
    title: `${category.title} · Faqja ${n}`,
    description: `Hadithe për temën "${category.title}" nga Buhariu dhe Muslimi, faqja ${n}.`,
    path: `/hadithe/tema/${id}/faqe/${n}`,
  });
}

export default async function TopicPageN({ params }: Props) {
  const { id, n } = await params;
  const page = Number(n);
  if (page === 1) redirect(`/hadithe/tema/${id}`);

  const category = (await getCategories()).find((c) => c.id === id);
  if (!category || !Number.isInteger(page) || page < 1) notFound();

  const { hadiths, lastPage } = await getCategoryPage(id, page);
  if (page > lastPage) notFound();

  return <HadithTopic category={category} hadiths={hadiths} page={page} lastPage={lastPage} />;
}
