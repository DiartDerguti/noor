import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getCategories } from "@/lib/hadith";

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
    page("/meso", 0.6),
    page("/rreth", 0.4),
  ];
}
