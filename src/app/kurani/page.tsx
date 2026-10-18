import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { getSurahs } from "@/lib/quran";
import SurahList from "@/components/SurahList";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = pageMeta({
  title: "Kurani në shqip",
  description: "Të 114 suret e Kuranit me tekstin arab dhe përkthimet shqip të Hasan Efendi Nahit, Sherif Ahmetit dhe Feti Mehdiut.",
  path: "/kurani",
});

export default async function QuranPage() {
  const surahs = await getSurahs();

  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeading
        arabic="القرآن الكريم"
        title="Kurani Famëlartë"
        text="Zgjidh një sure. Teksti arab shfaqet bashkë me përkthimin e Hasan Efendi Nahit, ose me Sherif Ahmetin dhe Feti Mehdiun."
      />
      <SurahList surahs={surahs} />
    </div>
  );
}
