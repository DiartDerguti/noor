"use client";

import { useState } from "react";

type Props = {
  url: string;
  text: string;
  source?: string;
  card?: string;
  full?: string;
  compact?: boolean;
};

const ICONS = {
  whatsapp:
    "M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3ZM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.2 24l6.3-1.7A11.8 11.8 0 0 0 23.8 12c0-3.2-1.2-6.1-3.4-8.4Z",
  facebook: "M14.5 8.5H17V4.6h-2.9c-3.2 0-4.6 1.9-4.6 4.7v2.2H7v3.9h2.5V24h4.1v-8.6h2.9l.5-3.9h-3.4V9.6c0-.7.3-1.1.9-1.1Z",
  x: "M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9L.8 2.3h7l4.8 6.4 5.6-6.4Zm-1.2 17.9h1.9L7 4.2H5Z",
  telegram:
    "M23.9 3.7 20.3 20.6c-.3 1.2-1 1.5-2 .9l-5.4-4-2.6 2.5c-.3.3-.5.5-1.1.5l.4-5.5 10-9c.4-.4 0-.6-.7-.2L6.6 13.5 1.3 11.9c-1.2-.4-1.2-1.2.2-1.7L22.4 2.2c1-.4 1.8.2 1.5 1.5Z",
  copy: "M9 9h11v11H9zM5 15V6a2 2 0 0 1 2-2h9",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
};

function Icon({ d, stroke = false, color }: { d: string; stroke?: boolean; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      style={color ? { color } : undefined}
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : "none"}
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export default function ShareBar({
  url,
  text,
  source,
  card,
  full,
  compact = false,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const quote = text.replace(/^["“„]+|["”]+$/g, "");
  const intro = [
    "*Noor · Hadith*",
    "",
    `_“${quote}”_`,
    ...(source ? [`— ${source}`] : []),
  ].join("\n");
  const message = `${intro}\n\nLexo shpjegimin dhe mësimet:\n${url}`;

  const links: {
    name: string;
    icon: string;
    href: string;
    app?: string;
    color: string;
    hex: string;
  }[] = [
    {
      name: "WhatsApp",
      icon: ICONS.whatsapp,
      hex: "#25D366",
      color: "hover:border-[#25D366]/60",
      href: `https://wa.me/?text=${encodeURIComponent(message)}`,
      app: `whatsapp://send?text=${encodeURIComponent(message)}`,
    },
    {
      name: "Facebook",
      icon: ICONS.facebook,
      hex: "#1877F2",
      color: "hover:border-[#1877F2]/60",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "X",
      icon: ICONS.x,
      hex: "#ffffff",
      color: "hover:border-white/50",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      icon: ICONS.telegram,
      hex: "#26A5E4",
      color: "hover:border-[#26A5E4]/60",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(intro)}`,
    },
  ];

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  }

  async function shareImage(format: "story") {
    if (!card) return;
    setBusy(format);
    try {
      const res = await fetch(`${card}?format=${format}`);
      const blob = await res.blob();
      const file = new File([blob], `noor-${format}.png`, {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: message });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch {
    } finally {
      setBusy(null);
    }
  }

  const button =
    "inline-flex items-center gap-2 rounded-full border border-line bg-paper/50 text-sm text-ink/85 transition-colors hover:border-gold hover:text-ink";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${compact ? "" : "gap-y-3"}`}
    >
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            if (
              l.app &&
              /android|iphone|ipad|ipod/i.test(navigator.userAgent)
            ) {
              e.preventDefault();
              window.location.href = l.app;
            }
          }}
          aria-label={`Ndaje në ${l.name}`}
          title={l.name}
          className={`${button} ${l.color} ${compact ? "size-9 justify-center" : "px-3.5 py-2"}`}
        >
          {l.name === "Facebook" ? (
            <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden>
              <circle cx="12" cy="12" r="12" fill={l.hex} />
              <path
                d="M15.1 8.6h1.7V5.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.2h2.7V24h3.3v-8.5h2.6l.4-3.2h-3v-2.1c0-.9.3-1.6 1.7-1.6Z"
                fill="#fff"
              />
            </svg>
          ) : (
            <Icon d={l.icon} color={l.hex} />
          )}
          {!compact && l.name}
        </a>
      ))}
      <button
        type="button"
        onClick={() => copy(url, "link")}
        className={`${button} ${compact ? "h-9 px-3" : "px-3.5 py-2"}`}
      >
        <Icon d={ICONS.link} stroke />
        {copied === "link" ? "U kopjua" : "Linku"}
      </button>
      {full && (
        <button
          type="button"
          onClick={() => copy(full, "full")}
          className={`${button} ${compact ? "h-9 px-3" : "px-3.5 py-2"}`}
        >
          <Icon d={ICONS.copy} stroke />
          {copied === "full" ? "U kopjua" : "Kopjo hadithin"}
        </button>
      )}
      {card && (
        <button
          type="button"
          onClick={() => shareImage("story")}
          disabled={busy !== null}
          title="Gjeneron një foto 1080×1920 me hadithin, gati për Instagram, WhatsApp Status ose Facebook Story"
          className={`${button} border-gold/50 bg-gold-soft text-gold hover:border-gold ${
            compact ? "h-9 px-3" : "px-3.5 py-2"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="5" y="2" width="14" height="20" rx="3" />
            <circle cx="12" cy="10" r="2.5" />
            <path d="m5 18 4.5-4 3 2.5L15 14l4 4" />
          </svg>
          {busy === "story" ? "Duke gjeneruar foton…" : "Gjenero foto për Story"}
        </button>
      )}
    </div>
  );
}
