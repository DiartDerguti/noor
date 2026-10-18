import { formatDate, type HijriDate, type IslamicEvent } from "@/lib/hijri";
import Icon3D from "./Icon3D";

export default function RamadanCountdown({ today, ramadan }: { today: HijriDate; ramadan?: IslamicEvent }) {
  const inRamadan = today.month === 9;
  if (!inRamadan && !ramadan) return null;

  return (
    <section className="pattern relative overflow-hidden rounded-[2rem] border border-gold/30 bg-card px-6 py-10 sm:px-12 sm:py-14">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-soft/70 via-card/80 to-card" />
      <div className="absolute -top-24 -right-24 size-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-6">
          <Icon3D name="moon" className="size-20 sm:size-24" />
          <div>
            <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
              Ramazani {inRamadan ? today.year : ramadan!.hijri.year}
            </p>
            {inRamadan ? (
              <p className="mt-2 font-serif text-5xl font-semibold">Dita {today.day}</p>
            ) : (
              <p className="mt-1 font-serif leading-none font-semibold">
                <span className="text-7xl text-gold tabular-nums sm:text-8xl">{ramadan!.daysLeft}</span>
                <span className="ml-3 text-2xl text-ink/80">ditë</span>
              </p>
            )}
            {!inRamadan && <p className="mt-2 text-sm text-muted">Fillon {formatDate(ramadan!.date)}</p>}
          </div>
        </div>

        <blockquote className="border-gold/50 font-serif text-xl leading-relaxed text-ink/90 sm:text-2xl lg:border-l lg:pl-10">
          {inRamadan
            ? "Allahu na i pranoftë agjërimet dhe ibadetet."
            : "A je duke u përgatitur, o rob i Zotit? Ai që e nis garën pa u përgatitur, si mendon ta përfundojë më së miri?"}
        </blockquote>
      </div>
    </section>
  );
}
