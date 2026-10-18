export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 pt-14">
      <div className="mx-auto h-4 w-48 rounded bg-line" />
      <div className="mx-auto mt-4 h-12 w-64 rounded bg-line" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="mt-12 space-y-3">
          <div className="ml-auto h-8 w-4/5 rounded bg-line" />
          <div className="h-4 w-full rounded bg-line/70" />
          <div className="h-4 w-2/3 rounded bg-line/70" />
        </div>
      ))}
    </div>
  );
}
