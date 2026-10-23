import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { getSurahs } from "@/lib/quran";
import SurahList from "@/components/SurahList";

export const metadata: Metadata = pageMeta({
  title: "Kurani në shqip",
  description: "Të 114 suret e Kuranit me tekstin arab dhe përkthimet shqip të Hasan Efendi Nahit, Sherif Ahmetit dhe Feti Mehdiut.",
  path: "/kurani",
});

export default async function QuranPage() {
  const surahs = await getSurahs();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10">
      <h1 className="sr-only">Kurani Famëlartë</h1>
      <SurahList surahs={surahs} />
    </div>
  );
}
