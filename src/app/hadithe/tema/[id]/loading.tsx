export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 pt-16">
      <div className="h-10 w-2/3 rounded bg-line" />
      <div className="mt-3 h-4 w-1/2 rounded bg-line/70" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-line/60" />
        ))}
      </div>
    </div>
  );
}
