import Link from "next/link";
import { DEFAULT_TRANSLATION, ayahOfTheDay, getAyah, translationName } from "@/lib/quran";
import ContinueReading from "@/components/ContinueReading";

export const revalidate = 3600;

const SECTIONS = [
  {
    href: "/kurani",
    title: "Kurani",
    arabic: "القرآن",
    text: "Të 114 suret me tekstin arab dhe tri përkthimet shqip: Nahi, Ahmeti dhe Mehdiu.",
  },
  {
    href: "/hadithe",
    title: "Hadithe",
    arabic: "الحديث",
    text: "Vetëm nga Sahihu i Buhariut dhe i Muslimit, me shpjegim dhe mësimet që nxirren.",
  },
  {
    href: "/meso",
    title: "Mëso",
    arabic: "تعلّم",
    text: "Pyetje të shkurtra për suret dhe hadithet, për ta përforcuar atë që di.",
  },
];

async function AyahOfTheDay() {
  const number = ayahOfTheDay();
  const ayah = await getAyah(number, DEFAULT_TRANSLATION).catch(() => null);
  if (!ayah) return null;

  return (
    <section className="rounded-3xl border border-line bg-card p-6 sm:p-10">
      <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">Ajeti i ditës</p>
      <p className="arabic mt-6 text-3xl text-ink sm:text-4xl">{ayah.arabic}</p>
      <p className="mt-6 font-serif text-lg leading-relaxed text-ink/90 sm:text-xl">{ayah.translation}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>
          {ayah.surah.englishName} {ayah.surah.number}:{ayah.numberInSurah} · {translationName(DEFAULT_TRANSLATION)}
        </span>
        <Link
          href={`/kurani/${ayah.surah.number}#ajeti-${ayah.numberInSurah}`}
          className="font-medium text-emerald-deep underline-offset-4 hover:underline"
        >
          Lexo suren →
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="pattern relative -mx-4 mb-10 overflow-hidden px-4 pt-16 pb-14 text-center sm:pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paper/40 to-paper" />
        <div className="relative">
          <p className="arabic text-4xl text-gold sm:text-5xl">السلام عليكم</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Esselamu alejkum.
            <span className="block text-emerald-deep">Mëso qartë atë që e di.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted sm:text-lg">
            Kurani në shqip dhe hadithe të sakta, të paraqitura thjesht. Vetëm përkthime të njohura dhe burime zyrtare.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/kurani"
              className="rounded-full bg-emerald-deep px-6 py-3 font-medium text-paper transition-opacity hover:opacity-90"
            >
              Hap Kuranin
            </Link>
            <Link
              href="/hadithe"
              className="rounded-full border border-line bg-card px-6 py-3 font-medium transition-colors hover:border-gold"
            >
              Lexo hadithe
            </Link>
          </div>
          <ContinueReading />
        </div>
      </section>

      <AyahOfTheDay />

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-3xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-gold"
          >
            <p className="arabic text-2xl text-gold">{s.arabic}</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            <p className="mt-4 text-sm font-medium text-emerald-deep">
              Hyr <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
