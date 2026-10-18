import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { formatHijri, getHijriToday, getUpcomingEvents } from "@/lib/hijri";
import { DEFAULT_CITY, getTimings } from "@/lib/prayer";
import PrayerTimes from "@/components/PrayerTimes";
import RamadanCountdown from "@/components/RamadanCountdown";
import ImportantDates from "@/components/ImportantDates";
import InstallApp from "@/components/InstallApp";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta({
  title: "Kohët e namazit",
  description:
    "Takvimi për Kosovë, Shqipëri, Maqedoni të Veriut dhe Mal të Zi, me namazin e radhës dhe datat e rëndësishme.",
  path: "/takvimi",
});

export default async function TakvimPage() {
  const [hijri, timings] = await Promise.all([
    getHijriToday().catch(() => null),
    getTimings(DEFAULT_CITY, { next: { revalidate: 3600 } }),
  ]);
  const events = hijri ? await getUpcomingEvents(hijri).catch(() => []) : [];
  const ramadan = events.find((e) => e.hijri.month === 9 && e.hijri.day === 1);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <header className="flex flex-wrap items-end justify-between gap-4 pt-10 pb-8 sm:pt-14">
        <div>
          {hijri && <p className="text-gold text-sm">{formatHijri(hijri)}</p>}
          <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight">
            Takvimi
          </h1>
        </div>
        <InstallApp />
      </header>

      <PrayerTimes initial={timings} />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {hijri && <RamadanCountdown today={hijri} ramadan={ramadan} />}
        {hijri && events.length > 0 && (
          <ImportantDates today={hijri} events={events} />
        )}
      </div>
    </div>
  );
}
