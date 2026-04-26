export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] px-5 py-24 text-stone-950 md:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200 md:p-12">
        <p className="text-sm font-bold tracking-[0.24em] text-stone-400">LOADING</p>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">温泉候補を読み込んでいます</h1>
        <div className="mt-8 space-y-4">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-stone-200" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-stone-200" />
          <div className="grid gap-4 pt-4 md:grid-cols-2">
            <div className="h-48 animate-pulse rounded-3xl bg-stone-200" />
            <div className="h-48 animate-pulse rounded-3xl bg-stone-200" />
          </div>
        </div>
      </div>
    </main>
  );
}
