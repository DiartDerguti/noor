"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { DEFAULT_CITY, findCity, getTimings, type Timings } from "@/lib/prayer";
import CityPicker from "./CityPicker";

const CITY_KEY = "noor:city";
const cityListeners = new Set<() => void>();

function readCity() {
  try {
    const id = localStorage.getItem(CITY_KEY);
    return id && findCity(id) ? id : DEFAULT_CITY;
  } catch {
    return DEFAULT_CITY;
  }
}

function saveCity(id: string) {
  try {
    localStorage.setItem(CITY_KEY, id);
  } catch {}
  cityListeners.forEach((l) => l());
}

function subscribeCity(listener: () => void) {
  cityListeners.add(listener);
  return () => cityListeners.delete(listener);
}

function subscribeClock(listener: () => void) {
  const timer = setInterval(listener, 1000);
  return () => clearInterval(timer);
}

function secondsNow(timezone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const v = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return v("hour") * 3600 + v("minute") * 60 + v("second");
}

const toSeconds = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
};

function remaining(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.ceil((seconds % 3600) / 60);
  if (h === 0) return `edhe ${m} min`;
  return m === 0 ? `edhe ${h} orë` : `edhe ${h} orë ${m} min`;
}

function duration(from: string, to: string) {
  const minutes = (toSeconds(to) - toSeconds(from)) / 60;
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
}

const SLOTS = [
  { id: "Fajr", label: "Imsaku" },
  { id: "Sunrise", label: "Lindja e diellit" },
  { id: "Dhuhr", label: "Dreka" },
  { id: "Asr", label: "Ikindia" },
  { id: "Maghrib", label: "Akshami" },
  { id: "Isha", label: "Jacia" },
] as const;

export default function PrayerTimes({ initial }: { initial: Timings | null }) {
  const cityId = useSyncExternalStore(subscribeCity, readCity, () => DEFAULT_CITY);
  const [loaded, setLoaded] = useState<{ city: string; timings: Timings | null }>({
    city: DEFAULT_CITY,
    timings: initial,
  });
  const { city, country } = findCity(cityId)!;
  const now = useSyncExternalStore(
    subscribeClock,
    () => secondsNow(country.timezone),
    () => null,
  );

  useEffect(() => {
    if (loaded.city === cityId) return;
    let cancelled = false;
    getTimings(cityId).then((timings) => {
      if (!cancelled) setLoaded({ city: cityId, timings });
    });
    return () => {
      cancelled = true;
    };
  }, [cityId, loaded.city]);

  const t = loaded.city === cityId ? loaded.timings : null;

  let next: { id: string; in: number } | null = null;
  if (t && now !== null) {
    const slot = SLOTS.find((s) => toSeconds(t[s.id]) > now);
    next = slot ? { id: slot.id, in: toSeconds(t[slot.id]) - now } : { id: "Fajr", in: toSeconds(t.Fajr) + 86400 - now };
  }

  return (
    <section className="rounded-[2rem] border border-line bg-card px-6 py-8 shadow-2xl shadow-black/40 sm:px-10 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Kohët e namazit</h2>
          <p className="mt-1 text-sm text-muted">
            Sot në {city.name}
            {t && <> · dita zgjat {duration(t.Sunrise, t.Maghrib)} orë</>}
          </p>
        </div>
        <CityPicker value={cityId} onChange={saveCity} />
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-line">
        {SLOTS.map((s) => {
          const active = next?.id === s.id;
          return (
            <li key={s.id} className="lg:px-6 lg:first:pl-0">
              <p className={`text-sm ${active ? "font-medium text-gold" : "text-muted"}`}>{s.label}</p>
              <p className={`mt-2 font-serif text-3xl font-semibold tabular-nums sm:text-4xl ${active ? "text-gold" : ""}`}>
                {t ? t[s.id] : "--:--"}
              </p>
              <p className="mt-1 h-5 text-xs text-gold/80">{active && next ? remaining(next.in) : ""}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
