
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

type Data = { categories: { id: string; title: string; ids: string[] }[]; items: Record<string, Omit<RawHadith, "id">> };

let cache: Promise<{ data: Data; byId: Map<string, Hadith> }> | null = null;

function load() {
  cache ??= import("@/data/hadith.json").then(({ default: raw }) => {
    const data = raw as unknown as Data;
    const byId = new Map<string, Hadith>();
    for (const [id, item] of Object.entries(data.items)) {
      const h = normalize({ id, ...item });
      if (h) byId.set(id, h);
    }
    return { data, byId };
  });
  return cache;
}

async function topicHadiths(categoryId: string) {
  const { data, byId } = await load();
  const ids = data.categories.find((c) => c.id === categoryId)?.ids ?? [];
  return ids.map((id) => byId.get(id)).filter((h): h is Hadith => h !== undefined);
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
  const { data } = await load();
  return Promise.all(
    data.categories.map(async (c) => ({
      id: c.id,
      title: c.title.replace("Kueani", "Kurani"),
      count: (await topicHadiths(c.id)).length,
    })),
  );
}

export async function getHadith(id: string) {
  return (await load()).byId.get(id) ?? null;
}

export async function getAllHadithIds() {
  return [...(await load()).byId.keys()];
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
  const words = q.split(" ");
  const matches = (await topicHadiths(categoryId)).filter((h) => {
    const text = simplify(`${h.title} ${h.text}`);
    return words.every((w) => text.includes(w));
  });
  return { hadiths: matches.slice(0, SEARCH_LIMIT), matches: matches.length };
}

export async function getCategoryPage(categoryId: string, page: number) {
  const all = await topicHadiths(categoryId);
  return {
    hadiths: all.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    lastPage: Math.max(1, Math.ceil(all.length / PER_PAGE)),
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

export async function getHadithOfTheDay(date = new Date()) {
  const ids = await getAllHadithIds();
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return getHadith(ids[(day * 7919) % ids.length]);
}

export function hadithHeadline(hadith: Hadith) {
  const strip = (t: string) => t.replace(/^["“„\s]+|["”\s]+$/g, "");
  const title = strip(hadith.title);
  if (/[.!?…]$/.test(title)) return title;
  const text = strip(hadith.text).replace(/[.!?…]+$/, "");
  return text.endsWith(title.replace(/[,;:]+$/, "")) ? `${title.replace(/[,;:]+$/, "")}.` : `${title.replace(/[,;:]+$/, "")}…`;
}
