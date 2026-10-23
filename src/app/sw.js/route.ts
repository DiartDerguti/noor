import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getChapters } from "@/lib/hisn";
import { TOTAL_PAGES } from "@/lib/quran";
import { pageFontUrl } from "@/lib/mushaf";

export const dynamic = "force-static";

// Pages that are cached as they are; every other page is rendered by the offline shell.
const PAGES = ["/offline", "/", "/kurani", "/hadithe", "/hadithe/rijadus-salihin", "/mburoja", "/emrat", "/meso", "/rreth", "/takvimi"];
const ASSETS = ["/manifest.webmanifest", "/icon.svg", "/icon-192", "/icon-512", "/icon-maskable"];

async function files(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return nested.flat();
}

export async function GET() {
  const root = path.join(process.cwd(), ".next", "static");
  const statics = (await files(root))
    .filter((f) => !f.endsWith(".map"))
    .map((f) => `/_next/static/${path.relative(root, f).split(path.sep).join("/")}`)
    .sort();

  const core = [...PAGES, ...ASSETS, ...statics];
  const extra = [
    ...getChapters().flatMap((c) => c.items.flatMap((i) => (i.audio ? [`/mburoja/${i.audio}`] : []))),
    ...Array.from({ length: TOTAL_PAGES }, (_, i) => pageFontUrl(i + 1)),
  ];
  const version = createHash("sha256").update(core.join("\n")).digest("hex").slice(0, 12);

  const source = (await readFile(path.join(process.cwd(), "src", "app", "sw.js", "worker.js"), "utf8"))
    .replace('"__VERSION__"', JSON.stringify(version))
    .replace("__CORE__", JSON.stringify(core))
    .replace("__EXTRA__", JSON.stringify(extra));

  return new Response(source, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
