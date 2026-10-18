import { ImageResponse } from "next/og";

const SKY = "#0b2a22";
const GOLD = "#e6c992";

export function Crescent({ size }: { size: number }) {
  const moon = size * 0.52;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        background: SKY,
        border: `${Math.max(1, size * 0.02)}px solid rgba(212,177,120,.4)`,
        position: "relative",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: size * 0.2,
          top: size * 0.24,
          width: moon,
          height: moon,
          borderRadius: "50%",
          background: GOLD,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: size * 0.33,
          top: size * 0.16,
          width: moon * 0.85,
          height: moon * 0.85,
          borderRadius: "50%",
          background: SKY,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: size * 0.68,
          top: size * 0.62,
          width: size * 0.07,
          height: size * 0.07,
          borderRadius: "50%",
          background: GOLD,
        }}
      />
    </div>
  );
}

export const OG_SIZE = { width: 1200, height: 630 };

export function ogImage({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0f1f19 0%, #070e0b 100%)",
          color: "#ece6d8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Crescent size={88} />
          <div style={{ fontSize: 44, fontWeight: 700 }}>Noor</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow && <div style={{ fontSize: 30, color: "#d4b178", marginBottom: 12 }}>{eyebrow}</div>}
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 34, color: "#9fb0a7", marginTop: 20 }}>{subtitle}</div>
        </div>

        <div style={{ fontSize: 26, color: "#7fcfaa" }}>noor-al.netlify.app</div>
      </div>
    ),
    OG_SIZE,
  );
}

export type CardFormat = "story" | "post" | "link";

export const CARD_SIZES: Record<CardFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  post: { width: 1080, height: 1080 },
  link: OG_SIZE,
};

function clip(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

export function hadithCard({
  format,
  quote,
  source,
  label = "Hadith",
}: {
  format: CardFormat;
  quote: string;
  source: string;
  label?: string;
}) {
  const size = CARD_SIZES[format];
  const story = format === "story";
  const link = format === "link";
  const text = clip(quote.replace(/^["“„]+|["”]+$/g, ""), story ? 260 : link ? 150 : 200);
  const fontSize = story ? (text.length > 180 ? 58 : 68) : link ? (text.length > 100 ? 44 : 52) : text.length > 140 ? 50 : 58;
  const pad = story ? 96 : link ? 72 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: pad,
          background: "linear-gradient(160deg, #13261f 0%, #0b1511 55%, #070d0a 100%)",
          color: "#ece6d8",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(212,177,120,.12)",
            filter: "blur(80px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Crescent size={story ? 96 : 76} />
            <div style={{ fontSize: story ? 46 : 38, fontWeight: 700 }}>Noor</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: story ? 28 : 24,
              color: "#d4b178",
              border: "2px solid rgba(212,177,120,.45)",
              borderRadius: 999,
              padding: "10px 24px",
            }}
          >
            {label}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: story ? 200 : 140, lineHeight: 0.6, color: "#d4b178", opacity: 0.5 }}>“</div>
          <div style={{ fontSize, lineHeight: 1.3, fontWeight: 600, marginTop: story ? 24 : 12 }}>{text}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: story ? 56 : 36 }}>
            <div style={{ width: 56, height: 3, background: "#d4b178" }} />
            <div style={{ fontSize: story ? 34 : 28, color: "#d4b178" }}>{source}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: story ? 32 : 26, color: "#9fb0a7" }}>Lexo shpjegimin dhe mësimet</div>
          <div style={{ fontSize: story ? 40 : 32, color: "#7fcfaa", fontWeight: 700 }}>noor-al.netlify.app</div>
        </div>
      </div>
    ),
    size,
  );
}
