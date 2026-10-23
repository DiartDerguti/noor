import Link from "next/link";
import { DEFAULT_TRANSLATION, ayahOfTheDay, getAyah, translationName } from "@/lib/quran";
import HeroBanner from "@/components/HeroBanner";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { getHijriToday, getUpcomingEvents } from "@/lib/hijri";
import { DEFAULT_CITY, getTimings } from "@/lib/prayer";
import Icon3D, { type Icon3DName } from "@/components/Icon3D";
import PrayerTimes from "@/components/PrayerTimes";
import RamadanCountdown from "@/components/RamadanCountdown";
import ImportantDates from "@/components/ImportantDates";
import { SOURCE_LABEL, getHadithOfTheDay, hadithHeadline } from "@/lib/hadith";
import { audioUrl, getDuaOfTheDay } from "@/lib/hisn";
import DuaAudio from "@/components/DuaAudio";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "sq",
};

export const revalidate = 3600;

const SECTIONS: { href: string; icon: Icon3DName; title: string; arabic: string; text: string }[] = [
  { href: "/kurani", icon: "book", title: "Kurani", arabic: "القرآن", text: "114 sure, tre përkthime shqip" },
  { href: "/hadithe", icon: "scroll", title: "Hadithe", arabic: "الحديث", text: "Buhariu dhe Muslimi, me shpjegim" },
  { href: "/hadithe/rijadus-salihin", icon: "scroll", title: "Rijadus Salihin", arabic: "رياض الصالحين", text: "Koleksioni i Imam Neveviut" },
  { href: "/mburoja", icon: "shield", title: "Mburoja e Muslimanit", arabic: "حصن المسلم", text: "Lutjet e përditshme me audio" },
  { href: "/emrat", icon: "star", title: "99 Emrat e Allahut", arabic: "الأسماء الحسنى", text: "Kuptimet dhe karta për t'i mësuar" },
  { href: "/takvimi", icon: "mosque", title: "Takvimi", arabic: "المواقيت", text: "Kohët e namazit për qytetin tënd" },
  { href: "/meso", icon: "cap", title: "Mëso", arabic: "تعلّم", text: "Kuiz për suret dhe hadithet" },
  { href: "/rreth", icon: "seal", title: "Burimet", arabic: "المصادر", text: "Nga vjen çdo tekst" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">{children}</p>;
}

async function AyahOfTheDay() {
  const ayah = await getAyah(ayahOfTheDay(), DEFAULT_TRANSLATION).catch(() => null);
  if (!ayah) return null;

  return (
    <section className="relative mx-auto max-w-4xl px-4 text-center">
      <Eyebrow>Ajeti i ditës</Eyebrow>
      <p className="quran mt-8 text-[2rem] leading-[2.3] text-ink sm:text-[2.6rem]">{ayah.arabic}</p>
      <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-relaxed text-ink/85 sm:text-2xl">
        {ayah.translation}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <span>
          {ayah.surah.englishName} {ayah.surah.number}:{ayah.numberInSurah} · {translationName(DEFAULT_TRANSLATION)}
        </span>
        <Link
          href={`/kurani/${ayah.surah.number}#ajeti-${ayah.numberInSurah}`}
          className="font-medium text-emerald-deep underline-offset-4 hover:underline"
        >
          Lexo ajetin →
        </Link>
      </div>
    </section>
  );
}

async function HadithOfTheDay() {
  const hadith = await getHadithOfTheDay();
  if (!hadith) return null;

  return (
    <section className="relative mx-auto max-w-4xl px-4 text-center">
      <Eyebrow>Hadithi i ditës</Eyebrow>
      <p className="mx-auto mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink/90 sm:text-xl">
        {hadithHeadline(hadith)}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <span>{SOURCE_LABEL[hadith.source]} · HadeethEnc</span>
        <Link href={`/hadithe/${hadith.id}`} className="font-medium text-emerald-deep underline-offset-4 hover:underline">
          Lexo shpjegimin →
        </Link>
      </div>
    </section>
  );
}

function DuaOfTheDay() {
  const chapter = getDuaOfTheDay();
  const dua =
    chapter.items.find((i) => i.arabic && i.translation && i.audio) ??
    chapter.items.find((i) => i.arabic && i.translation) ??
    chapter.items[0];

  return (
    <section className="relative mx-auto max-w-4xl px-4 text-center">
      <Eyebrow>Duaja e ditës</Eyebrow>
      <h2 className="mt-4 font-serif text-lg font-semibold text-ink/90 sm:text-xl">{chapter.title}</h2>
      {dua.arabic ? (
        <>
          <p className="arabic mt-6 text-center text-2xl leading-[2.1] text-ink sm:text-3xl">{dua.arabic}</p>
          {dua.translit && (
            <p className="mx-auto mt-4 max-w-2xl font-serif leading-relaxed text-emerald-deep italic">{dua.translit}</p>
          )}
          {dua.translation && (
            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-ink/85 sm:text-lg">{dua.translation}</p>
          )}
        </>
      ) : (
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-ink/85 sm:text-lg">{dua.text}</p>
      )}
      {dua.audio && (
        <div className="mx-auto max-w-sm text-left">
          <DuaAudio src={audioUrl(dua.audio)} />
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <span>Mburoja e Muslimanit · Dua {chapter.n}</span>
        <Link href={`/mburoja/${chapter.n}`} className="font-medium text-emerald-deep underline-offset-4 hover:underline">
          Lexo të gjitha lutjet →
        </Link>
      </div>
    </section>
  );
}

export default async function Home() {
  const [hijri, timings] = await Promise.all([
    getHijriToday().catch(() => null),
    getTimings(DEFAULT_CITY, { next: { revalidate: 3600 } }),
  ]);
  const events = hijri ? await getUpcomingEvents(hijri).catch(() => []) : [];
  const ramadan = events.find((e) => e.hijri.month === 9 && e.hijri.day === 1);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroBanner />

      <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 sm:-mt-16">
        <PrayerTimes initial={timings} />
      </div>

      {hijri && (
        <div className="mx-auto mt-20 max-w-6xl px-4 sm:mt-28">
          <RamadanCountdown today={hijri} ramadan={ramadan} />
        </div>
      )}

      <div className="mt-24 sm:mt-32">
        <AyahOfTheDay />
      </div>

      <div className="mx-auto mt-16 max-w-4xl px-4 sm:mt-20">
        <div className="border-t border-line pt-16 sm:pt-20">
          <HadithOfTheDay />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-4xl px-4 sm:mt-20">
        <div className="border-t border-line pt-16 sm:pt-20">
          <DuaOfTheDay />
        </div>
      </div>

      <div className="mx-auto mt-24 grid max-w-6xl gap-8 px-4 sm:mt-32 lg:grid-cols-5 lg:gap-10">
        {hijri && events.length > 0 && (
          <div className="lg:col-span-3">
            <ImportantDates today={hijri} events={events} />
          </div>
        )}

        <section className="self-start rounded-[2rem] border border-line bg-card p-6 sm:p-8 lg:col-span-2">
          <h2 className="font-serif text-2xl font-semibold">Eksploro</h2>
          <p className="mt-1 text-sm text-muted">Çfarë gjen në Noor</p>
          <ul className="mt-6 divide-y divide-line">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="group flex items-center gap-4 py-4">
                  <Icon3D name={s.icon} className="size-12" still />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium transition-colors group-hover:text-gold">{s.title}</span>
                    <span className="block text-sm text-muted">{s.text}</span>
                  </span>
                  <span className="text-muted transition-all group-hover:translate-x-1 group-hover:text-gold">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
