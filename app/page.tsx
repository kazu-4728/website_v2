import { loadContent } from './lib/content';
import { 
  isImmersiveStory, 
  isPremiumGrid, 
  isOverlapSection,
  type ImmersiveStorySection,
  type PremiumGridSection,
  type OverlapSection,
} from './lib/theme-types';
import { OceanViewHero } from './components/modern/Hero/OceanViewHero';
import { ImmersiveStorySection as ImmersiveStorySectionComponent } from './components/modern/Sections/ImmersiveStorySection';
import { PremiumGridSection as PremiumGridSectionComponent } from './components/modern/Sections/PremiumGridSection';
import { OverlapSection as OverlapSectionComponent } from './components/modern/Sections/OverlapSection';

export default async function Page() {
  // JSON First - すべてのデータをcontent.jsonから取得
  const content = await loadContent();
  const { hero, sections } = content.pages.home;

  // セクションをタイプ別に取得（JSON駆動・型安全）
  const storySection = sections.find(isImmersiveStory);
  const gridSection = sections.find(isPremiumGrid);
  const experienceSection = sections.find(isOverlapSection);

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

      {/* ストーリーテリング - 没入型セクション */}
      {storySection && (
        <ImmersiveStorySectionComponent
          title={storySection.title}
          subtitle={storySection.subtitle}
          description={storySection.description}
          image={storySection.image}
          overlay={storySection.overlay}
          typography={storySection.typography}
          animation={storySection.animation}
        />
      )}

      {/* エリアから探す - プレミアムグリッド */}
      {gridSection && (
        <PremiumGridSectionComponent
          title={gridSection.title}
          subtitle={gridSection.subtitle}
          description={gridSection.description}
          layout={gridSection.layout}
          variant={gridSection.variant}
          overlay={gridSection.overlay}
          items={gridSection.items}
          learnMoreText={content.texts.buttons.learnMore}
        />
      )}

      {/* 温泉への旅 - オーバーラップレイアウト */}
      {experienceSection && (
        <OverlapSectionComponent
          title={experienceSection.title}
          subtitle={experienceSection.subtitle}
          description={experienceSection.description}
          layout={experienceSection.layout}
          variant={experienceSection.variant}
          image={experienceSection.image}
          typography={experienceSection.typography}
          action={experienceSection.action}
          animation={experienceSection.animation}
        />
      )}
    </>
  );
}
