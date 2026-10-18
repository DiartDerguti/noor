import { ImageResponse } from "next/og";
import { Crescent } from "@/lib/og";

export function GET() {
  return new ImageResponse(<Crescent size={192} />, { width: 192, height: 192 });
}
