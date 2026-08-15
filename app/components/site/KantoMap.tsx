import Link from 'next/link';

interface KantoMapProps {
  counts: { prefecture: string; count: number }[];
}

const positions: Record<string, string> = {
  群馬県: 'left-[21%] top-[20%]',
  栃木県: 'right-[25%] top-[18%]',
  茨城県: 'right-[8%] top-[35%]',
  埼玉県: 'left-[35%] top-[47%]',
  東京都: 'left-[39%] top-[69%]',
  神奈川県: 'left-[29%] top-[82%]',
  千葉県: 'right-[12%] top-[72%]',
};

export function KantoMap({ counts }: KantoMapProps) {
  return (
    <div className="rounded-[2rem] border border-[#cbb18e] bg-[#e9dfce] p-4 shadow-[0_18px_50px_rgba(65,45,25,0.12)] md:p-6">
      <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] border border-[#d4c09e] bg-[radial-gradient(circle_at_50%_45%,#f8f0df_0%,#ead9be_58%,#d6c09e_100%)]">
        <div className="absolute inset-[9%] rounded-[48%_52%_45%_55%] border-2 border-dashed border-[#b59a70]/60 bg-[#f8f0df]/35" />
        <div className="absolute left-[9%] top-[9%] text-xs font-bold tracking-[0.18em] text-[#8f7658]">関東エリア MAP</div>
        <div className="absolute bottom-4 right-5 text-right text-[10px] font-semibold leading-5 text-[#8f7658]">位置関係を簡略化した<br />温泉探しのガイドです</div>
        {counts.map(({ prefecture, count }) => <Link key={prefecture} href={`/onsens?prefecture=${encodeURIComponent(prefecture)}`} className={`absolute ${positions[prefecture]} z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#fffaf0] bg-[#3f3024] px-3 py-2 text-center text-xs font-bold text-[#fffaf0] shadow-[0_6px_14px_rgba(49,34,22,0.25)] transition hover:-translate-x-1/2 hover:-translate-y-[calc(50%+3px)] hover:bg-[#7b4c2e] focus:outline-none focus:ring-4 focus:ring-[#c28d55]/60 md:px-4 md:py-3 md:text-sm`}><span className="block">{prefecture.replace('県','').replace('都','')}</span><span className="mt-1 block text-[10px] font-semibold text-[#f2d596]">{count}湯</span></Link>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#6b5846]"><span className="rounded-full bg-[#fffaf0] px-3 py-1.5">都県をクリック</span><span className="rounded-full bg-[#fffaf0] px-3 py-1.5">温泉数を表示</span><span className="rounded-full bg-[#fffaf0] px-3 py-1.5">一覧へ移動</span></div>
    </div>
  );
}
