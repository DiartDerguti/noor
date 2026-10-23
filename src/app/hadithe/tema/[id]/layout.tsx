import { notFound } from "next/navigation";
import { getCategories } from "@/lib/hadith";
import { TopicFrame } from "@/views/hadith";

export default async function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = (await getCategories()).find((c) => c.id === id);
  if (!category) notFound();
  return <TopicFrame category={category}>{children}</TopicFrame>;
}
