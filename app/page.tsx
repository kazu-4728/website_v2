import { loadContent } from './lib/content';
import { OceanViewHero } from './components/modern/Hero/OceanViewHero';
import { GridSection } from './components/modern/Sections/GridSection';
import { SplitSection } from './components/modern/Sections/SplitSection';
import { isOnsenDoc } from './lib/onsen-types';

export default async function Page() {
  // テーマ設定をロード（サーバーサイド）
  const content = await loadContent();
  const { hero, sections } = content.pages.home;

  // Get onsen pages for display
  const onsenPages = (content.pages.docs || []).filter(isOnsenDoc);

  // Extract section data
  const areaSection = sections.find(s => s.type === 'area-selection');
  const recommendedSection = sections.find(s => s.type === 'recommended-onsen');

  return (
    <>
      {/* Hero Section - Ocean & Sky プレミアムHero */}
      <OceanViewHero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        backgroundImage={hero.bgImage}
        actions={hero.actions}
      />

      {/* エリアから探す - GridSection使用 */}
      {areaSection && 'items' in areaSection && (
        <GridSection
          title={areaSection.title}
          subtitle={areaSection.subtitle}
          description={areaSection.description}
          variant="ocean"
          cards={(areaSection.items as any[]).map((item: any) => ({
            title: item.title,
            description: item.description,
            image: `https://upload.wikimedia.org/wikipedia/commons/f/fa/Kusatsu-yubatake_2004.JPG`,
            href: `/${item.link}`,
            category: 'エリア',
          }))}
        />
      )}

      {/* おすすめ温泉 - GridSection使用 */}
      {recommendedSection && 'items' in recommendedSection && (
        <GridSection
          title={recommendedSection.title}
          subtitle={recommendedSection.subtitle}
          description={recommendedSection.description}
          variant="sky"
          cards={(recommendedSection.items as any[]).map((item: any) => ({
            title: item.title,
            description: item.description,
            image: `https://upload.wikimedia.org/wikipedia/commons/b/b0/%E9%82%A3%E9%A0%88%E6%B9%AF%E6%9C%AC%E6%B8%A9%E6%B3%89_-_panoramio.jpg`,
            href: `/${item.link}`,
            category: 'おすすめ',
          }))}
        />
      )}

      {/* 温泉の選び方 - SplitSection使用 */}
      <SplitSection
        title="温泉の選び方"
        subtitle="How to Choose"
        description="あなたにぴったりの温泉を見つける、3つのシンプルなステップで理想の温泉体験へ。"
        image="https://upload.wikimedia.org/wikipedia/commons/6/6a/Ikaho_Onsen_04.JPG"
        imageAlt="伊香保温泉 石段街"
        imagePosition="right"
        variant="sunset"
        action={{
          label: "温泉を探す",
          href: "#onsen-list",
        }}
      />
    </>
  );
}
