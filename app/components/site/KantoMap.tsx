import Link from 'next/link';
import { kantoMapViewBox, kantoPrefecturePaths } from '../../lib/kanto-map-data';

interface KantoMapProps {
  counts: { prefecture: string; count: number }[];
}

const colors = ['#8e6041', '#9e6a43', '#a8794d', '#b88451', '#c28d55', '#d19b5f', '#dda96c'];

export function KantoMap({ counts }: KantoMapProps) {
  const countMap = new Map(counts.map((item) => [item.prefecture, item.count]));
  const maxCount = Math.max(...counts.map((item) => item.count));

  return (
    <div className="rounded-[2rem] border border-[#cbb18e] bg-[#efe4d1] p-4 shadow-[0_18px_50px_rgba(65,45,25,0.12)] md:p-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-[#d4c09e] bg-[#dce8e5]">
        <div className="flex items-center justify-between gap-4 border-b border-[#c5d4d0] bg-[#f8f3e9] px-5 py-4">
          <div>
            <p className="eyebrow">ACCURATE PREFECTURE MAP</p>
            <h3 className="mt-1 font-serif text-xl font-bold text-[#33291f]">関東7都県から温泉を探す</h3>
          </div>
          <span className="hidden rounded-full bg-[#e8d4b4] px-3 py-1.5 text-xs font-bold text-[#6c4b22] sm:inline-flex">境界データ：都道府県GeoJSON</span>
        </div>
        <div className="relative bg-[#cfe2e4] p-3 md:p-5">
          <svg viewBox={kantoMapViewBox} role="img" aria-labelledby="kanto-map-title kanto-map-description" className="h-auto w-full">
            <title id="kanto-map-title">関東地方7都県の温泉検索マップ</title>
            <desc id="kanto-map-description">都県の実際の境界を描いた地図です。各都県をクリックすると、その都県の温泉一覧へ移動します。</desc>
            <rect width="760" height="560" rx="28" fill="#cfe2e4" />
            <path d="M18 500 C190 454 356 526 742 430" fill="none" stroke="#a9c8ca" strokeWidth="22" opacity=".7" />
            {kantoPrefecturePaths.map((shape, index) => {
              const count = countMap.get(shape.prefecture) ?? 0;
              const fill = colors[Math.min(colors.length - 1, Math.floor((count / maxCount) * colors.length))];
              return (
                <Link key={shape.prefecture} href={`/onsens?prefecture=${encodeURIComponent(shape.prefecture)}`} aria-label={`${shape.prefecture}の温泉${count}件を見る`}>
                  <path d={shape.path} fill={fill} stroke="#fffaf0" strokeWidth="2.4" strokeLinejoin="round" className="cursor-pointer transition hover:brightness-110 focus:outline-none" tabIndex={0}>
                    <title>{`${shape.prefecture}：掲載温泉${count}件`}</title>
                  </path>
                </Link>
              );
            })}
            {counts.map(({ prefecture, count }) => {
              const shape = kantoPrefecturePaths.find((item) => item.prefecture === prefecture);
              if (!shape) return null;
              const x = shape.labelX;
              const y = shape.labelY;
              return <text key={`${prefecture}-label`} x={x} y={y} textAnchor="middle" className="pointer-events-none" fill="#fffaf0" fontSize="17" fontWeight="800" stroke="#4b3829" strokeWidth="3" paintOrder="stroke">{prefecture.replace('県', '').replace('都', '')}<tspan x={x} dy="22" fontSize="13">{count}件掲載</tspan></text>;
            })}
            <text x="28" y="532" fill="#477276" fontSize="12" fontWeight="700">太平洋</text>
            <text x="662" y="532" fill="#477276" fontSize="12" fontWeight="700">房総沖</text>
          </svg>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-[#c5d4d0] bg-[#f8f3e9] px-5 py-4 text-xs font-semibold text-[#5b5145]">
          <span className="rounded-full bg-[#e8d4b4] px-3 py-1.5">都県境界を正確に表示</span>
          <span className="rounded-full bg-[#e8d4b4] px-3 py-1.5">都県をクリックして絞り込み</span>
          <span className="rounded-full bg-[#e8d4b4] px-3 py-1.5">数字は当サイト掲載数</span>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#76624f]">地図データ：日本の都道府県境界GeoJSON（国土地理院「地球地図日本」由来の公開データ）。東京都の島しょ部は本図の表示範囲外です。島しょ温泉は一覧から検索できます。</p>
    </div>
  );
}
