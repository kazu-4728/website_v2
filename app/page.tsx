import { loadContent } from './lib/content';
import { CinematicHero } from './components/home/CinematicHero';
import { SplitFeature } from './components/home/SplitFeature';
import { GridGallery } from './components/home/GridGallery';
import { Testimonials } from './components/home/Testimonials';
import { CtaFullscreen } from './components/home/CtaFullscreen';

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
              return <SplitFeature key={section.id} data={section} />;
            
            case 'grid-gallery':
              return <GridGallery key={section.id} data={section} />;
            
            case 'testimonials':
              return <Testimonials key={section.id} data={section} />;
            
            case 'cta-fullscreen':
              return <CtaFullscreen key={section.id} data={section} />;
            
            default:
              return null;
          }
        })}
      </div>
    </main>
  );
}
