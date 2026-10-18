import { ImageResponse } from "next/og";
import { Crescent } from "@/lib/og";

export function GET() {
  return new ImageResponse(<Crescent size={512} />, { width: 512, height: 512 });
}
