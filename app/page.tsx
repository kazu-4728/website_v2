import { loadContent, SplitFeatureSection, GridGallerySection, TestimonialsSection, CtaSection, StepsSection } from './lib/content';
import { CinematicHero } from './components/home/CinematicHero';
import { SplitFeature } from './components/home/SplitFeature';
import { GridGallery } from './components/home/GridGallery';
import { Testimonials } from './components/home/Testimonials';
import { CtaFullscreen } from './components/home/CtaFullscreen';
import { Steps } from './components/home/Steps';

export default async function Page() {
  // テーマ設定をロード（サーバーサイド）
  const content = await loadContent();
  const { hero, sections } = content.pages.home;

  return (
    <main className="bg-dark-950 min-h-screen selection:bg-primary-500/30">
      {/* Hero Section */}
      <CinematicHero data={hero} />

      {/* Dynamic Sections */}
      <div className="flex flex-col">
        {sections.map((section) => {
          switch (section.type) {
            case 'split-feature':
              return <SplitFeature key={section.id} data={section as SplitFeatureSection} />;
            
            case 'grid-gallery':
              return <GridGallery key={section.id} data={section as GridGallerySection} />;
            
            case 'testimonials':
              return <Testimonials key={section.id} data={section as TestimonialsSection} />;
            
            case 'steps':
              return <Steps key={section.id} data={section as StepsSection} />;
            
            case 'cta-fullscreen':
              return <CtaFullscreen key={section.id} data={section as CtaSection} />;
            
            default:
              return null;
          }
        })}
      </div>
    </main>
  );
}
