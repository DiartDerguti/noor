import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/site";
import { SOURCE_LABEL, getAllHadithIds, getHadith } from "@/lib/hadith";
import { HadithView } from "@/views/hadith";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 86400;

export async function generateStaticParams() {
  return (await getAllHadithIds()).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hadith = await getHadith((await params).id);
  if (!hadith) return { title: "Hadith" };
  const title = hadith.title.replace(/["“”]/g, "");
  return pageMeta({
    title: title.length > 60 ? `${title.slice(0, 57).trimEnd()}...` : title,
    description: `${SOURCE_LABEL[hadith.source]}. Lexo hadithin në shqip, shpjegimin dhe mësimet që nxirren prej tij.`,
    path: `/hadithe/${hadith.id}`,
  });
}

export default async function HadithPage({ params }: Props) {
  const hadith = await getHadith((await params).id);
  if (!hadith) notFound();
  return <HadithView hadith={hadith} />;
}
