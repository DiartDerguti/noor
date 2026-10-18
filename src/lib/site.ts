import type { Metadata } from "next";

export const SITE_URL = "https://noor-al.netlify.app";
export const SITE_NAME = "Noor";
export const SITE_TITLE = "Noor · Kurani dhe Hadithi në shqip";
export const SITE_DESCRIPTION =
  "Lexo Kuranin në shqip me përkthimet e Hasan Efendi Nahit, Sherif Ahmetit dhe Feti Mehdiut, dhe hadithe të sakta nga Buhariu e Muslimi me shpjegim.";

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "sq_AL",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${title} · ${SITE_NAME}`, description },
  };
}
