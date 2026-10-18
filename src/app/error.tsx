"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-3xl font-semibold">Diçka nuk shkoi mirë</h1>
      <p className="mt-3 text-muted">Burimi nuk u përgjigj. Kontrollo lidhjen dhe provo përsëri.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-emerald-deep px-6 py-3 font-medium text-paper hover:opacity-90"
      >
        Provo përsëri
      </button>
    </div>
  );
}
