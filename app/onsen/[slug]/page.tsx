/**
 * Onsen Detail Page
 * 
 * 温泉詳細ページ：詳細情報＋画像スロット表示＋アクセス情報
 */

import { notFound } from 'next/navigation';
import { SiteShell } from '../../../../src/ui/layouts/SiteShell';
import { PageContainer } from '../../../../src/ui/layouts/PageContainer';
import { OnsenGallery } from '../../../../src/ui/components/OnsenGallery';
import { Breadcrumbs } from '../../../../src/ui/components/Breadcrumbs';
import { TagList } from '../../../../src/ui/components/TagList';
import { getOnsen } from '../../../../src/features/onsen/queries';
import { getAllOnsens } from '../../../../src/features/onsen/queries';
import { withBasePath } from '../../../lib/base-path';

interface OnsenDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const onsens = await getAllOnsens();
  return onsens.map((onsen) => ({
    slug: onsen.slug,
  }));
}

export default async function OnsenDetailPage({ params }: OnsenDetailPageProps) {
  const { slug } = params;
  const onsen = await getOnsen(slug);

  if (!onsen) {
    notFound();
  }

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
            { label: '温泉一覧', href: '/onsen' },
            { label: onsen.name },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {onsen.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">{onsen.location}</p>
          <TagList tags={onsen.seoTags} />
        </div>

        {/* Hero Image */}
        {onsen.images.hero && (
          <div className="mb-12">
            <img
              src={withBasePath(onsen.images.hero)}
              alt={onsen.name}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">概要</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{onsen.description}</p>
          {onsen.content.shortDescription && (
            <p className="text-gray-700 leading-relaxed mt-4">
              {onsen.content.shortDescription}
            </p>
          )}
        </div>

        {/* Onsen Info */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">温泉情報</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {onsen.onsen.springTypes && onsen.onsen.springTypes.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">泉質</h3>
                  <p className="text-gray-700">{onsen.onsen.springTypes.join('、')}</p>
                </div>
              )}
              {onsen.onsen.temperature && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">温度</h3>
                  <p className="text-gray-700">{onsen.onsen.temperature}℃</p>
                </div>
              )}
              {onsen.onsen.ph !== undefined && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">pH</h3>
                  <p className="text-gray-700">{onsen.onsen.ph}</p>
                </div>
              )}
              {onsen.onsen.effects && onsen.onsen.effects.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">効能</h3>
                  <p className="text-gray-700">{onsen.onsen.effects.join('、')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">ギャラリー</h2>
          <OnsenGallery images={onsen.images} onsenName={onsen.name} />
        </div>

        {/* Access Info */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">アクセス</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            {onsen.access.nearestStation && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">最寄り駅</h3>
                <p className="text-gray-700">
                  {onsen.access.nearestStation.name}（{onsen.access.nearestStation.line}）
                </p>
                {onsen.access.nearestStation.busTime && (
                  <p className="text-gray-700 text-sm mt-1">
                    バスで{onsen.access.nearestStation.busTime}分
                    {onsen.access.nearestStation.busName && `（${onsen.access.nearestStation.busName}）`}
                  </p>
                )}
              </div>
            )}
            {onsen.access.fromTokyo.byTrain && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">電車でお越しの場合</h3>
                <p className="text-gray-700">{onsen.access.fromTokyo.byTrain.description}</p>
                <p className="text-gray-700 text-sm mt-1">
                  約{onsen.access.fromTokyo.byTrain.time}分
                </p>
              </div>
            )}
            {onsen.access.fromTokyo.byCar && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">お車でお越しの場合</h3>
                <p className="text-gray-700">{onsen.access.fromTokyo.byCar.description}</p>
                <p className="text-gray-700 text-sm mt-1">
                  約{onsen.access.fromTokyo.byCar.time}分（{onsen.access.fromTokyo.byCar.distance}km）
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Accommodation Info */}
        {onsen.accommodation && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">施設情報</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                日帰り入浴: {onsen.accommodation.dayTripAvailable ? '可能' : '不可'}
              </p>
              {onsen.accommodation.dayTripFacilities &&
                onsen.accommodation.dayTripFacilities.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-900 mb-2">日帰り入浴施設</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {onsen.accommodation.dayTripFacilities.map((facility, index) => (
                        <li key={index}>{facility}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}
      </PageContainer>
    </SiteShell>
  );
}
