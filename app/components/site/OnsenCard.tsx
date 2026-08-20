import Image from 'next/image';
import Link from 'next/link';
import type { Area, Onsen, PurposeGuide } from '../../lib/onsen-site';
import { getOnsenMedia } from '../../lib/onsen-media';
import { ImageCredit } from './ImageCredit';

interface OnsenCardProps {
  onsen: Onsen;
  area?: Area;
  purposes?: PurposeGuide[];
  priority?: boolean;
  compact?: boolean;
}

export function OnsenCard({ onsen, area, purposes = [], priority = false, compact = false }: OnsenCardProps) {
  const matchedPurposes = purposes.filter((purpose) => onsen.useCases.includes(purpose.id));
  const media = getOnsenMedia(onsen);
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#d8c8ae] bg-[#fffdf8] shadow-[0_16px_50px_rgba(74,55,35,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(74,55,35,0.16)]">
      <Link href={`/onsens/${onsen.slug}`} className="block focus:outline-none focus:ring-4 focus:ring-inset focus:ring-[#c28d55]/70">
        <div className={`relative overflow-hidden ${compact ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          {media.hero ? <Image src={media.hero.src} alt={media.hero.alt} fill priority={priority} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(239,208,146,0.38),transparent_34%),linear-gradient(135deg,#31565a,#1f302e_55%,#4b3829)]" aria-hidden="true" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#201a15]/90 via-[#201a15]/25 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2"><span className="rounded-full bg-[#fffaf0]/95 px-3 py-1 text-xs font-bold text-[#554331]">{onsen.prefecture}</span>{area && <span className="rounded-full bg-[#47382b]/90 px-3 py-1 text-xs font-bold text-[#fffaf0]">{area.name}</span>}</div>
          <div className="absolute bottom-4 left-4 right-4"><p className="text-xs font-bold tracking-[0.18em] text-[#f2d596]">{onsen.kind}</p><h3 className="mt-1 font-serif text-3xl font-bold leading-tight text-white drop-shadow-sm">{onsen.name}</h3><p className="mt-2 text-xs font-bold text-[#fffaf0]">{media.status === 'contextual-external' ? '温泉地・周辺の検証済み外部配信景観画像' : media.status === 'verified-external' ? '検証済みの外部配信地域・施設画像' : `画像 ${media.gallery.length}枚`}・泉質 {onsen.springTypes.filter((item) => !item.includes('詳細')).join(' / ') || '公式情報を確認'}</p></div>
        </div>
      </Link>
      <div className="space-y-5 p-5 md:p-6">
        <p className="text-base font-semibold leading-7 text-[#2e261f]">{onsen.catchcopy}</p>
        <p className="line-clamp-3 text-sm leading-7 text-[#66594d]">{onsen.summary}</p>
        <div className="grid gap-2 rounded-2xl bg-[#f7f0e4] p-4 text-xs"><div><p className="font-bold text-[#8c6846]">入浴の楽しみ</p><p className="mt-1 font-semibold leading-5 text-[#33291f]">{onsen.benefits[0].text}</p></div><div><p className="font-bold text-[#8c6846]">この湯の特徴</p><p className="mt-1 font-semibold leading-5 text-[#33291f]">{onsen.features[0]}</p></div></div>
        <div className="flex flex-wrap gap-2">{matchedPurposes.slice(0, 3).map((purpose) => <span key={purpose.id} className="rounded-full bg-[#f1e3c7] px-3 py-1 text-xs font-bold text-[#6c4b22]">{purpose.shortLabel}</span>)}{onsen.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-[#f5efe5] px-3 py-1 text-xs font-semibold text-[#675b50]">{tag}</span>)}</div>
        <div className="grid gap-2 border-t border-[#eadfce] pt-4 sm:grid-cols-3"><Link href={`/onsens/${onsen.slug}`} className="portal-button-primary">詳細を見る</Link><Link href={onsen.officialUrl} target="_blank" rel="noopener noreferrer" className="portal-button-secondary">公式サイト</Link><Link href={onsen.mapUrl} target="_blank" rel="noopener noreferrer" className="portal-button-secondary">Googleマップ</Link></div>
        <div className="space-y-2 rounded-2xl border border-[#eadfce] bg-[#fffaf0] p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold tracking-[0.14em] text-[#8c6846]">周辺施設・探し方</p><span className="text-xs font-bold text-[#76624f]">{onsen.facilities.length}件</span></div><div className="grid gap-2">{onsen.facilities.slice(0, 3).map((facility) => <div key={facility.name} className="flex items-center justify-between gap-2 text-sm"><span className="truncate font-semibold text-[#4b4036]">{facility.name}</span><div className="flex shrink-0 gap-2"><Link href={facility.url} target="_blank" rel="noopener noreferrer" className="portal-text-link">案内</Link><Link href={facility.mapUrl} target="_blank" rel="noopener noreferrer" className="portal-text-link">地図</Link></div></div>)}</div></div>
        <div className="flex flex-col gap-2 text-xs text-[#76624f]"><span>情報確認日: {onsen.verifiedAt}</span>{media.hero && <ImageCredit image={media.hero} tone="light" />}</div>
      </div>
    </article>
  );
}
