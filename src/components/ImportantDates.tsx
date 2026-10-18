import { HIJRI_MONTHS, formatDate, formatHijri, type HijriDate, type IslamicEvent } from "@/lib/hijri";
import Icon3D from "./Icon3D";

function daysLabel(days: number) {
  if (days === 0) return "Sot";
  if (days === 1) return "Nesër";
  return `për ${days} ditë`;
}

export default function ImportantDates({
  today,
  events,
  limit = events.length,
}: {
  today: HijriDate;
  events: IslamicEvent[];
  limit?: number;
}) {
  return (
    <section className="h-full rounded-[2rem] border border-line bg-card p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <Icon3D name="calendar" className="size-14" />
        <div>
          <h2 className="font-serif text-2xl font-semibold">Datat e rëndësishme</h2>
          <p className="text-sm text-muted">
            Sot: {formatHijri(today)} · viti {today.year} hixhri
          </p>
        </div>
      </div>

      <ul className="mt-6 divide-y divide-line">
        {events.slice(0, limit).map((e) => (
          <li key={e.name} className="flex items-center gap-4 py-3.5">
            <span className="grid w-14 shrink-0 place-items-center rounded-xl bg-paper/60 py-1.5 text-center">
              <span className="font-serif text-xl leading-none font-semibold">{e.hijri.day}</span>
              <span className="mt-0.5 text-[10px] leading-tight text-muted">{HIJRI_MONTHS[e.hijri.month - 1]}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{e.name}</span>
              <span className="block text-sm text-muted">
                {formatDate(e.date)}
                {e.note && ` · ${e.note}`}
              </span>
            </span>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                e.daysLeft <= 7 ? "bg-gold-soft text-gold" : "bg-paper/60 text-muted"
              }`}
            >
              {daysLabel(e.daysLeft)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-muted">
        Sipas kalendarit hixhri. Data e saktë e Ramazanit dhe e Bajrameve shpallet zyrtarisht nga Bashkësia
        Islame dhe mund të ndryshojë.
      </p>
    </section>
  );
}
