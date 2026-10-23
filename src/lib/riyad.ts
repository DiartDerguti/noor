import data from "@/data/riyad.json";

export type RiyadHadith = { n: string; text: string; by: string };

export const RIYAD_PER_PAGE = 25;
export const RIYAD_SEARCH_LIMIT = 60;
export const RIYAD_SOURCE = "https://mburoja.al/hadithe/";

const hadiths = data as RiyadHadith[];

export const RIYAD_TOTAL = hadiths.length;
export const RIYAD_PAGES = Math.ceil(hadiths.length / RIYAD_PER_PAGE);

export function riyadPath(page = 1) {
  return page > 1 ? `/hadithe/rijadus-salihin/faqe/${page}` : "/hadithe/rijadus-salihin";
}

export function getRiyadPage(page: number) {
  return hadiths.slice((page - 1) * RIYAD_PER_PAGE, page * RIYAD_PER_PAGE);
}

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'`‘]/g, "");

export function searchRiyad(query: string) {
  const q = fold(query.trim());
  const words = q.split(/\s+/).filter(Boolean);
  const found = hadiths.filter((h) => {
    if (h.n.split(/[^\d]+/).includes(q)) return true;
    const hay = fold(`${h.text} ${h.by}`);
    return words.every((w) => hay.includes(w));
  });
  return { hadiths: found.slice(0, RIYAD_SEARCH_LIMIT), matches: found.length };
}
