import { useId } from "react";

export type Icon3DName =
  "moon" | "mosque" | "calendar" | "book" | "scroll" | "cap" | "seal" | "shield" | "star" | "home" | "letters";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff1c9" />
        <stop offset=".45" stopColor="#e6c487" />
        <stop offset="1" stopColor="#9c7438" />
      </linearGradient>
      <linearGradient id={`${id}-green`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5fd3a1" />
        <stop offset=".5" stopColor="#1f8a62" />
        <stop offset="1" stopColor="#0b4a35" />
      </linearGradient>
      <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-shadow`}>
        <stop offset="0" stopColor="#000" stopOpacity=".55" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function Shape({ name, id }: { name: Icon3DName; id: string }) {
  const gold = `url(#${id}-gold)`;
  const green = `url(#${id}-green)`;
  const shine = `url(#${id}-shine)`;

  switch (name) {
    case "moon":
      return (
        <>
          <path d="M38 8a24 24 0 1 0 18 40A20 20 0 1 1 38 8Z" fill={gold} />
          <path
            d="M38 8a24 24 0 0 0-23 16c6-7 15-10 23-9-3-2-3-5 0-7Z"
            fill={shine}
          />
          <path
            d="M50 14l1.6 4 4 1.6-4 1.6L50 25l-1.6-3.8-4-1.6 4-1.6Z"
            fill="#fff4d6"
          />
        </>
      );
    case "mosque":
      return (
        <>
          <rect x="10" y="34" width="44" height="20" rx="3" fill={green} />
          <path d="M14 34c0-10 8-18 18-18s18 8 18 18Z" fill={gold} />
          <path
            d="M18 30c1-7 7-12 14-12"
            stroke="#fff"
            strokeOpacity=".5"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="52" y="20" width="6" height="34" rx="2" fill={green} />
          <path d="M55 12l3 8h-6Z" fill={gold} />
          <path d="M32 6a4 4 0 1 0 3 6.5A3.2 3.2 0 1 1 32 6Z" fill={gold} />
          <path d="M28 54V44a4 4 0 0 1 8 0v10Z" fill="#0b2a22" />
          <rect x="10" y="34" width="44" height="4" fill={shine} />
        </>
      );
    case "calendar":
      return (
        <>
          <rect x="8" y="12" width="48" height="44" rx="8" fill={green} />
          <path d="M8 20a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v6H8Z" fill={gold} />
          <rect x="18" y="6" width="5" height="12" rx="2.5" fill="#e9eef0" />
          <rect x="41" y="6" width="5" height="12" rx="2.5" fill="#e9eef0" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={15 + c * 10}
                y={32 + r * 7.5}
                width="6"
                height="4.5"
                rx="1.5"
                fill={r === 1 && c === 2 ? "#f6dfa8" : "#ffffff"}
                fillOpacity={r === 1 && c === 2 ? 1 : 0.25}
              />
            )),
          )}
          <rect x="8" y="12" width="48" height="6" rx="6" fill={shine} />
        </>
      );
    case "book":
      return (
        <>
          <path d="M10 14c8-3 16-2 22 3v38c-6-5-14-6-22-3Z" fill={green} />
          <path d="M54 14c-8-3-16-2-22 3v38c6-5 14-6 22-3Z" fill={green} />
          <path d="M13 16c7-2 13-1 17 2v32c-4-3-10-4-17-2Z" fill="#f3ead6" />
          <path d="M51 16c-7-2-13-1-17 2v32c4-3 10-4 17-2Z" fill="#e8dcc0" />
          <path d="M32 17v38" stroke={gold} strokeWidth="2.5" />
          <path
            d="M17 24h9M17 29h9M17 34h7M38 24h9M38 29h9M38 34h7"
            stroke="#b08d57"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M42 40l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5Z"
            fill={gold}
          />
        </>
      );
    case "scroll":
      return (
        <>
          <rect x="14" y="12" width="36" height="40" rx="4" fill={gold} />
          <path
            d="M20 22h24M20 28h24M20 34h18M20 40h22"
            stroke="#7a5a2b"
            strokeOpacity=".7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="10" y="8" width="44" height="8" rx="4" fill={green} />
          <rect x="10" y="48" width="44" height="8" rx="4" fill={green} />
          <rect x="12" y="9" width="40" height="3" rx="1.5" fill={shine} />
          <rect x="12" y="49" width="40" height="3" rx="1.5" fill={shine} />
        </>
      );
    case "seal":
      return (
        <>
          <path
            d="M22 40 16 58l8-4 4 7 4-15ZM42 40l6 18-8-4-4 7-4-15Z"
            fill={green}
          />
          <circle cx="32" cy="28" r="20" fill={gold} />
          <circle
            cx="32"
            cy="28"
            r="14"
            fill="none"
            stroke="#9c7438"
            strokeWidth="1.5"
            strokeDasharray="2 2.5"
          />
          <path
            d="m24.5 28 5 5 10-11"
            fill="none"
            stroke="#0b4a35"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 22a17 17 0 0 1 22-10"
            fill="none"
            stroke="#fff"
            strokeOpacity=".5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      );
    case "shield":
      return (
        <>
          <path d="M32 5 54 13v17c0 14-9 24-22 29C19 54 10 44 10 30V13Z" fill={gold} />
          <path d="M32 10 49 16.5V30c0 11-7 19.5-17 23.5C22 49.5 15 41 15 30V16.5Z" fill={green} />
          <path d="M36 21a10 10 0 1 0 7 15.5A8 8 0 1 1 36 21Z" fill={gold} />
          <path d="m25 25 1.2 2.6 2.8.4-2 2 .5 2.8-2.5-1.4-2.5 1.4.5-2.8-2-2 2.8-.4Z" fill="#fff4d6" />
          <path d="M15 17 32 10.5 49 17v4L32 14.5 15 21Z" fill={shine} />
        </>
      );
    case "star":
      return (
        <>
          <rect x="14" y="14" width="36" height="36" rx="3" fill={gold} />
          <rect x="14" y="14" width="36" height="36" rx="3" fill={gold} transform="rotate(45 32 32)" />
          <circle cx="32" cy="32" r="13" fill={green} />
          <circle cx="32" cy="32" r="9.5" fill="none" stroke="#f6dfa8" strokeOpacity=".6" strokeWidth="1.2" />
          <text x="32" y="36.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff4d6" fontFamily="serif">
            99
          </text>
          <path d="M14 17a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v3H14Z" fill={shine} />
        </>
      );
    case "letters":
      return (
        <>
          <rect x="6" y="14" width="30" height="34" rx="7" fill={green} transform="rotate(-8 21 31)" />
          <rect x="28" y="14" width="30" height="34" rx="7" fill={gold} transform="rotate(8 43 31)" />
          <text x="21" y="38" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff4d6" fontFamily="serif" transform="rotate(-8 21 31)">
            ا
          </text>
          <text x="43" y="38" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0b4a35" fontFamily="serif" transform="rotate(8 43 31)">
            ب
          </text>
          <rect x="28" y="14" width="30" height="6" rx="3" fill={shine} transform="rotate(8 43 31)" />
        </>
      );
    case "home":
      return (
        <>
          <path d="M32 8 6 30h7v24h38V30h7Z" fill={green} />
          <path d="M32 8 6 30h7l19-16 19 16h7Z" fill={gold} />
          <path d="M27 54V41a5 5 0 0 1 10 0v13Z" fill={gold} />
          <path d="M13 30h38v4H13Z" fill={shine} />
        </>
      );
    case "cap":
      return (
        <>
          <path d="M18 30v12c0 5 6 9 14 9s14-4 14-9V30Z" fill={green} />
          <path d="M32 12 4 26l28 14 28-14Z" fill={green} />
          <path d="M32 12 4 26l28 14 28-14Z" fill={shine} opacity=".5" />
          <path
            d="M32 26 52 30v14"
            stroke={gold}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="52" cy="47" r="3.5" fill={gold} />
          <circle cx="32" cy="26" r="3" fill={gold} />
        </>
      );
  }
}

export default function Icon3D({
  name,
  className = "size-14",
  still = false,
}: {
  name: Icon3DName;
  className?: string;
  still?: boolean;
}) {
  // Unique per instance: a gradient defined inside a hidden copy (e.g. the desktop nav on mobile) does not render.
  const id = `i3d-${name}${useId().replace(/[^\w-]/g, "")}`;
  return (
    <svg
      viewBox="0 0 64 64"
      className={`icon-3d shrink-0 ${still ? "icon-3d-still" : ""} ${className}`}
      aria-hidden
    >
      <Defs id={id} />
      {!still && (
        <ellipse
          cx="32"
          cy="60"
          rx="20"
          ry="3.5"
          fill={`url(#${id}-shadow)`}
          className="icon-3d-shadow"
        />
      )}
      <g className="icon-3d-body">
        <Shape name={name} id={id} />
      </g>
    </svg>
  );
}
