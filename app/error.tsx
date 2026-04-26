'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-5 py-24 text-stone-950 md:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-stone-200 md:p-12">
        <p className="text-sm font-bold tracking-[0.24em] text-red-500">ERROR</p>
        <h1 className="mt-4 font-serif text-5xl font-bold leading-tight md:text-7xl">表示中に問題が発生しました</h1>
        <p className="mt-6 text-base leading-8 text-stone-600">
          一時的な問題の可能性があります。再読み込みするか、トップページから温泉候補を探し直してください。
        </p>
        {error.digest && <p className="mt-4 font-mono text-xs text-stone-400">エラーID: {error.digest}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="rounded-full bg-stone-950 px-6 py-3 text-sm font-bold text-white">
            もう一度試す
          </button>
          <Link href="/" className="rounded-full border border-stone-300 px-6 py-3 text-sm font-bold text-stone-900">
            トップへ戻る
          </Link>
          <Link href="/onsens" className="rounded-full border border-stone-300 px-6 py-3 text-sm font-bold text-stone-900">
            温泉一覧を見る
          </Link>
        </div>
      </div>
    </main>
  );
}
