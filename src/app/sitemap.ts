import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getCategories } from "@/lib/hadith";
import { HISN_TOTAL } from "@/lib/hisn";
import { RIYAD_PAGES } from "@/lib/riyad";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories().catch(() => []);
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority,
  });

  return [
    page("/", 1),
    page("/kurani", 0.9),
    ...Array.from({ length: 114 }, (_, i) => page(`/kurani/${i + 1}`, 0.8)),
    page("/hadithe", 0.9),
    ...categories.map((c) => page(`/hadithe/tema/${c.id}`, 0.7)),
    page("/hadithe/rijadus-salihin", 0.8),
    ...Array.from({ length: RIYAD_PAGES - 1 }, (_, i) => page(`/hadithe/rijadus-salihin/faqe/${i + 2}`, 0.5)),
    page("/mburoja", 0.9),
    ...Array.from({ length: HISN_TOTAL }, (_, i) => page(`/mburoja/${i + 1}`, 0.7)),
    page("/emrat", 0.8),
    page("/takvimi", 0.8),
    page("/meso", 0.6),
    page("/rreth", 0.4),
  ];
}
