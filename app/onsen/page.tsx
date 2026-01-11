/**
 * Onsen List Page
 * 
 * 温泉一覧ページ：カード一覧＋エリアフィルタ＋検索
 */

import { SiteShell } from '../../src/ui/layouts/SiteShell';
import { PageContainer } from '../../src/ui/layouts/PageContainer';
import { OnsenCard } from '../../src/ui/components/OnsenCard';
import { AreaFilter } from '../../src/ui/components/AreaFilter';
import { SearchBox } from '../../src/ui/components/SearchBox';
import { Breadcrumbs } from '../../src/ui/components/Breadcrumbs';
import {
  getAllOnsens,
  getAllAreas,
  filterByArea,
  searchByName,
} from '../../src/features/onsen/queries';

interface OnsenListPageProps {
  searchParams: {
    area?: string;
    q?: string;
  };
}

export default async function OnsenListPage({ searchParams }: OnsenListPageProps) {
  const { area, q } = searchParams;

  // フィルタ・検索を適用
  let onsens = await getAllOnsens();
  if (area) {
    onsens = await filterByArea(area);
  }
  if (q) {
    onsens = await searchByName(q);
  }

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
      <PageContainer className="py-12">
        <Breadcrumbs
          items={[
            { label: 'ホーム', href: '/' },
            { label: '温泉一覧' },
          ]}
        />

        <h1 className="text-4xl font-bold mb-8 text-gray-900">温泉一覧</h1>

        {/* Search Box */}
        <SearchBox
          placeholder="温泉名、地域で検索..."
          onSearch={(query) => {
            // Client-side navigation will be handled by the component
          }}
          initialValue={q || ''}
        />

        {/* Area Filter */}
        <AreaFilter
          areas={areas}
          selectedArea={area}
          onAreaChange={(selectedArea) => {
            // Client-side navigation will be handled by the component
          }}
        />

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          {onsens.length}件の温泉が見つかりました
        </p>

        {/* Onsen Cards Grid */}
        {onsens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {onsens.map((onsen) => (
              <OnsenCard key={onsen.id} onsen={onsen} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">該当する温泉が見つかりませんでした。</p>
          </div>
        )}
      </PageContainer>
    </SiteShell>
  );
}
