const API = "https://hadeethenc.com/api/v1";
const DAY = 60 * 60 * 24;
const LANG = "sq";

export const PER_PAGE = 20;

export type Source = "bukhari" | "muslim" | "both";

export const SOURCE_LABEL: Record<Source, string> = {
  bukhari: "Sahihu i Buhariut",
  muslim: "Sahihu i Muslimit",
  both: "Buhariu dhe Muslimi · Muttefek alejhi",
};

export type Category = { id: string; title: string; count: number };

export type Hadith = {
  id: string;
  title: string;
  text: string;
  arabic: string;
  explanation: string;
  lessons: string[];
  grade: string;
  source: Source;
  attribution: string;
  url: string;
};

type RawHadith = {
  id: string;
  title: string;
  hadeeth: string;
  hadeeth_ar: string;
  explanation: string;
  hints?: string[];
  grade: string;
  attribution: string;
  attribution_ar: string;
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: DAY } });
  if (!res.ok) throw new Error(`Hadithet nuk u ngarkuan (${res.status})`);
  return res.json() as Promise<T>;
}

const OTHER_SOURCES =
  /أحمد|الترمذي|النسائي|ابن ماجه|أبو داود|ابن حبان|الحاكم|الدارمي|مالك|البيهقي|الطبراني|الدارقطني|ابن خزيمة|البزار|أبو يعلى|ابن أبي شيبة|عبد الرزاق|الأدب المفرد|معلق|الحجة/;

export function sourceOf(attributionAr: string): Source | null {
  const a = attributionAr.trim();
  if (!a || OTHER_SOURCES.test(a)) return null;
  if (a.includes("متفق عليه")) return "both";
  const bukhari = a.includes("البخاري");
  const muslim = /(^|[\sو])مسلم/.test(a);
  if (bukhari && muslim) return "both";
  if (bukhari) return "bukhari";
  if (muslim) return "muslim";
  return null;
}

function isMostlyArabic(text: string) {
  const letters = text.replace(/[^\p{L}]/gu, "");
  const arabic = text.replace(/[^؀-ۿ]/g, "");
  return letters.length > 0 && arabic.length / letters.length > 0.5;
}

function clean(text: string) {
  return text.replace(/\r/g, "").trim();
}

function normalize(raw: RawHadith): Hadith | null {
  const source = sourceOf(raw.attribution_ar ?? "");
  if (!source || !raw.hadeeth || isMostlyArabic(raw.hadeeth)) return null;
  return {
    id: raw.id,
    title: clean(raw.title),
    text: clean(raw.hadeeth),
    arabic: clean(raw.hadeeth_ar ?? ""),
    explanation: clean(raw.explanation ?? ""),
    lessons: (raw.hints ?? []).map(clean).filter(Boolean),
    grade: raw.grade,
    source,
    attribution: raw.attribution && !isMostlyArabic(raw.attribution) ? clean(raw.attribution) : SOURCE_LABEL[source],
    url: `https://hadeethenc.com/sq/browse/hadith/${raw.id}`,
  };
}

export async function getCategories(): Promise<Category[]> {
  const list = await get<{ id: string; title: string; hadeeths_count: string }[]>(
    `/categories/roots/?language=${LANG}`,
  );
  return list.map((c) => ({ id: c.id, title: c.title.replace("Kueani", "Kurani"), count: Number(c.hadeeths_count) }));
}

export async function getHadith(id: string) {
  try {
    return normalize(await get<RawHadith>(`/hadeeths/one/?language=${LANG}&id=${encodeURIComponent(id)}`));
  } catch {
    return null;
  }
}

export const SEARCH_LIMIT = 30;

export function simplify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchCategory(categoryId: string, query: string) {
  const q = simplify(query);
  if (!q) return { hadiths: [], matches: 0 };

  const list = await get<{ data: { id: string; title: string }[] }>(
    `/hadeeths/list/?language=${LANG}&category_id=${encodeURIComponent(categoryId)}&page=1&per_page=1000`,
  );
  const words = q.split(" ");
  const matches = list.data.filter((h) => {
    const title = simplify(h.title);
    return words.every((w) => title.includes(w));
  });
  const hadiths = await Promise.all(matches.slice(0, SEARCH_LIMIT).map((h) => getHadith(h.id)));

  return {
    hadiths: hadiths.filter((h): h is Hadith => h !== null),
    matches: matches.length,
  };
}

export async function getCategoryPage(categoryId: string, page: number) {
  const list = await get<{ data: { id: string }[]; meta: { last_page: number } }>(
    `/hadeeths/list/?language=${LANG}&category_id=${encodeURIComponent(categoryId)}&page=${page}&per_page=${PER_PAGE}`,
  );
  const hadiths = await Promise.all(list.data.map((h) => getHadith(h.id)));
  return {
    hadiths: hadiths.filter((h): h is Hadith => h !== null),
    lastPage: Number(list.meta.last_page) || 1,
  };
}

export function hadithAsText(hadith: Hadith, url: string) {
  return [
    hadith.text,
    hadith.explanation && `Shpjegimi:\n${hadith.explanation}`,
    hadith.lessons.length > 0 && `Çfarë mësojmë:\n${hadith.lessons.map((l) => `• ${l}`).join("\n")}`,
    `Burimi: ${hadith.attribution} · ${hadith.grade} (HadeethEnc)`,
    url,
  ]
    .filter(Boolean)
    .join("\n\n");
}
