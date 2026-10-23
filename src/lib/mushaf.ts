
export const MUSHAF_LINES = 15;

export function pageFontUrl(page: number) {
  return `https://verses.quran.foundation/fonts/quran/hafs/v1/woff2/p${page}.woff2`;
}

export type MushafLine =
  | { kind: "words"; number: number; words: { code: string; end: boolean; key: string }[] }
  | { kind: "header"; number: number; chapter: number }
  | { kind: "basmala"; number: number; chapter: number };

type Verse = {
  verse_key: string;
  verse_number: number;
  chapter_id: number;
  words: { code_v1: string; line_number: number; char_type_name: string }[];
};

export type MushafPageData = Awaited<ReturnType<typeof getMushafPage>>;

export async function getMushafPages(pages: number[]) {
  return Promise.all(pages.map(getMushafPage));
}

export async function getMushafPage(page: number) {
  const pages = (await import("@/data/mushaf.json")).default as unknown as Record<
    string,
    [string, number, number, [string, number, number][]][]
  >;
  const verses: Verse[] = (pages[String(page)] ?? []).map(([key, verse, chapter, words]) => ({
    verse_key: key,
    verse_number: verse,
    chapter_id: chapter,
    words: words.map(([code, line, end]) => ({ code_v1: code, line_number: line, char_type_name: end ? "end" : "word" })),
  }));

  const byLine = new Map<number, { code: string; end: boolean; key: string }[]>();
  const starts: { chapter: number; line: number }[] = [];

  for (const v of verses) {
    if (v.verse_number === 1) starts.push({ chapter: v.chapter_id, line: v.words[0].line_number });
    for (const w of v.words) {
      const list = byLine.get(w.line_number) ?? [];
      list.push({ code: w.code_v1, end: w.char_type_name === "end", key: v.verse_key });
      byLine.set(w.line_number, list);
    }
  }

  const lines: MushafLine[] = [];
  for (let n = 1; n <= MUSHAF_LINES; n++) {
    const words = byLine.get(n);
    if (words) {
      lines.push({ kind: "words", number: n, words });
      continue;
    }
    const start = starts.find((s) => s.line > n);
    if (!start) continue;
    const gap = start.line - n;
    const hasBasmala = start.chapter !== 1 && start.chapter !== 9;
    if (gap === 1 && hasBasmala) lines.push({ kind: "basmala", number: n, chapter: start.chapter });
    else if (gap === (hasBasmala ? 2 : 1)) lines.push({ kind: "header", number: n, chapter: start.chapter });
  }

  const first = verses[0];
  return { page, lines, firstKey: first?.verse_key ?? "", chapters: [...new Set(verses.map((v) => v.chapter_id))] };
}
