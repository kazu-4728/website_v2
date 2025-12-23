import {
  loadContent,
  SplitFeatureSection,
  GridGallerySection,
  TestimonialsSection,
  CtaSection,
  StepsSection,
  AreaSelectionSection,
  RecommendedOnsenSection,
  OnsenListSection,
} from './lib/content';
import { OceanViewHero } from './components/modern/Hero/OceanViewHero';
import { SplitFeature } from './components/_legacy/home/SplitFeature';
import { GridGallery } from './components/_legacy/home/GridGallery';
import { Testimonials } from './components/_legacy/home/Testimonials';
import { CtaFullscreen } from './components/_legacy/home/CtaFullscreen';
import { Steps } from './components/_legacy/home/Steps';
import { AreaSelection } from './components/_legacy/home/AreaSelection';
import { RecommendedOnsen } from './components/_legacy/home/RecommendedOnsen';
import { OnsenList } from './components/_legacy/home/OnsenList';
import { isOnsenDoc } from './lib/onsen-types';

export default async function Page() {
  // テーマ設定をロード（サーバーサイド）
  const content = await loadContent();
  const { hero, sections } = content.pages.home;

  // Get onsen pages for OnsenList component
  const onsenPages = (content.pages.docs || []).filter(isOnsenDoc);

  return (
    <main className="min-h-screen selection:bg-primary-500/30">
      {/* Hero Section - Ocean & Sky プレミアムHero */}
      <OceanViewHero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        backgroundImage={hero.bgImage}
        actions={hero.actions}
      />

      {/* Dynamic Sections */}
      <div className="flex flex-col">
        {sections.map((section) => {
          switch (section.type) {
            case 'area-selection':
              return (
                <AreaSelection
                  key={section.id}
                  data={section as AreaSelectionSection}
                />
              );

            case 'recommended-onsen':
              return (
                <RecommendedOnsen
                  key={section.id}
                  data={section as RecommendedOnsenSection}
                />
              );

            case 'onsen-list':
              return (
                <OnsenList
                  key={section.id}
                  data={section as OnsenListSection}
                  onsenPages={onsenPages}
                  texts={content.texts}
                />
              );

            case 'split-feature':
              return (
                <SplitFeature
                  key={section.id}
                  data={section as SplitFeatureSection}
                />
              );

            case 'grid-gallery':
              return (
                <GridGallery
                  key={section.id}
                  data={section as GridGallerySection}
                />
              );

            case 'testimonials':
              return (
                <Testimonials
                  key={section.id}
                  data={section as TestimonialsSection}
                />
              );

            case 'steps':
              return <Steps key={section.id} data={section as StepsSection} />;

            case 'cta-fullscreen':
              return (
                <CtaFullscreen key={section.id} data={section as CtaSection} />
              );

            default:
              return null;
          }
        })}
      </div>
    </main>
  );
}
