import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { getSurahs } from "@/lib/quran";
import { getCategoryPage } from "@/lib/hadith";
import PageHeading from "@/components/PageHeading";
import Quiz, { type QuizHadith } from "@/components/Quiz";
import Icon3D, { type Icon3DName } from "@/components/Icon3D";
import Link from "next/link";

export const metadata: Metadata = pageMeta({
  title: "Mëso",
  description:
    "Kuiz i shkurtër për suret e Kuranit dhe hadithet e Buhariut e Muslimit.",
  path: "/meso",
});
export const revalidate = 86400;

const HADITH_TOPICS = ["3", "5"];

const TOPICS: { icon: Icon3DName; title: string; text: string }[] = [
  { icon: "book", title: "Suret e Kuranit", text: "Sa ajete ka, ku është shpallur, cila është sipas renditjes" },
  { icon: "scroll", title: "Hadithet", text: "Kush e transmeton: Buhariu, Muslimi apo të dy" },
  { icon: "cap", title: "Raunde të reja", text: "Çdo herë pyetje të ndryshme, me rezultatin më të mirë të ruajtur" },
];

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
      <PageHeading
        arabic="تعلّم"
        title="Mëso duke u pyetur"
        text="Dhjetë pyetje të shkurtra. Çdo përgjigje vjen nga burimet: të dhënat e sureve dhe transmetimet e Buhariut e Muslimit."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <Quiz surahs={surahs} hadiths={hadiths} />

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-[2rem] border border-line bg-card p-6">
            <h2 className="text-xs font-medium tracking-[0.25em] text-gold uppercase">Çfarë pyetet</h2>
            <ul className="mt-5 space-y-4">
              {TOPICS.map((t) => (
                <li key={t.title} className="flex gap-4">
                  <Icon3D name={t.icon} className="size-10" still />
                  <span>
                    <span className="block font-medium">{t.title}</span>
                    <span className="block text-sm text-muted">{t.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] border border-line bg-card p-6">
            <h2 className="text-xs font-medium tracking-[0.25em] text-gold uppercase">Përgatitu</h2>
            <ul className="mt-4 divide-y divide-line">
              {[
                { href: "/kurani", label: "Lista e sureve" },
                { href: "/hadithe", label: "Hadithet sipas temave" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center justify-between py-3 text-sm">
                    {l.label}
                    <span className="text-muted transition-all group-hover:translate-x-1 group-hover:text-gold">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
