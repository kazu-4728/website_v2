import Image from 'next/image';
import Link from 'next/link';
import {
  getAreaForOnsen,
  getAreas,
  getArticleImage,
  getArticles,
  getFeaturedAreas,
  getFeaturedOnsens,
  getOnsens,
  getOnsensByArea,
  getPurposes,
  getSiteData,
  kantoOfficialOnsenAreaTotal,
  kantoOfficialSourceTotal,
  kantoOfficialStats,
} from './lib/onsen-site';
import { AreaCard } from './components/site/AreaCard';
import { OnsenCard } from './components/site/OnsenCard';
import { ArticleCard } from './components/site/ArticleCard';
import { ImageCredit } from './components/site/ImageCredit';
import { KantoMap } from './components/site/KantoMap';

const prefectures = ['東京都', '神奈川県', '千葉県', '埼玉県', '群馬県', '栃木県', '茨城県'];

export default function Page() {
  const data = getSiteData();
  const allAreas = getAreas();
  const featuredAreas = getFeaturedAreas();
  const featuredOnsens = getFeaturedOnsens();
  const allOnsens = getOnsens();
  const purposes = getPurposes();
  const articles = getArticles();
  const heroImage = featuredAreas[0].image;
  const prefectureCounts = prefectures.map((prefecture) => ({ prefecture, count: allOnsens.filter((onsen) => onsen.prefecture === prefecture).length }));
  const portalFeatured = allOnsens.filter((onsen) => ['hakone-yumoto', 'kusatsu', 'yugawara', 'nikko-yumoto', 'yoro', 'naguri', 'fukuroda-onsen', 'tsukubasan-onsen', 'inubosaki-onsen'].includes(onsen.slug));
  const spotlightOnsens = portalFeatured.length >= 6 ? portalFeatured : featuredOnsens;

  return (
    <main className="bg-[#f6f0e5] text-[#2e261f]">
      <section className="relative overflow-hidden bg-[#241b15] text-white">
        <div className="absolute inset-0">
          <Image src={heroImage.src} alt={heroImage.alt} fill priority sizes="100vw" className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(213,170,97,0.2),transparent_28%),linear-gradient(115deg,#201710_8%,rgba(36,27,21,0.9)_45%,rgba(36,27,21,0.28)_100%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-24 md:px-8 md:pb-24 md:pt-32">
          <div className="grid items-end gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#d5ad69]/50 bg-[#33251a]/70 px-4 py-2 text-xs font-bold tracking-[0.22em] text-[#efd092] backdrop-blur">関東の湯を、旅の入口に</div>
              <p className="mt-8 text-sm font-bold tracking-[0.32em] text-[#efd092]">{data.home.hero.eyebrow}</p>
              <h1 className="mt-5 max-w-5xl font-serif text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl lg:text-8xl">関東の温泉を、<br /><span className="text-[#efd092]">もっと深く</span>探す。</h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#fff9ee] md:text-lg">{data.home.hero.description} 都県、温泉地、旅の目的から、公式サイトと地図へ迷わず進めます。</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/onsens" className="rounded-full bg-[#efd092] px-7 py-3.5 text-center text-sm font-bold text-[#2e2117] shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ffe5aa]">温泉を探す</Link>
                <Link href="/areas" className="rounded-full border border-[#fff9ee]/55 bg-[#fff9ee]/10 px-7 py-3.5 text-center text-sm font-bold text-white backdrop-blur transition hover:bg-[#fff9ee]/20">エリアから選ぶ</Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-[#fff9ee]/20 bg-[#2f241b]/75 p-5 shadow-2xl backdrop-blur-md md:p-7">
              <p className="text-xs font-bold tracking-[0.28em] text-[#efd092]">KANTO ONSEN PORTAL</p>
              <h2 className="mt-4 font-serif text-3xl font-bold">現在地から、旅の気分から。</h2>
              <p className="mt-3 text-sm leading-7 text-[#eadfce]">日帰り、宿泊、温泉街、家族旅。目的に合う入口から、あなたの湯旅を組み立てます。</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {purposes.slice(0, 4).map((purpose) => <Link key={purpose.id} href={`/purposes/${purpose.slug}`} className="rounded-2xl border border-[#fff9ee]/10 bg-[#fff9ee]/10 p-4 transition hover:bg-[#efd092]/20"><p className="font-serif text-xl font-bold">{purpose.shortLabel}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#d8cbbc]">{purpose.description}</p></Link>)}
              </div>
              <div className="mt-6"><ImageCredit image={heroImage} /></div>
            </div>
          </div>
          <div className="mt-12 border-t border-[#fff9ee]/20 pt-5">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-8">
              <div><p className="font-serif text-3xl font-bold text-[#efd092]">{kantoOfficialOnsenAreaTotal}</p><p className="mt-1 text-xs text-[#d8cbbc]">関東地方の温泉地総数</p></div>
              <div><p className="font-serif text-3xl font-bold text-[#efd092]">{allOnsens.length}</p><p className="mt-1 text-xs text-[#d8cbbc]">当サイト掲載数</p></div>
              <div><p className="font-serif text-3xl font-bold text-[#efd092]">{kantoOfficialSourceTotal.toLocaleString()}</p><p className="mt-1 text-xs text-[#d8cbbc]">関東7都県の源泉総数</p></div>
              <div><p className="font-serif text-3xl font-bold text-[#efd092]">{allAreas.length}</p><p className="mt-1 text-xs text-[#d8cbbc]">掲載エリアガイド</p></div>
            </div>
            <p className="mt-4 max-w-4xl text-xs leading-6 text-[#d8cbbc]">総数は環境省の「{kantoOfficialStats.definition}」を7都県分合算した公的統計です（{kantoOfficialStats.asOf}）。当サイトはこのうち{allOnsens.length}件を個別ページとして掲載しています。<a href={kantoOfficialStats.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1 font-bold text-[#f4cf8b] underline underline-offset-2">統計の出典を確認</a></p>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f0e5] py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.78fr_1.22fr] md:items-center md:px-8">
          <div><p className="text-sm font-bold tracking-[0.24em] text-[#9a8062]">MAP FIRST</p><h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#33291f] md:text-6xl">地図から、<br />行きたい湯を見つける</h2><p className="mt-5 text-base leading-8 text-[#66594d]">関東7都県の実際の境界を描いた地図から、都県をクリックして温泉を探せます。数字は公的な温泉地総数ではなく、当サイトが個別ページで紹介している掲載数です。</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/onsens" className="portal-button-primary">全温泉を一覧で見る</Link><Link href="/areas" className="portal-button-secondary">エリアガイドを見る</Link></div></div>
          <KantoMap counts={prefectureCounts} />
        </div>
      </section>

      <section className="border-b border-[#dfcfb9] bg-[#fffaf0] py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 md:px-8">
          <span className="mr-2 text-sm font-bold text-[#66594d]">都県から探す</span>
          {prefectureCounts.map(({ prefecture, count }) => <Link key={prefecture} href={`/onsens?prefecture=${encodeURIComponent(prefecture)}`} className="rounded-full border border-[#d8c8ae] bg-white px-4 py-2 text-sm font-bold text-[#4b3829] transition hover:border-[#a77a3d] hover:bg-[#f5ead8]">{prefecture.replace('県','').replace('都','')} <span className="ml-1 text-xs text-[#9a8062]">{count}</span></Link>)}
        </div>
      </section>

      <section className="bg-[#f6f0e5] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end"><div><p className="text-sm font-bold tracking-[0.24em] text-[#9a8062]">AREA DIRECTORY</p><h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#33291f] md:text-6xl">温泉地から、<br />旅の輪郭をつくる</h2></div><p className="text-base leading-8 text-[#66594d] md:text-lg">関東は、駅近の温泉街から海辺の湯、山深い秘湯まで表情が豊かです。エリアごとに温泉候補と公式情報を整理しています。</p></div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{featuredAreas.slice(0, 6).map((area, index) => <AreaCard key={area.id} area={area} onsens={getOnsensByArea(area.id)} priority={index < 2} />)}</div>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/areas" className="rounded-full bg-[#4b3829] px-7 py-3 text-sm font-bold text-[#fffaf0] shadow-[0_8px_20px_rgba(75,56,41,0.2)] transition hover:bg-[#2f241c]">11エリアをすべて見る</Link><Link href="/onsens" className="rounded-full border border-[#b99a70] bg-[#fffaf0] px-7 py-3 text-sm font-bold text-[#4b3829] transition hover:bg-[#f5ead8]">温泉一覧へ</Link></div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8"><div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-3xl"><p className="text-sm font-bold tracking-[0.24em] text-[#9a8062]">EDITORIAL PICKS</p><h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#33291f] md:text-6xl">まず知っておきたい<br />関東の名湯と海辺の湯</h2><p className="mt-5 text-base leading-8 text-[#66594d] md:text-lg">群馬の名湯、箱根の湯めぐり、房総の海辺、奥久慈の山里。入口として見やすい温泉をピックアップしました。</p></div><Link href="/onsens" className="rounded-full bg-[#4b3829] px-7 py-3 text-center text-sm font-bold text-[#fffaf0] shadow-[0_8px_20px_rgba(75,56,41,0.2)] transition hover:bg-[#2f241c]">全{allOnsens.length}件を見る</Link></div><div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{spotlightOnsens.slice(0, 6).map((onsen, index) => <OnsenCard key={onsen.slug} onsen={onsen} area={getAreaForOnsen(onsen)} purposes={purposes} priority={index < 3} />)}</div></div>
      </section>

      <section className="bg-[#24444a] py-16 text-white md:py-24"><div className="mx-auto max-w-7xl px-5 md:px-8"><div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end"><div><p className="text-sm font-bold tracking-[0.24em] text-[#efd092]">TRIP PLANNER</p><h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">旅の目的から、<br />ぴったりの湯へ</h2><p className="mt-5 text-base leading-8 text-[#d9e2df]">温泉街を歩きたい、日帰りで整いたい、家族で出かけたい。条件から候補を絞って、公式情報へ進めます。</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{purposes.map((purpose) => <Link key={purpose.id} href={`/purposes/${purpose.slug}`} className="rounded-[1.4rem] border border-white/15 bg-white/10 p-5 transition hover:-translate-y-1 hover:bg-white/20"><h3 className="font-serif text-2xl font-bold">{purpose.shortLabel}</h3><p className="mt-3 text-sm leading-7 text-[#d9e2df]">{purpose.description}</p><span className="mt-5 inline-block text-xs font-bold text-[#efd092]">候補を見る →</span></Link>)}</div></div></div></section>

      <section className="bg-[#f6f0e5] py-16 md:py-24"><div className="mx-auto max-w-7xl px-5 md:px-8"><div className="mb-10"><p className="text-sm font-bold tracking-[0.24em] text-[#9a8062]">PREFECTURE GUIDE</p><h2 className="mt-4 font-serif text-4xl font-bold text-[#33291f] md:text-6xl">都県別の温泉案内</h2></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{prefectureCounts.map(({ prefecture, count }) => <Link key={prefecture} href={`/onsens?prefecture=${encodeURIComponent(prefecture)}`} className="group rounded-[1.5rem] border border-[#d8c8ae] bg-[#fffaf0] p-5 transition hover:-translate-y-1 hover:border-[#a77a3d] hover:shadow-[0_12px_30px_rgba(74,55,35,0.12)]"><div className="flex items-center justify-between"><h3 className="font-serif text-2xl font-bold text-[#4b3829]">{prefecture}</h3><span className="rounded-full bg-[#f1e3c7] px-3 py-1 text-xs font-bold text-[#6c4b22]">{count}件</span></div><p className="mt-3 text-sm leading-7 text-[#66594d]">{prefecture}の温泉地と施設を探す</p><span className="mt-4 inline-block text-sm font-bold text-[#8a5b2b]">一覧を開く →</span></Link>)}</div></div></section>

      <section className="bg-[#fffaf0] py-16 md:py-24"><div className="mx-auto max-w-7xl px-5 md:px-8"><div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-sm font-bold tracking-[0.24em] text-[#9a8062]">ARTICLES</p><h2 className="mt-4 font-serif text-4xl font-bold text-[#33291f] md:text-6xl">温泉旅を選ぶための読みもの</h2></div><Link href="/articles" className="rounded-full bg-[#4b3829] px-7 py-3 text-center text-sm font-bold text-[#fffaf0] transition hover:bg-[#2f241c]">記事一覧へ</Link></div><div className="grid gap-7">{articles.map((article) => <ArticleCard key={article.slug} article={article} image={getArticleImage(article)} />)}</div></div></section>
    </main>
  );
}
