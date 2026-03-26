import { loadContent } from './lib/content';
import { OceanViewHero } from './components/modern/Hero/OceanViewHero';
import { ImmersiveStorySection } from './components/modern/Sections/ImmersiveStorySection';
import { PremiumGridSection } from './components/modern/Sections/PremiumGridSection';
import { OverlapSection } from './components/modern/Sections/OverlapSection';
import { OnsenList } from './components/_legacy/home/OnsenList';

export default async function Page() {
  const content = await loadContent();
  const { hero, sections } = content.pages.home;

  const storySection = sections.find((s) => s.type === 'immersive-story');
  const gridSection = sections.find((s) => s.type === 'premium-grid');
  const experienceSection = sections.find((s) => s.type === 'overlap-section');
  const onsenListSection = sections.find((s) => s.type === 'onsen-list');

  return (
    <>
      <OceanViewHero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        secondaryDescription={(hero as any).secondaryDescription}
        backgroundImage={hero.bgImage}
        badges={(hero as any).badges}
        actions={hero.actions}
      />

      {storySection && (
        <ImmersiveStorySection
          title={storySection.title}
          subtitle={storySection.subtitle}
          description={storySection.description}
          image={(storySection as any).image}
          overlay={(storySection as any).overlay}
          typography={(storySection as any).typography}
          animation={(storySection as any).animation}
        />
      )}

      {gridSection && 'items' in gridSection && (
        <PremiumGridSection
          title={gridSection.title}
          subtitle={gridSection.subtitle}
          description={gridSection.description}
          layout={(gridSection as any).layout}
          variant={(gridSection as any).variant}
          overlay={(gridSection as any).overlay}
          items={(gridSection as any).items}
        />
      )}

      {experienceSection && (
        <OverlapSection
          title={experienceSection.title}
          subtitle={experienceSection.subtitle}
          description={experienceSection.description}
          layout={(experienceSection as any).layout}
          variant={(experienceSection as any).variant}
          image={(experienceSection as any).image}
          typography={(experienceSection as any).typography}
          action={(experienceSection as any).action}
          animation={(experienceSection as any).animation}
        />
      )}

      {onsenListSection && (
        <OnsenList
          data={onsenListSection as any}
          onsenPages={(content.pages.docs || []) as any}
          texts={content.texts}
        />
      )}
    </>
  );
}
