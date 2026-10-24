import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' https://verses.quran.foundation",
  "connect-src 'self' https://api.aladhan.com https://verses.quran.foundation",
  "media-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  poweredByHeader: false,
  images: {
    // AVIF first (smaller), WebP for older browsers; qualities used by <Image quality> must be listed.
    formats: ["image/avif", "image/webp"],
    qualities: [55, 75],
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/banner/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, immutable" }],
      },
      {
        source: "/mburoja/:file*.mp3",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      {
        source: "/hadithe/:id/karta",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" }],
      },
      {
        source: "/(icon-192|icon-512|icon-maskable)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, immutable" }],
      },
    ];
  },
};

export default nextConfig;
