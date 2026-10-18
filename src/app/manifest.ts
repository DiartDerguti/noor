import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Noor · Kurani dhe Hadithi në shqip",
    short_name: "Noor",
    description: "Kurani me përkthimet shqip dhe hadithe nga Buhariu e Muslimi.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1714",
    theme_color: "#0f1714",
    lang: "sq",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
