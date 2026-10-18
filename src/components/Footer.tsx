import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Kurani nga <a className="underline-offset-4 hover:underline" href="https://alquran.cloud">alquran.cloud</a>
          {" · "}Hadithet nga <a className="underline-offset-4 hover:underline" href="https://hadeethenc.com">HadeethEnc</a>
        </p>
        <Link href="/rreth" className="underline-offset-4 hover:underline">
          Rreth burimeve
        </Link>
      </div>
    </footer>
  );
}
