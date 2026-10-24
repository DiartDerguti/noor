"use client";

import { useEffect } from "react";

function useDialog(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
}

// Bottom sheet on mobile, centered dialog on larger screens.
export default function Sheet({ onClose, label, children }: { onClose: () => void; label: string; children: React.ReactNode }) {
  useDialog(onClose);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal aria-label={label}>
      <div className="animate-in-fade absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-in-up border-line bg-paper relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] border px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-[2rem] sm:p-8">
        <span className="bg-line mx-auto mb-4 block h-1 w-10 rounded-full sm:hidden" aria-hidden />
        <button
          type="button"
          onClick={onClose}
          aria-label="Mbyll"
          className="border-line text-muted hover:text-ink absolute top-4 right-4 grid size-9 place-items-center rounded-full border transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
