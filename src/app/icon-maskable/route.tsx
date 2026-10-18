import { ImageResponse } from "next/og";
import { Crescent } from "@/lib/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b2a22",
        }}
      >
        <Crescent size={340} />
      </div>
    ),
    { width: 512, height: 512 },
  );
}
