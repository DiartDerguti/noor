import { formatDate, type HijriDate, type IslamicEvent } from "@/lib/hijri";
import { SOURCE_LABEL, getHadith } from "@/lib/hadith";
import Icon3D from "./Icon3D";
import HadithCarousel from "./HadithCarousel";

// Hadiths about Ramadan and fasting from HadeethEnc, all from Bukhari and/or Muslim.
const RAMADAN_HADITHS = [
  "10107",
  "4196",
  "3546",
  "3738",
  "4549",
  "4508",
  "4540",
  "4944",
  "6179",
  "3755",
  "4495",
  "2753",
  "3591",
  "4525",
  "4436",
];

export default async function RamadanCountdown({
  today,
  ramadan,
}: {
  today: HijriDate;
  ramadan?: IslamicEvent;
}) {
  const inRamadan = today.month === 9;
  if (!inRamadan && !ramadan) return null;
  const hadiths = (
    await Promise.all(RAMADAN_HADITHS.map((id) => getHadith(id)))
  )
    .filter((h) => h !== null)
    .map((h) => ({ id: h.id, title: h.title, source: SOURCE_LABEL[h.source] }));

  return (
    <section className="pattern border-gold/30 bg-card relative overflow-hidden rounded-[2rem] border px-6 py-10 sm:px-12 sm:py-14">
      <div className="from-emerald-soft/70 via-card/80 to-card absolute inset-0 bg-gradient-to-br" />
      <div className="bg-gold/10 absolute -top-24 -right-24 size-72 rounded-full blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-6">
          <Icon3D name="moon" className="size-20 sm:size-24" />
          <div>
            <p className="text-gold text-xs font-medium tracking-[0.25em] uppercase">
              Ramazani {inRamadan ? today.year : ramadan!.hijri.year}
            </p>
            {inRamadan ? (
              <p className="mt-2 font-serif text-5xl font-semibold">
                Dita {today.day}
              </p>
            ) : (
              <p className="mt-1 font-serif leading-none font-semibold">
                <span className="text-gold text-7xl tabular-nums sm:text-8xl">
                  {ramadan!.daysLeft}
                </span>
                <span className="text-ink/80 ml-3 text-2xl">ditë</span>
              </p>
            )}
            {!inRamadan && (
              <p className="text-muted mt-2 text-sm">
                Fillon {formatDate(ramadan!.date)}
              </p>
            )}
          </div>
        </div>

        <HadithCarousel items={hadiths} />
      </div>
    </section>
  );
}
