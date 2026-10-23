import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { getRiyadPage, RIYAD_TOTAL } from "@/lib/riyad";
import RiyadList from "@/components/RiyadList";

export const metadata: Metadata = pageMeta({
  title: "Rijadus Salihin në shqip",
  description: `Rijadus Salihin i Imam Neveviut në shqip: ${RIYAD_TOTAL} hadithe me transmetuesin, me kërkim sipas fjalës ose numrit.`,
  path: "/hadithe/rijadus-salihin",
});

export default function RiyadPage() {
  return <RiyadList hadiths={getRiyadPage(1)} />;
}
