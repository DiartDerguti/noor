import { getHadith, SOURCE_LABEL } from "@/lib/hadith";
import { CARD_SIZES, hadithCard, ogImage } from "@/lib/og";

export const alt = "Hadith nga Buhariu dhe Muslimi";
export const size = CARD_SIZES.link;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const hadith = await getHadith((await params).id);
  if (!hadith) return ogImage({ title: "Hadithe në shqip", subtitle: "Buhariu dhe Muslimi" });
  return hadithCard({ format: "link", quote: hadith.title, source: SOURCE_LABEL[hadith.source] });
}
