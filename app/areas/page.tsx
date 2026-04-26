import Link from 'next/link';
import { AreaCard } from '../components/site/AreaCard';
import { getAreas, getOnsensByArea, getSiteData } from '../lib/onsen-site';

export function generateMetadata() {
  const data = getSiteData();
  return {
    title: 'エリアから探す',
    description: '関東近郊の温泉候補を、箱根・群馬名湯・日光那須・伊豆熱海・東京近郊などのエリアから探せます。',
    openGraph: {
      title: `エリアから探す | ${data.site.name}`,
      description: '関東近郊の温泉候補をエリアから探せます。',
    },
  };
}

export default function AreasPage() {
  const areas = getAreas();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/" className="text-sm font-bold text-stone-500 hover:text-stone-950">← トップへ戻る</Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">AREA DIRECTORY</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight text-stone-950 md:text-7xl">エリアから温泉候補を絞る。</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              移動距離、街の雰囲気、宿泊向きか日帰り向きかを先に決めると、候補選びが速くなります。
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 md:px-8">
          {areas.map((area, index) => (
            <AreaCard key={area.id} area={area} onsens={getOnsensByArea(area.id)} priority={index < 2} />
          ))}
        </div>
      </section>
    </main>
  );
}
