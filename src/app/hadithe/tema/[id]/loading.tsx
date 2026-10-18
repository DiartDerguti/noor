export default function Loading() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-line/60" />
      ))}
    </div>
  );
}
