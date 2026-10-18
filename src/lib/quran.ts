import SURAHS from "./surahs.json";

const CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1";
const QURAN_COM = "https://api.quran.com/api/v4/quran/verses/qpc_hafs";
const WEEK = 60 * 60 * 24 * 7;

export const TRANSLATIONS = [
  { id: "sq.nahi", name: "Hasan Efendi Nahi", edition: "sqi-hasanefendinahi" },
  { id: "sq.ahmeti", name: "Sherif Ahmeti", edition: "sqi-sherifahmeti" },
  { id: "sq.mehdiu", name: "Feti Mehdiu", edition: "sqi-fetimehdiu" },
] as const;

export type TranslationId = (typeof TRANSLATIONS)[number]["id"];

export const DEFAULT_TRANSLATION: TranslationId = "sq.nahi";
export const TOTAL_AYAHS = 6236;
export const TOTAL_PAGES = 604;
export const TOTAL_JUZ = 30;
export const COMPARE = "te-gjitha";

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

export type SurahGroup = { surah: SurahMeta; ayahs: Ayah[] };

export const BASMALA_QPC = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ";

const surahs = SURAHS as SurahMeta[];

const offsets = surahs.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + surahs[i - 1].numberOfAyahs);
  return acc;
}, []);

export function revelationLabel(type: SurahMeta["revelationType"]) {
  return type === "Meccan" ? "Mekë" : "Medinë";
}

export async function getSurahs(): Promise<SurahMeta[]> {
  return surahs;
}

async function json<T>(url: string): Promise<T> {
  let res = await fetch(url, { next: { revalidate: WEEK } });
  for (let attempt = 1; attempt <= 2 && (res.status === 429 || res.status >= 500); attempt++) {
    await new Promise((r) => setTimeout(r, 800 * attempt));
    res = await fetch(url, { next: { revalidate: WEEK } });
  }
  if (!res.ok) throw new Error(`Kurani nuk u ngarkua (${res.status})`);
  return res.json() as Promise<T>;
}

type VerseInfo = { verse: number; juz: number; page: number; sajda: boolean | object };

async function verseInfo() {
  const info = await json<{ chapters: { chapter: number; verses: VerseInfo[] }[] }>(`${CDN}/info.min.json`);
  return info.chapters;
}

async function arabicTexts(query: string) {
  try {
    const { verses } = await json<{ verses: { verse_key: string; text_qpc_hafs: string }[] }>(`${QURAN_COM}?${query}`);
    return new Map(verses.map((v) => [v.verse_key, v.text_qpc_hafs.replace(/[\s ]*[٠-٩]+$/, "")]));
  } catch {
    return new Map<string, string>();
  }
}

async function translationTexts(chapter: number, ids: readonly TranslationId[]) {
  const editions = await Promise.all(
    ids.map(async (id) => {
      const edition = TRANSLATIONS.find((t) => t.id === id)!.edition;
      const data = await json<{ chapter: { verse: number; text: string }[] }>(
        `${CDN}/editions/${edition}/${chapter}.min.json`,
      );
      return { id, byVerse: new Map(data.chapter.map((v) => [v.verse, v.text])) };
    }),
  );
  return (verse: number) => editions.map((e) => ({ id: e.id, text: e.byVerse.get(verse) ?? "" }));
}

function buildAyah(
  chapter: number,
  v: VerseInfo,
  arabic: Map<string, string>,
  translate: (verse: number) => { id: TranslationId; text: string }[],
): Ayah {
  return {
    number: offsets[chapter - 1] + v.verse,
    numberInSurah: v.verse,
    surah: chapter,
    juz: v.juz,
    page: v.page,
    sajda: v.sajda,
    arabic: arabic.get(`${chapter}:${v.verse}`) ?? "",
    translations: translate(v.verse),
  };
}

export async function getSurah(number: number, translations: readonly TranslationId[]) {
  const [chapters, arabic, translate] = await Promise.all([
    verseInfo(),
    arabicTexts(`chapter_number=${number}`),
    translationTexts(number, translations),
  ]);
  const ayahs = chapters[number - 1].verses.map((v) => buildAyah(number, v, arabic, translate));
  return { meta: surahs[number - 1], ayahs };
}

export async function getSection(kind: "page" | "juz", n: number, translations: readonly TranslationId[]) {
  const chapters = await verseInfo();
  const matches = chapters
    .map((c) => ({ chapter: c.chapter, verses: c.verses.filter((v) => (kind === "page" ? v.page : v.juz) === n) }))
    .filter((c) => c.verses.length > 0);

  const [arabic, translators] = await Promise.all([
    arabicTexts(`${kind === "page" ? "page_number" : "juz_number"}=${n}`),
    Promise.all(matches.map((c) => translationTexts(c.chapter, translations))),
  ]);

  return matches.map<SurahGroup>((c, i) => ({
    surah: surahs[c.chapter - 1],
    ayahs: c.verses.map((v) => buildAyah(c.chapter, v, arabic, translators[i])),
  }));
}

export async function getAyah(globalNumber: number, translation: TranslationId) {
  const index = offsets.findLastIndex((o) => o < globalNumber);
  const surah = surahs[index];
  const verse = globalNumber - offsets[index];
  const [arabic, translate] = await Promise.all([
    arabicTexts(`verse_key=${surah.number}:${verse}`),
    translationTexts(surah.number, [translation]),
  ]);
  return {
    arabic: arabic.get(`${surah.number}:${verse}`) ?? "",
    translation: translate(verse)[0].text,
    numberInSurah: verse,
    surah,
  };
}

export function ayahOfTheDay(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return ((day * 7919) % TOTAL_AYAHS) + 1;
}
