import SURAHS from "./surahs.json";
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
export const TOTAL_PAGES = 604;
export const TOTAL_JUZ = 30;

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
  surah: number;
  juz: number;
  page: number;
  sajda: boolean | object;
  arabic: string;
  translations: { id: TranslationId; text: string }[];
};

type Edition = SurahMeta & {
  edition: { identifier: string };
  ayahs: { number: number; numberInSurah: number; juz: number; page: number; sajda: boolean | object; text: string }[];
};

async function get<T>(path: string): Promise<T> {
  let res = await fetch(`${API}${path}`, { next: { revalidate: WEEK } });
  for (let attempt = 1; attempt <= 3 && (res.status === 429 || res.status >= 500); attempt++) {
    await new Promise((r) => setTimeout(r, 1000 * attempt));
    res = await fetch(`${API}${path}`, { next: { revalidate: WEEK } });
  }
  if (!res.ok) throw new Error(`Kurani nuk u ngarkua (${res.status})`);
  const json = await res.json();
  return json.data as T;
}

const QURAN_COM = "https://api.quran.com/api/v4/quran/verses/qpc_hafs";

async function uthmani(query: string) {
  try {
    const res = await fetch(`${QURAN_COM}?${query}`, { next: { revalidate: WEEK } });
    if (!res.ok) return new Map<string, string>();
    const { verses } = (await res.json()) as { verses: { verse_key: string; text_qpc_hafs: string }[] };
    return new Map(verses.map((v) => [v.verse_key, v.text_qpc_hafs.replace(/[s ]*[٠-٩]+$/, "")]));
  } catch {
    return new Map<string, string>();
  }
}

export const BASMALA_QPC = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ";

export const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

export function revelationLabel(type: SurahMeta["revelationType"]) {
  return type === "Meccan" ? "Mekë" : "Medinë";
}

export async function getSurahs(): Promise<SurahMeta[]> {
  return SURAHS as SurahMeta[];
}

export async function getSurah(number: number, translations: TranslationId[]) {
  const [editions, texts] = await Promise.all([
    Promise.all(["quran-uthmani", ...translations].map((edition) => get<Edition>(`/surah/${number}/${edition}`))),
    uthmani(`chapter_number=${number}`),
  ]);
  const [arabic, ...rest] = editions;

  const ayahs: Ayah[] = arabic.ayahs.map((a, i) => {
    let text = a.text;
    if (number !== 1 && a.numberInSurah === 1 && text.startsWith(BASMALA)) {
      text = text.slice(BASMALA.length).trim();
    }
    return {
      number: a.number,
      numberInSurah: a.numberInSurah,
      surah: number,
      juz: a.juz,
      page: a.page,
      sajda: a.sajda,
      arabic: texts.get(`${number}:${a.numberInSurah}`) ?? text,
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
  const texts = await uthmani(`verse_key=${arabic.surah.number}:${arabic.numberInSurah}`);
  return {
    arabic: texts.get(`${arabic.surah.number}:${arabic.numberInSurah}`) ?? text,
    translation: tr.text,
    numberInSurah: arabic.numberInSurah,
    surah: arabic.surah,
  };
}

export function ayahOfTheDay(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return ((day * 7919) % TOTAL_AYAHS) + 1;
}

export type SurahGroup = { surah: SurahMeta; ayahs: Ayah[] };

type SectionEdition = {
  ayahs: {
    number: number;
    numberInSurah: number;
    juz: number;
    page: number;
    sajda: boolean | object;
    text: string;
    surah: SurahMeta;
  }[];
};

export async function getSection(kind: "page" | "juz", n: number, translations: TranslationId[]) {
  const [[arabic, ...rest], texts] = await Promise.all([
    Promise.all(["quran-uthmani", ...translations].map((edition) => get<SectionEdition>(`/${kind}/${n}/${edition}`))),
    uthmani(`${kind === "page" ? "page_number" : "juz_number"}=${n}`),
  ]);

  const groups: SurahGroup[] = [];
  arabic.ayahs.forEach((a, i) => {
    let text = a.text;
    if (a.surah.number !== 1 && a.numberInSurah === 1 && text.startsWith(BASMALA)) {
      text = text.slice(BASMALA.length).trim();
    }
    const ayah: Ayah = {
      number: a.number,
      numberInSurah: a.numberInSurah,
      surah: a.surah.number,
      juz: a.juz,
      page: a.page,
      sajda: a.sajda,
      arabic: texts.get(`${a.surah.number}:${a.numberInSurah}`) ?? text,
      translations: rest.map((e, j) => ({ id: translations[j], text: e.ayahs[i].text })),
    };
    const last = groups.at(-1);
    if (last && last.surah.number === a.surah.number) last.ayahs.push(ayah);
    else {
      const { number, name, englishName, revelationType, numberOfAyahs } = a.surah;
      groups.push({ surah: { number, name, englishName, revelationType, numberOfAyahs }, ayahs: [ayah] });
    }
  });
  return groups;
}

export const COMPARE = "te-gjitha";
export const ARABIC_ONLY = "arabisht";

export function readTranslation(p?: string) {
  if (p === ARABIC_ONLY) {
    return { compare: false, arabicOnly: true, selected: [] as TranslationId[], active: ARABIC_ONLY, query: `?p=${ARABIC_ONLY}` };
  }
  const compare = p === COMPARE;
  const selected: TranslationId[] = compare
    ? TRANSLATIONS.map((t) => t.id)
    : [isTranslationId(p) ? p : DEFAULT_TRANSLATION];
  return {
    compare,
    arabicOnly: false,
    selected,
    active: compare ? COMPARE : selected[0],
    query: p && p !== DEFAULT_TRANSLATION ? `?p=${p}` : "",
  };
}
