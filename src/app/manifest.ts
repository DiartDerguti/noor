import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Noor · Kurani dhe Hadithi në shqip",
    short_name: "Noor",
    description: "Kurani me përkthimet shqip, hadithe nga Buhariu e Muslimi dhe kohët e namazit.",
    start_url: "/?burimi=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f1714",
    theme_color: "#0f1714",
    lang: "sq",
    dir: "ltr",
    categories: ["education", "lifestyle", "books"],
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Kohët e namazit",
        short_name: "Takvimi",
        url: "/takvimi",
        icons: [{ src: "/icon-192", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Kurani",
        url: "/kurani",
        icons: [{ src: "/icon-192", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Hadithe",
        url: "/hadithe",
        icons: [{ src: "/icon-192", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
