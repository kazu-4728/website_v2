import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] px-5 py-24 text-stone-950 md:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-stone-200 md:p-12">
        <p className="text-sm font-bold tracking-[0.24em] text-stone-400">404</p>
        <h1 className="mt-4 font-serif text-5xl font-bold leading-tight md:text-7xl">ページが見つかりません</h1>
        <p className="mt-6 text-base leading-8 text-stone-600">
          URLが変わったか、旧テンプレート時代のページが削除された可能性があります。現在の主導線から探し直してください。
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-stone-950 px-6 py-3 text-sm font-bold text-white">トップへ戻る</Link>
          <Link href="/onsens" className="rounded-full border border-stone-300 px-6 py-3 text-sm font-bold text-stone-900">温泉一覧を見る</Link>
          <Link href="/areas" className="rounded-full border border-stone-300 px-6 py-3 text-sm font-bold text-stone-900">エリアから探す</Link>
        </div>
      </div>
    </main>
  );
}
