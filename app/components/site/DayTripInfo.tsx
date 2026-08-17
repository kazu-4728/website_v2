import Link from 'next/link';
import type { DayTripInfo as DayTripInfoData } from '../../lib/onsen-site';

interface Props {
  info?: DayTripInfoData;
}

export function DayTripInfo({ info }: Props) {
  if (!info) return null;

  const items = [
    { label: '営業時間', value: info.hours },
    { label: '休館・注意', value: info.closingNote },
    { label: '料金の目安', value: info.feeNote },
    { label: 'アクセス', value: info.accessNote },
  ].filter((item) => item.value);

  return (
    <section className="bg-[#f1e3c7] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">DAY TRIP GUIDE</p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-[#33291f] md:text-5xl">日帰りで行く前に<br />確認したいこと</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#4b4036]">{info.summary}</p>
            <p className="mt-5 text-xs leading-6 text-[#66594d]">営業状況、料金、年齢・入館条件は変更されることがあります。出発前に公式案内で最新情報をご確認ください。</p>
          </div>
          <div className="rounded-[2rem] border border-[#cbb18e] bg-[#fffaf0] p-5 shadow-[0_16px_50px_rgba(74,55,35,0.08)] md:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {items.map((item) => (
                <div key={item.label} className="border-b border-[#eadfce] pb-5 sm:last:border-b-0">
                  <p className="text-xs font-bold tracking-[0.14em] text-[#8c6846]">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#33291f]">{item.value}</p>
                </div>
              ))}
            </div>
            {info.highlights.length > 0 && (
              <div className="mt-6 border-t border-[#eadfce] pt-5">
                <p className="text-xs font-bold tracking-[0.14em] text-[#8c6846]">日帰りのポイント</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {info.highlights.map((highlight) => (
                    <span key={highlight} className="rounded-full bg-[#f1e3c7] px-3 py-1.5 text-xs font-bold text-[#5a4027]">{highlight}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={info.officialInfoUrl} target="_blank" rel="noopener noreferrer" className="portal-button-primary">料金・営業案内を確認</Link>
              {info.bookingNote && <p className="self-center text-xs font-semibold leading-5 text-[#66594d]">{info.bookingNote}</p>}
            </div>
            <p className="mt-4 text-xs font-semibold text-[#76624f]">情報確認日: {info.verifiedAt}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
