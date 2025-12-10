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
import { CinematicHero } from './components/home/CinematicHero';
import { FullscreenHero } from './components/home/FullscreenHero';
import { SplitFeature } from './components/home/SplitFeature';
import { GridGallery } from './components/home/GridGallery';
import { Testimonials } from './components/home/Testimonials';
import { CtaFullscreen } from './components/home/CtaFullscreen';
import { Steps } from './components/home/Steps';
import { AreaSelection } from './components/home/AreaSelection';
import { RecommendedOnsen } from './components/home/RecommendedOnsen';
import { OnsenList } from './components/home/OnsenList';
import { isOnsenDoc } from './lib/onsen-types';

export default async function Page() {
  // テーマ設定をロード（サーバーサイド）
  const content = await loadContent();
  const { hero, sections } = content.pages.home;

  // Get onsen pages for OnsenList component
  const onsenPages = (content.pages.docs || []).filter(isOnsenDoc);

  return (
    <main className="bg-dark-950 min-h-screen selection:bg-primary-500/30">
      {/* Hero Section - 「あえの風」レベルのフルスクリーンHero */}
      {hero.type === 'fullscreen-slider' ? (
        <FullscreenHero data={hero} />
      ) : (
        <CinematicHero data={hero} />
      )}

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
