import { OnsenDirectory } from '@/src/components/onsen/OnsenDirectory';
import { SectionHeading } from '@/src/components/shared/SectionHeading';
import { getOnsenOptions, getOnsens } from '@/src/features/onsen';

export default async function OnsenPage() {
  const [onsens, options] = await Promise.all([getOnsens(), getOnsenOptions()]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeading
        eyebrow="Onsen Directory"
        title="景色、泉質、近さで選べる温泉一覧。"
        description="比較の基準を揃えたまま、写真を見て直感でも選べるようにした一覧です。"
      />
      <OnsenDirectory onsens={onsens} options={options} />
    </div>
  );
}
