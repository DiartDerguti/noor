export type City = { id: string; name: string; lat: number; lng: number };
export type Country = { name: string; timezone: string; cities: City[] };

export const COUNTRIES: Country[] = [
  {
    name: "Kosovë",
    timezone: "Europe/Belgrade",
    cities: [
      { id: "prishtine", name: "Prishtinë", lat: 42.6629, lng: 21.1655 },
      { id: "prizren", name: "Prizren", lat: 42.2139, lng: 20.7397 },
      { id: "peje", name: "Pejë", lat: 42.6591, lng: 20.2883 },
      { id: "gjakove", name: "Gjakovë", lat: 42.3803, lng: 20.4308 },
      { id: "mitrovice", name: "Mitrovicë", lat: 42.8914, lng: 20.866 },
      { id: "ferizaj", name: "Ferizaj", lat: 42.3702, lng: 21.1553 },
      { id: "gjilan", name: "Gjilan", lat: 42.4635, lng: 21.4694 },
    ],
  },
  {
    name: "Shqipëri",
    timezone: "Europe/Tirane",
    cities: [
      { id: "tirane", name: "Tiranë", lat: 41.3275, lng: 19.8187 },
      { id: "durres", name: "Durrës", lat: 41.3231, lng: 19.4414 },
      { id: "shkoder", name: "Shkodër", lat: 42.0693, lng: 19.5033 },
      { id: "elbasan", name: "Elbasan", lat: 41.1125, lng: 20.0822 },
      { id: "vlore", name: "Vlorë", lat: 40.4661, lng: 19.4914 },
      { id: "korce", name: "Korçë", lat: 40.6186, lng: 20.7808 },
      { id: "kukes", name: "Kukës", lat: 42.0767, lng: 20.4211 },
    ],
  },
  {
    name: "Maqedoni e Veriut",
    timezone: "Europe/Skopje",
    cities: [
      { id: "shkup", name: "Shkup", lat: 41.9981, lng: 21.4254 },
      { id: "tetove", name: "Tetovë", lat: 42.0106, lng: 20.9715 },
      { id: "gostivar", name: "Gostivar", lat: 41.7961, lng: 20.9086 },
      { id: "kumanove", name: "Kumanovë", lat: 42.1322, lng: 21.7144 },
      { id: "struge", name: "Strugë", lat: 41.1778, lng: 20.6783 },
      { id: "kercove", name: "Kërçovë", lat: 41.5142, lng: 20.9567 },
    ],
  },
  {
    name: "Mali i Zi",
    timezone: "Europe/Podgorica",
    cities: [
      { id: "podgorice", name: "Podgoricë", lat: 42.4304, lng: 19.2594 },
      { id: "ulqin", name: "Ulqin", lat: 41.9294, lng: 19.2244 },
      { id: "tuz", name: "Tuz", lat: 42.3656, lng: 19.3314 },
      { id: "plave", name: "Plavë", lat: 42.5967, lng: 19.945 },
      { id: "guci", name: "Guci", lat: 42.5619, lng: 19.8339 },
      { id: "rozhaje", name: "Rozhajë", lat: 42.8333, lng: 20.1667 },
    ],
  },
];

export const DEFAULT_CITY = "prishtine";

export function findCity(id: string) {
  for (const country of COUNTRIES) {
    const city = country.cities.find((c) => c.id === id);
    if (city) return { city, country };
  }
  return null;
}

export const PRAYERS = [
  { key: "Fajr", label: "Imsaku" },
  { key: "Sunrise", label: "Lindja e diellit" },
  { key: "Dhuhr", label: "Dreka" },
  { key: "Asr", label: "Ikindia" },
  { key: "Maghrib", label: "Akshami" },
  { key: "Isha", label: "Jacia" },
] as const;

export type Timings = Record<(typeof PRAYERS)[number]["key"], string>;

export function todayIn(timezone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("day")}-${get("month")}-${get("year")}`;
}

export async function getTimings(cityId: string, init?: RequestInit): Promise<Timings | null> {
  const found = findCity(cityId);
  if (!found) return null;
  const { city, country } = found;
  const url = `https://api.aladhan.com/v1/timings/${todayIn(country.timezone)}?latitude=${city.lat}&longitude=${city.lng}&method=13&timezonestring=${country.timezone}`;
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    const t = (await res.json()).data.timings;
    return Object.fromEntries(PRAYERS.map((p) => [p.key, String(t[p.key]).slice(0, 5)])) as Timings;
  } catch {
    return null;
  }
}
