import { JournalCard } from '@/src/components/journal/JournalCard';
import { SectionHeading } from '@/src/components/shared/SectionHeading';
import { getJournalEntries } from '@/src/features/journal';

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <SectionHeading
        eyebrow="Journal"
        title="写真から始まる温泉旅を、もう一歩深く読む。"
        description="季節、週末の過ごし方、温泉地ごとの違いを、旅の設計目線でまとめた特集です。"
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {entries.map((entry) => (
          <JournalCard key={entry.slug} article={entry} />
        ))}
      </div>
    </div>
  );
}
