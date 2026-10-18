import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Noor · Kurani dhe Hadithi në shqip";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    title: "Kurani dhe Hadithi në shqip",
    subtitle: "Përkthimet e Nahit, Ahmetit e Mehdiut · Hadithe nga Buhariu e Muslimi",
  });
}
