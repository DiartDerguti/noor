const API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";
const WEEK = 60 * 60 * 24 * 7;

export const COLLECTIONS = {
  buhariu: { key: "bukhari", name: "Sahihu i Buhariut", arabic: "صحيح البخاري", author: "Imam Buhariu" },
  muslimi: { key: "muslim", name: "Sahihu i Muslimit", arabic: "صحيح مسلم", author: "Imam Muslimi" },
} as const;

export type CollectionSlug = keyof typeof COLLECTIONS;

export function isCollection(value: string): value is CollectionSlug {
  return value in COLLECTIONS;
}

export type Book = { number: number; name: string; first: number; last: number };

export type CollectionHadith = { number: number; arabic: string; english: string };

type Info = Record<
  string,
  {
    metadata: {
      last_hadithnumber: number;
      sections: Record<string, string>;
      section_details: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
    };
  }
>;

type Section = { hadiths: { hadithnumber: number; text: string }[] };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: WEEK } });
  if (!res.ok) throw new Error(`Koleksioni nuk u ngarkua (${res.status})`);
  return res.json() as Promise<T>;
}

export async function getBooks(slug: CollectionSlug) {
  const info = await get<Info>("/info.min.json");
  const meta = info[COLLECTIONS[slug].key].metadata;
  const books: Book[] = Object.entries(meta.sections)
    .map(([n, name]) => ({
      number: Number(n),
      name,
      first: meta.section_details[n]?.hadithnumber_first ?? 0,
      last: meta.section_details[n]?.hadithnumber_last ?? 0,
    }))
    .filter((b) => b.name && b.first > 0)
    .sort((a, b) => a.number - b.number);
  return { books, total: meta.last_hadithnumber };
}

export async function getBook(slug: CollectionSlug, book: number) {
  const key = COLLECTIONS[slug].key;
  const [arabic, english] = await Promise.all([
    get<Section>(`/editions/ara-${key}/sections/${book}.min.json`),
    get<Section>(`/editions/eng-${key}/sections/${book}.min.json`),
  ]);
  const englishByNumber = new Map(english.hadiths.map((h) => [h.hadithnumber, h.text]));
  return arabic.hadiths
    .filter((h) => h.text.trim())
    .map<CollectionHadith>((h) => ({
      number: h.hadithnumber,
      arabic: h.text.trim(),
      english: (englishByNumber.get(h.hadithnumber) ?? "").trim(),
    }));
}
