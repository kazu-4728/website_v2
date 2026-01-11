/**
 * Top Page
 * 
 * トップページ：ヒーロー＋エリア導線＋人気/新着温泉
 */

import { SiteShell } from '../src/ui/layouts/SiteShell';
import { PageContainer } from '../src/ui/layouts/PageContainer';
import { Hero } from '../src/ui/components/Hero';
import { OnsenCard } from '../src/ui/components/OnsenCard';
import { getPopularOnsens, getAllAreas } from '../src/features/onsen/queries';
import Link from 'next/link';

export default async function HomePage() {
  // JSONからデータを読み込み
  const popularOnsens = await getPopularOnsens(6);
  const areas = await getAllAreas();

  const navigation = [
    { label: 'ホーム', href: '/' },
    { label: '温泉一覧', href: '/onsen' },
    { label: 'お問い合わせ', href: '/contact' },
  ];

  return (
    <SiteShell
      logo={{ text: '関東温泉紀行', icon: '♨️' }}
      navigation={navigation}
      siteName="関東温泉紀行"
      siteDescription="関東エリアの名湯・秘湯を巡る旅"
    >
      {/* Hero Section */}
      <Hero
        title="あえの風"
        subtitle="Kanto Onsen Collection"
        description="海と空が溶け合う、至福の湯浴み。関東近郊の厳選された絶景温泉宿をご紹介します。"
        backgroundImage="/images/mvp/hero.jpg"
        ctaLabel="宿を探す"
        ctaHref="/onsen"
      />

      {/* Popular Onsens Section */}
      <section className="py-24 bg-gray-50">
        <PageContainer>
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">
              Popular
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6 text-gray-900">
              人気の温泉地
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {popularOnsens.map((onsen) => (
              <OnsenCard key={onsen.id} onsen={onsen} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/onsen"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              すべての温泉を見る
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Area Guide Section */}
      <section className="py-24 bg-white">
        <PageContainer>
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">
              Areas
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6 text-gray-900">
              エリアから探す
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/onsen?area=${encodeURIComponent(area)}`}
                className="block p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                <span className="text-lg font-medium text-gray-900">{area}</span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>
    </SiteShell>
  );
}
