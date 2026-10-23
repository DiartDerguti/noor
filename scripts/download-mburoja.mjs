// Downloads Hisnul Muslim (with audio), Rijadus Salihin and the 99 names of Allah into src/data and public/mburoja.
// Run with: node scripts/download-mburoja.mjs
// The audio is then re-encoded for the web: ffmpeg -i in.mp3 -ac 1 -b:a 48k -map_metadata -1 out.mp3
import { mkdir, writeFile, access } from "node:fs/promises";

const HISN = "https://mburojaemuslimanit.com";
const MBUROJA = "https://mburoja.al";

async function get(url, type = "text", attempt = 1) {
  const res = await fetch(url);
  if (res.ok) return type === "buffer" ? Buffer.from(await res.arrayBuffer()) : res[type]();
  if (attempt < 5 && (res.status === 429 || res.status >= 500)) {
    await new Promise((r) => setTimeout(r, 1500 * attempt));
    return get(url, type, attempt + 1);
  }
  throw new Error(`${res.status} ${url}`);
}

// Reads a JS object/array literal that follows `marker` as JSON, without executing any of the downloaded code.
function literal(source, marker) {
  let i = source.indexOf(marker);
  if (i < 0) throw new Error(`Missing ${marker}`);
  i += marker.length - 1;
  let out = "";
  let depth = 0;
  for (; i < source.length; i++) {
    const c = source[i];
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      let raw = "";
      while (source[j] !== c) {
        if (source[j] === "\\") {
          raw += source[j] + source[j + 1];
          j += 2;
        } else raw += source[j++];
      }
      if (c !== '"') raw = raw.replace(/\\(['`])/g, "$1").replace(/"/g, '\\"');
      out += JSON.stringify(JSON.parse(`"${raw.replace(/\n/g, "\\n")}"`));
      i = j;
      continue;
    }
    if (/[\w$]/.test(c) && /[{,]\s*$/.test(out)) {
      let j = i;
      while (/[\w$]/.test(source[j])) j++;
      out += JSON.stringify(source.slice(i, j));
      i = j - 1;
      continue;
    }
    if (c === "!" && /[01]/.test(source[i + 1])) {
      out += String(source[++i] === "0");
      continue;
    }
    out += c;
    if (c === "[" || c === "{") depth++;
    if (c === "]" || c === "}") if (--depth === 0) break;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

async function hisn() {
  const source = await get(`${HISN}/data.js`);
  const titles = literal(source, "const TITLES = [");
  const duas = literal(source, "const DUAS = {");
  if (titles.length !== 132) throw new Error(`Expected 132 titles, got ${titles.length}`);

  const audio = [];
  const chapters = titles.map((title, i) => ({
    title: title.replace(/\s+/g, " ").trim(),
    items: (duas[i + 1] ?? []).map((d) => {
      const file = d.audio ? d.audio.replace(/^MP3\//, "") : null;
      if (file) audio.push(file);
      return d.kind === "note"
        ? { text: d.text, source: d.source ?? null, audio: file }
        : { arabic: d.arabic, translit: d.translit || null, translation: d.translation || null, source: d.source ?? null, audio: file };
    }),
  }));

  await mkdir("public/mburoja", { recursive: true });
  const queue = [...audio];
  const missing = new Set();
  async function worker() {
    while (queue.length) {
      const file = queue.shift();
      const path = `public/mburoja/${file}`;
      if (await access(path).then(() => true, () => false)) continue;
      try {
        await writeFile(path, await get(`${HISN}/MP3/${file}`, "buffer"));
      } catch (e) {
        if (!String(e.message).startsWith("404")) throw e;
        missing.add(file);
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  for (const c of chapters) for (const item of c.items) if (missing.has(item.audio)) item.audio = null;
  console.log(`  ${chapters.length} kapituj, ${audio.length - missing.size} audio, mungojnë: ${[...missing].join(", ") || "asnjë"}`);
  return chapters;
}

async function riyad() {
  const { hadithet } = await get(`${MBUROJA}/hadithe/data/hadithet.json`, "json");
  const list = hadithet
    .map((h) => ({ n: h.numri.replace(/\s*\/\s*/g, "/").trim(), text: h.teksti.trim(), by: h.transmetuesi.trim() }))
    .sort((a, b) => parseInt(a.n) - parseInt(b.n) || a.n.localeCompare(b.n));
  console.log(`  ${list.length} hadithe`);
  return list;
}

async function names() {
  const html = await get(`${MBUROJA}/99emrat/`);
  const bundle = html.match(/src="\.\/(assets\/index-[^"]+\.js)"/)?.[1];
  if (!bundle) throw new Error("99 emrat bundle not found");
  const source = await get(`${MBUROJA}/99emrat/${bundle}`);
  const parts = [...source.matchAll(/(\w+)=\[\{id:(?:1|34|67),arabic:/g)].map((m) => literal(source, `${m[1]}=[`));
  const list = parts
    .flat()
    .sort((a, b) => a.id - b.id)
    .map((n) => ({ n: n.id, arabic: n.arabic, name: n.transliteration, meaning: n.meaning, text: n.description }));
  if (list.length !== 99) throw new Error(`Expected 99 names, got ${list.length}`);
  return list;
}

await mkdir("src/data", { recursive: true });

console.log("Hisnul Muslim…");
await writeFile("src/data/hisn.json", JSON.stringify(await hisn()));

console.log("Rijadus Salihin…");
await writeFile("src/data/riyad.json", JSON.stringify(await riyad()));

console.log("99 emrat…");
await writeFile("src/data/names.json", JSON.stringify(await names()));

console.log("Gati.");
