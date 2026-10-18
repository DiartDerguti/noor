import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="arabic text-4xl text-gold">نور</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold">Faqja nuk u gjet</h1>
      <Link href="/" className="mt-6 inline-block text-emerald-deep underline-offset-4 hover:underline">
        Kthehu në fillim
      </Link>
    </div>
  );
}
