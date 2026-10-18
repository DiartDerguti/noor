import { OG_SIZE, ogImage } from "@/lib/og";
import { getSurahs, revelationLabel } from "@/lib/quran";

export const alt = "Sure nga Kurani në shqip";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ sure: string }> }) {
  const n = Number((await params).sure);
  const surah = (await getSurahs().catch(() => [])).find((s) => s.number === n);
  if (!surah) {
    return ogImage({ title: "Kurani në shqip", subtitle: "Nahi · Ahmeti · Mehdiu" });
  }
  return ogImage({
    eyebrow: `Sureja ${surah.number}`,
    title: surah.englishName,
    subtitle: `${revelationLabel(surah.revelationType)} · ${surah.numberOfAyahs} ajete · Teksti arab dhe përkthimi shqip`,
  });
}
