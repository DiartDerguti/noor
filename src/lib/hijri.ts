const API = "https://api.aladhan.com/v1";
const DAY_MS = 86_400_000;
const TIMEZONE = "Europe/Belgrade";

export const HIJRI_MONTHS = [
  "Muharrem",
  "Safer",
  "Rebiul Evvel",
  "Rebiul Ahir",
  "Xhumadel Ula",
  "Xhumadel Ahire",
  "Rexheb",
  "Shaban",
  "Ramazan",
  "Sheval",
  "Dhul Kade",
  "Dhul Hixhe",
];

const EVENTS = [
  { name: "Viti i Ri Hixhri", day: 1, month: 1 },
  { name: "Dita e Ashures", day: 10, month: 1 },
  { name: "Fillimi i Ramazanit", day: 1, month: 9 },
  { name: "Nata e Kadrit", day: 26, month: 9, note: "mbrëmja e 27 të Ramazanit" },
  { name: "Fitër Bajrami", day: 1, month: 10 },
  { name: "Dita e Arafatit", day: 9, month: 12 },
  { name: "Kurban Bajrami", day: 10, month: 12 },
];

export type HijriDate = { day: number; month: number; year: number };
export type IslamicEvent = { name: string; note?: string; date: Date; hijri: HijriDate; daysLeft: number };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Kalendari nuk u ngarkua (${res.status})`);
  return (await res.json()).data as T;
}

function todayParts() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date());
  const v = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return { day: v("day"), month: v("month"), year: v("year") };
}

const pad = (n: number) => String(n).padStart(2, "0");

function parseDmy(dmy: string) {
  const [d, m, y] = dmy.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatHijri(h: HijriDate) {
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} H`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("sq-AL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export async function getHijriToday(): Promise<HijriDate> {
  const t = todayParts();
  const data = await get<{ hijri: { day: string; month: { number: number }; year: string } }>(
    `/gToH/${pad(t.day)}-${pad(t.month)}-${t.year}?calendarMethod=Dijanet`,
  );
  return { day: Number(data.hijri.day), month: data.hijri.month.number, year: Number(data.hijri.year) };
}

async function toGregorian(h: HijriDate) {
  const data = await get<{ gregorian: { date: string } }>(
    `/hToG/${pad(h.day)}-${pad(h.month)}-${h.year}?calendarMethod=Dijanet`,
  );
  return parseDmy(data.gregorian.date);
}

export async function getUpcomingEvents(today: HijriDate): Promise<IslamicEvent[]> {
  const t = todayParts();
  const now = Date.UTC(t.year, t.month - 1, t.day);

  const events = await Promise.all(
    EVENTS.map(async (e) => {
      const passed = e.month < today.month || (e.month === today.month && e.day < today.day);
      const hijri = { day: e.day, month: e.month, year: passed ? today.year + 1 : today.year };
      const date = await toGregorian(hijri);
      return { name: e.name, note: e.note, date, hijri, daysLeft: Math.round((date.getTime() - now) / DAY_MS) };
    }),
  );

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}
