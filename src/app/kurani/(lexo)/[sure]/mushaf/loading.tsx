export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 pt-14">
      <div className="bg-line mx-auto h-4 w-48 rounded" />
      <div className="bg-line mx-auto mt-4 h-12 w-64 rounded" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="mt-12 space-y-3">
          <div className="bg-line ml-auto h-8 w-4/5 rounded" />
          <div className="bg-line/70 h-4 w-full rounded" />
          <div className="bg-line/70 h-4 w-2/3 rounded" />
        </div>
      ))}
    </div>
  );
}
