// Downloads the Quran and hadith data once from their official sources into src/data.
// Run with: node scripts/download-data.mjs
import { mkdir, writeFile } from "node:fs/promises";

const QURAN_COM = "https://api.quran.com/api/v4/quran/verses/qpc_hafs";
const CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1";
const HADEETHENC = "https://hadeethenc.com/api/v1";
const TRANSLATIONS = ["sqi-hasanefendinahi", "sqi-sherifahmeti", "sqi-fetimehdiu"];

async function json(url, attempt = 1) {
  const res = await fetch(url);
  if (res.ok) return res.json();
  if (attempt < 5 && (res.status === 429 || res.status >= 500)) {
    await new Promise((r) => setTimeout(r, 1500 * attempt));
    return json(url, attempt + 1);
  }
  throw new Error(`${res.status} ${url}`);
}

async function quran() {
  const [arabic, info, ...translations] = await Promise.all([
    json(QURAN_COM),
    json(`${CDN}/info.min.json`),
    ...TRANSLATIONS.map((e) => json(`${CDN}/editions/${e}.min.json`)),
  ]);

  const text = new Map(arabic.verses.map((v) => [v.verse_key, v.text_qpc_hafs.replace(/[\s ]*[٠-٩]+$/, "")]));
  const tr = translations.map((t) => new Map(t.quran.map((v) => [`${v.chapter}:${v.verse}`, v.text])));

  const chapters = info.chapters.map((c) =>
    c.verses.map((v) => {
      const key = `${c.chapter}:${v.verse}`;
      return [v.juz, v.page, v.sajda ? 1 : 0, text.get(key) ?? "", ...tr.map((m) => m.get(key) ?? "")];
    }),
  );

  const total = chapters.reduce((n, c) => n + c.length, 0);
  if (total !== 6236) throw new Error(`Expected 6236 ayahs, got ${total}`);
  return chapters;
}

async function hadith() {
  const roots = await json(`${HADEETHENC}/categories/roots/?language=sq`);
  const categories = [];
  const ids = new Set();
  for (const c of roots) {
    const list = await json(`${HADEETHENC}/hadeeths/list/?language=sq&category_id=${c.id}&page=1&per_page=1000`);
    categories.push({ id: c.id, title: c.title, ids: list.data.map((h) => h.id) });
    list.data.forEach((h) => ids.add(h.id));
  }

  const queue = [...ids];
  const items = {};
  let done = 0;
  async function worker() {
    while (queue.length) {
      const id = queue.shift();
      const h = await json(`${HADEETHENC}/hadeeths/one/?language=sq&id=${id}`);
      items[id] = {
        title: h.title,
        hadeeth: h.hadeeth,
        hadeeth_ar: h.hadeeth_ar,
        explanation: h.explanation,
        hints: h.hints,
        grade: h.grade,
        attribution: h.attribution,
        attribution_ar: h.attribution_ar,
      };
      if (++done % 100 === 0) console.log(`  hadithe: ${done}/${ids.size}`);
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  return { categories, items };
}

async function mushaf() {
  const pages = Array.from({ length: 604 }, (_, i) => i + 1);
  const out = {};
  async function worker() {
    while (pages.length) {
      const page = pages.shift();
      const { verses } = await json(
        `https://api.quran.com/api/v4/verses/by_page/${page}?words=true&word_fields=code_v1,line_number&fields=chapter_id&per_page=50`,
      );
      out[page] = verses.map((v) => [
        v.verse_key,
        v.verse_number,
        v.chapter_id,
        v.words.map((w) => [w.code_v1, w.line_number, w.char_type_name === "end" ? 1 : 0]),
      ]);
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  if (Object.keys(out).length !== 604) throw new Error("Mushaf incomplete");
  return out;
}

await mkdir("src/data", { recursive: true });

if (process.argv.includes("--mushaf")) {
  console.log("Mushafi…");
  await writeFile("src/data/mushaf.json", JSON.stringify(await mushaf()));
  console.log("Gati.");
  process.exit(0);
}

console.log("Mushafi…");
await writeFile("src/data/mushaf.json", JSON.stringify(await mushaf()));


console.log("Kurani…");
await writeFile("src/data/quran.json", JSON.stringify(await quran()));

console.log("Hadithet…");
await writeFile("src/data/hadith.json", JSON.stringify(await hadith()));

console.log("Gati.");
