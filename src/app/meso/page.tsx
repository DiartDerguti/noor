import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { getSurahs } from "@/lib/quran";
import { getCategoryPage } from "@/lib/hadith";
import PageHeading from "@/components/PageHeading";
import Quiz, { type QuizHadith } from "@/components/Quiz";

export const metadata: Metadata = pageMeta({
  title: "Mëso",
  description:
    "Kuiz i shkurtër për suret e Kuranit dhe hadithet e Buhariut e Muslimit.",
  path: "/meso",
});
export const revalidate = 86400;

const HADITH_TOPICS = ["3", "5"];

export default async function LearnPage() {
  const [surahs, ...pages] = await Promise.all([
    getSurahs(),
    ...HADITH_TOPICS.map((id) =>
      getCategoryPage(id, 1).catch(() => ({ hadiths: [] })),
    ),
  ]);

  const hadiths: QuizHadith[] = pages
    .flatMap((p) => p.hadiths)
    .map(({ id, title, source }) => ({ id, title, source }));

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="max-w-2xl">
        <PageHeading
          arabic="تعلّم"
          title="Mëso duke u pyetur"
          text="Dhjetë pyetje të shkurtra. Çdo përgjigje vjen nga burimet: të dhënat e sureve dhe transmetimet e Buhariut e Muslimit."
        />
        <Quiz surahs={surahs} hadiths={hadiths} />
      </div>
    </div>
  );
}
