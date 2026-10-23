import data from "@/data/hisn.json";

export type HisnItem = {
  arabic?: string;
  translit?: string | null;
  translation?: string | null;
  text?: string;
  source: string | null;
  audio: string | null;
};

export type HisnChapter = { n: number; title: string; items: HisnItem[] };

export const HISN_SOURCE = "https://mburojaemuslimanit.com";

const chapters: HisnChapter[] = (data as { title: string; items: HisnItem[] }[]).map((c, i) => ({
  n: i + 1,
  ...c,
}));

export const HISN_TOTAL = chapters.length;

export function getChapters() {
  return chapters;
}

export function getChapter(n: number) {
  return chapters[n - 1];
}

export function getDuaOfTheDay(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return chapters[(day * 31) % chapters.length];
}

export function audioUrl(file: string) {
  return `/mburoja/${file}`;
}

export function chapterAsText(c: HisnChapter, url: string) {
  const parts = c.items.map((item) =>
    [item.arabic, item.translit, item.translation, item.text, item.source && `— ${item.source}`]
      .filter(Boolean)
      .join("\n"),
  );
  return `${c.title}\n\n${parts.join("\n\n")}\n\n${url}`;
}
