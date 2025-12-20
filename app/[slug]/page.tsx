import { getDocPage, getAllDocSlugs, loadContent } from '../lib/content';
import { MarkdownRenderer } from '../components/_legacy/ui/MarkdownRenderer';
import { TableOfContents } from '../components/_legacy/ui/TableOfContents';
import { ImageCredit } from '../components/_legacy/ui/ImageCredit';
import { GoogleMap } from '../components/_legacy/ui/GoogleMap';
import { getImageMetadata } from '../lib/images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/_legacy/ui/Button';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const page = await getDocPage(slug);
  
  // 全記事を取得して前後のナビゲーションを計算
  const content = await loadContent();
  const allDocs = content.pages.docs || [];
  const currentIndex = allDocs.findIndex(p => p.slug === slug);
  const nextDoc = currentIndex >= 0 && currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;

  if (!page) {
    notFound();
  }

  // 画像のメタデータを取得（著作権情報）
  const imageMetadata = getImageMetadata('onsen', slug);
  const texts = content.texts;

  return (
    <main className="bg-dark-950 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] flex items-end pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={page.image}
            alt={page.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/30" />
          {/* 画像のクレジット表示 */}
          <ImageCredit metadata={imageMetadata} position="bottom-right" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Link href="/" className="inline-flex items-center text-primary-400 mb-8 hover:text-primary-300 transition-colors">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {texts.nav.backLinks.home}
          </Link>
          
          {page.subtitle && (
            <p className="text-primary-500 font-bold tracking-widest uppercase mb-4 animate-fade-in-up">
              {page.subtitle}
            </p>
          )}
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in-up delay-100 leading-tight">
            {page.title}
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed animate-fade-in-up delay-200 border-l-2 border-primary-500 pl-6">
            {page.description}
          </p>
        </div>
      </div>

      {/* Content Wrapper with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            
            {/* Mobile Table of Contents */}
            <div className="lg:hidden mb-8">
              <details className="card-glass rounded-xl overflow-hidden group">
                <summary className="flex items-center justify-between p-4 font-bold text-white cursor-pointer bg-white/5 hover:bg-white/10 transition-colors list-none">
                  <span>{texts.ui.labels.tableOfContents}</span>
                  <span className="transform group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 border-t border-white/10">
                  <TableOfContents content={page.content} />
                </div>
              </details>
            </div>

            <div className="card-glass rounded-2xl p-8 md:p-12 bg-dark-900/50">
              <MarkdownRenderer content={page.content} />
            </div>

            {/* Onsen Details Section */}
            {page.onsen && (
              <div className="mt-16 card-glass rounded-2xl p-8 md:p-12 bg-dark-900/50">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-primary-500/30 pb-4">
                  温泉データ
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* 地域情報 */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-400 mb-3 uppercase tracking-wider">地域</h3>
                      <div className="space-y-2">
                        <p className="text-white">
                          <span className="text-gray-400">都道府県：</span>
                          {page.onsen.region.prefecture}
                        </p>
                        <p className="text-white">
                          <span className="text-gray-400">エリア：</span>
                          {page.onsen.region.area}
                        </p>
                      </div>
                    </div>

                    {/* 泉質・効能 */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-400 mb-3 uppercase tracking-wider">泉質・効能</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-400 text-sm mb-2">泉質</p>
                          <div className="flex flex-wrap gap-2">
                            {page.onsen.onsen.springTypes.map((type: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-2">主な効能</p>
                          <div className="flex flex-wrap gap-2">
                            {page.onsen.onsen.effects.map((effect: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-dark-800 text-gray-300 rounded-full text-sm border border-dark-700">
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>
                        {page.onsen.onsen.temperature && (
                          <p className="text-gray-300 text-sm">
                            <span className="text-gray-400">源泉温度：</span>
                            {page.onsen.onsen.temperature}℃
                          </p>
                        )}
                        {page.onsen.onsen.ph && (
                          <p className="text-gray-300 text-sm">
                            <span className="text-gray-400">pH値：</span>
                            {page.onsen.onsen.ph}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 日帰り可否 */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-400 mb-3 uppercase tracking-wider">日帰り</h3>
                      <p className="text-white">
                        {page.onsen.accommodation.dayTripAvailable ? (
                          <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                            ✓ 日帰り可能
                          </span>
                        ) : (
                          <span className="text-gray-400">日帰り不可</span>
                        )}
                      </p>
                      {page.onsen.accommodation.dayTripFacilities && page.onsen.accommodation.dayTripFacilities.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {page.onsen.accommodation.dayTripFacilities.map((facility: string, i: number) => (
                            <li key={i} className="text-gray-300 text-sm">・{facility}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* アクセス情報 */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-400 mb-3 uppercase tracking-wider">アクセス</h3>
                      <div className="space-y-4">
                        {page.onsen.access.nearestStation && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">最寄り駅</p>
                            <p className="text-white">
                              {page.onsen.access.nearestStation.name}
                              <span className="text-gray-400 ml-2">({page.onsen.access.nearestStation.line})</span>
                            </p>
                            {page.onsen.access.nearestStation.walkingTime && (
                              <p className="text-gray-300 text-sm mt-1">徒歩{page.onsen.access.nearestStation.walkingTime}分</p>
                            )}
                          </div>
                        )}
                        {page.onsen.access.fromTokyo.byTrain && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">電車でのアクセス</p>
                            <p className="text-white">{page.onsen.access.fromTokyo.byTrain.description}</p>
                            <p className="text-gray-300 text-sm mt-1">所要時間：約{page.onsen.access.fromTokyo.byTrain.time}分</p>
                          </div>
                        )}
                        {page.onsen.access.fromTokyo.byCar && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">車でのアクセス</p>
                            <p className="text-white">{page.onsen.access.fromTokyo.byCar.description}</p>
                            <p className="text-gray-300 text-sm mt-1">
                              所要時間：約{page.onsen.access.fromTokyo.byCar.time}分
                              {page.onsen.access.fromTokyo.byCar.distance && ` (距離：約${page.onsen.access.fromTokyo.byCar.distance}km)`}
                            </p>
                          </div>
                        )}
                        {page.onsen.access.parking && (
                          <div>
                            <p className="text-gray-400 text-sm mb-1">駐車場</p>
                            <p className="text-white">
                              {page.onsen.access.parking.available ? 'あり' : 'なし'}
                              {page.onsen.access.parking.fee && (
                                <span className="text-gray-400 ml-2">({page.onsen.access.parking.fee})</span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 代表旅館 */}
                    {page.onsen.accommodation.representativeRyokan && page.onsen.accommodation.representativeRyokan.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary-400 mb-3 uppercase tracking-wider">代表的な旅館</h3>
                        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                          <h4 className="text-white font-bold mb-2">{page.onsen.accommodation.representativeRyokan[0].name}</h4>
                          {page.onsen.accommodation.representativeRyokan[0].features && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {page.onsen.accommodation.representativeRyokan[0].features.map((feature: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-dark-700 text-gray-300 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                          {page.onsen.accommodation.representativeRyokan[0].priceRange && (
                            <p className="text-primary-400 text-sm mb-3">{page.onsen.accommodation.representativeRyokan[0].priceRange}</p>
                          )}
                          {/* リンクボタン */}
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dark-700">
                            {page.onsen.accommodation.representativeRyokan[0].officialUrl && (() => {
                              const officialUrl = page.onsen.accommodation.representativeRyokan[0].officialUrl || '';
                              // basePathの影響を受けないように、外部URLを確実に外部リンクとして扱う
                              // hrefに直接https://で始まるURLを指定することで、Next.jsが内部ルートとして扱うのを防ぐ
                              return (
                                <a
                                  href={officialUrl.startsWith('http://') || officialUrl.startsWith('https://') ? officialUrl : `https://${officialUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 bg-primary-500/20 text-primary-300 rounded-lg border border-primary-500/30 hover:bg-primary-500/30 transition-colors text-sm font-medium"
                                >
                                  公式サイト
                                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                                </a>
                              );
                            })()}
                            {page.onsen.accommodation.representativeRyokan[0].mapsUrl && (
                              <a
                                href={page.onsen.accommodation.representativeRyokan[0].mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-dark-700 text-gray-300 rounded-lg border border-dark-600 hover:bg-dark-600 transition-colors text-sm font-medium"
                              >
                                Googleマップで見る
                                <ArrowRightIcon className="ml-2 w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Map */}
                {page.onsen.region.coordinates && (
                  <div className="mt-12 pt-8 border-t border-dark-800">
                    <h3 className="text-2xl font-bold text-white mb-6">地図</h3>
                    <GoogleMap
                      lat={page.onsen.region.coordinates.lat}
                      lng={page.onsen.region.coordinates.lng}
                      label={page.onsen.name}
                      title={`${page.onsen.name}の位置`}
                      height={400}
                    />
                  </div>
                )}

                {/* 季節ごとの魅力 */}
                {page.onsen.content.seasons && (
                  <div className="mt-12 pt-8 border-t border-dark-800">
                    <h3 className="text-2xl font-bold text-white mb-6">季節ごとの魅力</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {page.onsen.content.seasons.spring && (
                        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                          <h4 className="text-primary-400 font-semibold mb-2">春</h4>
                          <p className="text-gray-300 text-sm">{page.onsen.content.seasons.spring}</p>
                        </div>
                      )}
                      {page.onsen.content.seasons.summer && (
                        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                          <h4 className="text-primary-400 font-semibold mb-2">夏</h4>
                          <p className="text-gray-300 text-sm">{page.onsen.content.seasons.summer}</p>
                        </div>
                      )}
                      {page.onsen.content.seasons.autumn && (
                        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                          <h4 className="text-primary-400 font-semibold mb-2">秋</h4>
                          <p className="text-gray-300 text-sm">{page.onsen.content.seasons.autumn}</p>
                        </div>
                      )}
                      {page.onsen.content.seasons.winter && (
                        <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                          <h4 className="text-primary-400 font-semibold mb-2">冬</h4>
                          <p className="text-gray-300 text-sm">{page.onsen.content.seasons.winter}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation (Next/Prev) */}
            <div className="mt-16 flex flex-col md:flex-row justify-between gap-8">
              {prevDoc ? (
                 <Link href={`/${prevDoc.slug}`} className="group flex-1">
                   <div className="text-sm text-gray-500 mb-2 uppercase tracking-widest">{texts.nav.pagination.previous}</div>
                   <div className="card-glass p-6 rounded-xl group-hover:bg-white/5 transition-colors flex items-center gap-4">
                     <ArrowLeftIcon className="w-5 h-5 text-primary-500 group-hover:-translate-x-1 transition-transform" />
                     <div>
                       <div className="text-white font-bold text-lg">{prevDoc.title}</div>
                     </div>
                   </div>
                 </Link>
              ) : <div className="flex-1" />}

              {nextDoc ? (
                 <Link href={`/${nextDoc.slug}`} className="group flex-1 text-right">
                   <div className="text-sm text-gray-500 mb-2 uppercase tracking-widest">{texts.nav.pagination.next}</div>
                   <div className="card-glass p-6 rounded-xl group-hover:bg-white/5 transition-colors flex items-center justify-end gap-4">
                     <div>
                       <div className="text-white font-bold text-lg">{nextDoc.title}</div>
                     </div>
                     <ArrowRightIcon className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform" />
                   </div>
                 </Link>
              ) : <div className="flex-1" />}
            </div>
          </div>

          {/* Desktop Sidebar Table of Contents */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
             <div className="sticky top-24">
               <div className="card-glass rounded-xl p-6 bg-dark-900/50">
                 <TableOfContents content={page.content} />
               </div>
             </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
