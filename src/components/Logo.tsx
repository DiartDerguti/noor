export default function Logo({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="noor-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b2a22" />
          <stop offset="100%" stopColor="#06110d" />
        </linearGradient>
        <radialGradient id="noor-glow" cx="42%" cy="46%" r="46%">
          <stop offset="0%" stopColor="#f6dfa8" stopOpacity=".45" />
          <stop offset="60%" stopColor="#d4b178" stopOpacity=".12" />
          <stop offset="100%" stopColor="#d4b178" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="noor-moon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff4d6" />
          <stop offset="100%" stopColor="#d4b178" />
        </linearGradient>
        <mask id="noor-crescent">
          <rect width="64" height="64" fill="#000" />
          <circle cx="29" cy="32" r="15" fill="#fff" />
          <circle cx="36.5" cy="27" r="12.5" fill="#000" />
        </mask>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#noor-sky)" />
      <rect x=".75" y=".75" width="62.5" height="62.5" rx="15.25" fill="none" stroke="#d4b178" strokeOpacity=".35" strokeWidth="1.5" />
      <circle cx="28" cy="32" r="26" fill="url(#noor-glow)" />
      <rect width="64" height="64" fill="url(#noor-moon)" mask="url(#noor-crescent)" />
      <path d="M45 37.5l1.3 3.2 3.2 1.3-3.2 1.3L45 46.5l-1.3-3.2-3.2-1.3 3.2-1.3Z" fill="#f6dfa8" />
      <circle cx="49.5" cy="20" r="1.2" fill="#f6dfa8" opacity=".8" />
      <circle cx="16" cy="14" r=".9" fill="#f6dfa8" opacity=".55" />
      <circle cx="40" cy="52" r=".8" fill="#f6dfa8" opacity=".5" />
    </svg>
  );
}
