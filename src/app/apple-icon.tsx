import { ImageResponse } from "next/og";
import { Crescent } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<Crescent size={180} />, size);
}
