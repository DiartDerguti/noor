import SURAHS from "./surahs.json";


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
  albanianName: string;
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

type Row = [juz: number, page: number, sajda: number, arabic: string, ...translations: string[]];

async function data(): Promise<Row[][]> {
  return (await import("@/data/quran.json")).default as unknown as Row[][];
}

function buildAyah(chapter: number, verse: number, row: Row, ids: readonly TranslationId[]): Ayah {
  return {
    number: offsets[chapter - 1] + verse,
    numberInSurah: verse,
    surah: chapter,
    juz: row[0],
    page: row[1],
    sajda: row[2] === 1,
    arabic: row[3],
    translations: ids.map((id) => ({ id, text: String(row[4 + TRANSLATIONS.findIndex((t) => t.id === id)]) })),
  };
}

export async function getSurah(number: number, translations: readonly TranslationId[]) {
  const chapters = await data();
  const ayahs = chapters[number - 1].map((row, i) => buildAyah(number, i + 1, row, translations));
  return { meta: surahs[number - 1], ayahs };
}

export async function getSection(kind: "page" | "juz", n: number, translations: readonly TranslationId[]) {
  const chapters = await data();
  const column = kind === "page" ? 1 : 0;
  const groups: SurahGroup[] = [];
  chapters.forEach((rows, c) => {
    const ayahs = rows.flatMap((row, i) => (row[column] === n ? [buildAyah(c + 1, i + 1, row, translations)] : []));
    if (ayahs.length > 0) groups.push({ surah: surahs[c], ayahs });
  });
  return groups;
}

export async function getAyah(globalNumber: number, translation: TranslationId) {
  const index = offsets.findLastIndex((o) => o < globalNumber);
  const surah = surahs[index];
  const verse = globalNumber - offsets[index];
  const ayah = buildAyah(surah.number, verse, (await data())[index][verse - 1], [translation]);
  return { arabic: ayah.arabic, translation: ayah.translations[0].text, numberInSurah: verse, surah };
}

export function ayahOfTheDay(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return ((day * 7919) % TOTAL_AYAHS) + 1;
}
