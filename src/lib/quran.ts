const API = "https://api.alquran.cloud/v1";
const WEEK = 60 * 60 * 24 * 7;

export const TRANSLATIONS = [
  { id: "sq.nahi", name: "Hasan Efendi Nahi" },
  { id: "sq.ahmeti", name: "Sherif Ahmeti" },
  { id: "sq.mehdiu", name: "Feti Mehdiu" },
] as const;

export type TranslationId = (typeof TRANSLATIONS)[number]["id"];

export const DEFAULT_TRANSLATION: TranslationId = "sq.nahi";
export const TOTAL_AYAHS = 6236;

export function isTranslationId(value: unknown): value is TranslationId {
  return TRANSLATIONS.some((t) => t.id === value);
}

export function translationName(id: TranslationId) {
  return TRANSLATIONS.find((t) => t.id === id)!.name;
}

export type SurahMeta = {
  number: number;
  name: string;
  englishName: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
};

export type Ayah = {
  number: number;
  numberInSurah: number;
  juz: number;
  sajda: boolean | object;
  arabic: string;
  translations: { id: TranslationId; text: string }[];
};

type Edition = SurahMeta & {
  edition: { identifier: string };
  ayahs: { number: number; numberInSurah: number; juz: number; sajda: boolean | object; text: string }[];
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: WEEK } });
  if (!res.ok) throw new Error(`Kurani nuk u ngarkua (${res.status})`);
  const json = await res.json();
  return json.data as T;
}

export const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

export function revelationLabel(type: SurahMeta["revelationType"]) {
  return type === "Meccan" ? "Mekë" : "Medinë";
}

export async function getSurahs() {
  const list = await get<SurahMeta[]>("/surah");
  return list.map(({ number, name, englishName, revelationType, numberOfAyahs }) => ({
    number,
    name,
    englishName,
    revelationType,
    numberOfAyahs,
  }));
}

export async function getSurah(number: number, translations: TranslationId[]) {
  const editions = await get<Edition[]>(`/surah/${number}/editions/quran-uthmani,${translations.join(",")}`);
  const [arabic, ...rest] = editions;

  const ayahs: Ayah[] = arabic.ayahs.map((a, i) => {
    let text = a.text;
    if (number !== 1 && a.numberInSurah === 1 && text.startsWith(BASMALA)) {
      text = text.slice(BASMALA.length).trim();
    }
    return {
      number: a.number,
      numberInSurah: a.numberInSurah,
      juz: a.juz,
      sajda: a.sajda,
      arabic: text,
      translations: rest.map((e) => ({ id: e.edition.identifier as TranslationId, text: e.ayahs[i].text })),
    };
  });

  const { name, englishName, revelationType, numberOfAyahs } = arabic;
  return { meta: { number, name, englishName, revelationType, numberOfAyahs } as SurahMeta, ayahs };
}

type AyahEdition = {
  text: string;
  numberInSurah: number;
  surah: SurahMeta;
  edition: { identifier: string };
};

export async function getAyah(globalNumber: number, translation: TranslationId) {
  const [arabic, tr] = await get<AyahEdition[]>(`/ayah/${globalNumber}/editions/quran-uthmani,${translation}`);
  let text = arabic.text;
  if (arabic.surah.number !== 1 && arabic.numberInSurah === 1 && text.startsWith(BASMALA)) {
    text = text.slice(BASMALA.length).trim();
  }
  return {
    arabic: text,
    translation: tr.text,
    numberInSurah: arabic.numberInSurah,
    surah: arabic.surah,
  };
}

export function ayahOfTheDay(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return ((day * 7919) % TOTAL_AYAHS) + 1;
}
