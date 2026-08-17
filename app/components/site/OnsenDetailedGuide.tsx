import type { OnsenDetailedGuide as OnsenDetailedGuideData } from '../../lib/onsen-guides';

export function OnsenDetailedGuide({ guide }: { guide?: OnsenDetailedGuideData }) {
  if (!guide) return null;

  const items = [
    { step: '01', title: '出発前に整えること', text: guide.planning },
    { step: '02', title: '到着したら確認すること', text: guide.onArrival },
    { step: '03', title: 'この湯を楽しむ視点', text: guide.enjoyment },
    { step: '04', title: '季節と安全の案内', text: guide.seasonalGuide },
  ];

  return (
    <section className="bg-[#efe2cc] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="eyebrow">DETAILED VISIT GUIDE</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#33291f] md:text-5xl">訪問前から湯上がりまで、<br />この湯を知る案内</h2>
            <p className="mt-5 text-base leading-8 text-[#554a40]">{guide.summary}</p>
            <div className="mt-6 rounded-[1.5rem] border border-[#d2b98d] bg-[#fffaf0]/80 p-5">
              <p className="text-xs font-bold tracking-[0.14em] text-[#8c6846]">大切な確認事項</p>
              <p className="mt-2 text-sm leading-7 text-[#4b4036]">{guide.caution}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <article key={item.step} className="rounded-[1.5rem] border border-[#d2b98d] bg-[#fffaf0] p-6 shadow-[0_10px_30px_rgba(92,65,38,0.08)]">
                <p className="font-serif text-3xl font-bold text-[#b77c38]">{item.step}</p>
                <h3 className="mt-4 text-lg font-bold text-[#33291f]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5c5044]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
