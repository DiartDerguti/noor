import { getHadith, SOURCE_LABEL } from "@/lib/hadith";
import { hadithCard, type CardFormat } from "@/lib/og";

const FORMATS: CardFormat[] = ["story", "post", "link"];

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hadith = await getHadith(id);
  if (!hadith) return new Response("Nuk u gjet", { status: 404 });

  const requested = new URL(request.url).searchParams.get("format") as CardFormat;
  const format = FORMATS.includes(requested) ? requested : "post";

  return hadithCard({ format, quote: hadith.title, source: SOURCE_LABEL[hadith.source] });
}
