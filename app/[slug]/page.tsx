import { getDocPage, getAllDocSlugs, loadContent } from '../lib/content';
import { MarkdownRenderer } from '../components/_legacy/ui/MarkdownRenderer';
import { TableOfContents } from '../components/_legacy/ui/TableOfContents';
import { ImageCredit } from '../components/_legacy/ui/ImageCredit';
import { GoogleMap } from '../components/_legacy/ui/GoogleMap';
import { getImageMetadata } from '../lib/images';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Bath,
  CarFront,
  CircleHelp,
  Clock3,
  ExternalLink,
  MapPinned,
  Ticket,
} from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

interface GuideCard {
  id: string;
  title: string;
  lead: string;
  items: string[];
  icon: React.ReactNode;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[30px] border border-[#e2d3c1] bg-white/72 p-6 shadow-[0_14px_40px_rgba(53,37,27,0.05)] sm:p-7">
      <h3 className="mb-5 text-xl text-[#2f241c]">{title}</h3>
      <div className="space-y-4 text-[#5f4a3b]">{children}</div>
    </section>
  );
}

function DetailLabel({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[0.72rem] uppercase tracking-[0.24em] text-[#9f7753]">{label}</p>
      <div className="text-[15px] leading-7 text-[#5f4a3b]">{value}</div>
    </div>
  );
}

function GuideSection({ cards }: { cards: GuideCard[] }) {
  return (
    <section className="space-y-6 rounded-[34px] border border-[#dcc9b1] bg-[linear-gradient(180deg,rgba(251,246,239,0.96),rgba(239,229,214,0.92))] p-7 shadow-[0_20px_70px_rgba(53,37,27,0.08)] sm:p-10">
      <div>
        <p className="section-kicker mb-4">Visit Guide</p>
        <h2 className="text-3xl text-[#2f241c] sm:text-4xl">利用案内・アクセス・FAQ</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <section key={card.id} className="rounded-[28px] border border-[#e2d3c1] bg-white/75 p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e1c8] text-[#7d5631]">
              {card.icon}
            </div>
            <h3 className="mb-2 text-xl text-[#2f241c]">{card.title}</h3>
            <p className="mb-4 text-sm leading-7 text-[#6b5546]">{card.lead}</p>
            <ul className="space-y-2 text-sm leading-7 text-[#5f4a3b]">
              {card.items.map((item, index) => (
                <li key={`${card.id}-${index}`}>・{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const page = await getDocPage(slug);

  const content = await loadContent();
  const allDocs = content.pages.docs || [];
  const currentIndex = allDocs.findIndex((p) => p.slug === slug);
  const nextDoc = currentIndex >= 0 && currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;

  if (!page) {
    notFound();
  }

  const imageMetadata = getImageMetadata('onsen', slug);
  const texts = content.texts;
  const onsen = page.onsen;
  const representativeRyokan = onsen?.accommodation?.representativeRyokan?.[0];
  const officialUrl = representativeRyokan?.officialUrl
    ? representativeRyokan.officialUrl.startsWith('http://') || representativeRyokan.officialUrl.startsWith('https://')
      ? representativeRyokan.officialUrl
      : `https://${representativeRyokan.officialUrl}`
    : null;

  const usageItems: string[] = [];
  if (onsen?.accommodation?.dayTripAvailable) usageItems.push('日帰り入浴に対応しています。');
  if (onsen?.accommodation?.dayTripFacilities?.length) {
    usageItems.push(`主な設備: ${onsen.accommodation.dayTripFacilities.join(' / ')}`);
  }
  usageItems.push('混雑しやすい夕方前後を避けると、ゆったり過ごしやすくなります。');

  const accessItems: string[] = [];
  if (onsen?.access?.nearestStation?.name) {
    accessItems.push(
      `${onsen.access.nearestStation.name}${
        onsen.access.nearestStation.walkingTime ? ` 徒歩${onsen.access.nearestStation.walkingTime}分` : ''
      }`
    );
  }
  if (onsen?.access?.fromTokyo?.byTrain) {
    accessItems.push(`電車: ${onsen.access.fromTokyo.byTrain.description}（約${onsen.access.fromTokyo.byTrain.time}分）`);
  }
  if (onsen?.access?.fromTokyo?.byCar) {
    accessItems.push(`車: ${onsen.access.fromTokyo.byCar.description}（約${onsen.access.fromTokyo.byCar.time}分）`);
  }
  if (onsen?.access?.parking) {
    accessItems.push(`駐車場: ${onsen.access.parking.available ? 'あり' : 'なし'}${onsen.access.parking.fee ? ` / ${onsen.access.parking.fee}` : ''}`);
  }
  if (!accessItems.length) {
    accessItems.push('アクセス方法は各施設の最新情報をご確認ください。');
  }

  const faqItems: string[] = [];
  if (onsen?.onsen?.springTypes?.length) {
    faqItems.push(`泉質: ${onsen.onsen.springTypes.join(' / ')}`);
  }
  faqItems.push('タオル・アメニティは施設ごとに提供内容が異なります。事前確認がおすすめです。');
  faqItems.push('刺青・撮影・年齢制限などのルールは施設ごとに運用が異なるため、来訪前に確認しましょう。');

  const guideCards: GuideCard[] = [
    {
      id: 'usage',
      title: 'ご利用案内',
      lead: '初めてでも迷わないよう、先に利用条件を押さえます。',
      items: usageItems,
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      id: 'access',
      title: '交通案内',
      lead: '移動時間・最寄り駅・駐車場をまとめて確認できます。',
      items: accessItems,
      icon: <CarFront className="h-5 w-5" />,
    },
    {
      id: 'faq',
      title: 'よくある質問',
      lead: '持ち物や入浴ルールの不安を先に解消します。',
      items: faqItems,
      icon: <CircleHelp className="h-5 w-5" />,
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f3ea_0%,#f0e4d2_100%)] pb-24 text-[#2f241c]">
      <section className="relative flex min-h-[68vh] items-end overflow-hidden pb-14 pt-28 md:pb-20">
        <div className="absolute inset-0">
          <Image src={page.image} alt={page.title} fill className="object-cover" priority />
          <div className="absolute inset-0 steam-veil" />
          <ImageCredit metadata={imageMetadata} position="bottom-right" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/docs" className="mb-8 inline-flex items-center text-xs uppercase tracking-[0.24em] text-[#f0dbc0] transition-colors hover:text-white">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            {texts.nav.backLinks.docs}
          </Link>

          {page.subtitle && <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[#edd0ac]">{page.subtitle}</p>}
          <h1 className="max-w-4xl text-5xl leading-[1.06] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5.2rem]">
            {page.title}
          </h1>
          <p className="mt-6 max-w-2xl rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(34,23,17,0.44),rgba(18,12,9,0.58))] px-6 py-5 text-base leading-8 text-[#f7efe6] backdrop-blur-md sm:text-lg">
            {page.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#visit-guide" className="btn-premium inline-flex items-center px-5 py-3 text-xs uppercase tracking-[0.2em]">
              <Clock3 className="mr-2 h-4 w-4" />
              利用案内
            </a>
            <a href="#access-map" className="btn-accent inline-flex items-center px-5 py-3 text-xs uppercase tracking-[0.2em]">
              <MapPinned className="mr-2 h-4 w-4" />
              アクセス
            </a>
            <a href="#onsen-faq" className="btn-accent inline-flex items-center px-5 py-3 text-xs uppercase tracking-[0.2em]">
              <Bath className="mr-2 h-4 w-4" />
              FAQ
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-10 grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr),280px] lg:px-8">
        <div className="space-y-8">
          <div className="lg:hidden rounded-[28px] border border-[#e2d3c1] bg-white/70 p-5 shadow-[0_20px_60px_rgba(53,37,27,0.08)]">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm uppercase tracking-[0.24em] text-[#8e6231]">
                <span>{texts.ui.labels.tableOfContents}</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-4 border-t border-[#eadcc9] pt-4">
                <TableOfContents content={page.content} />
              </div>
            </details>
          </div>

          <article className="paper-panel rounded-[34px] p-7 sm:p-10 md:p-12">
            <MarkdownRenderer content={page.content} />
          </article>

          <div id="visit-guide">
            <GuideSection cards={guideCards} />
          </div>

          {onsen && (
            <section className="space-y-6 rounded-[34px] border border-[#dcc9b1] bg-[linear-gradient(180deg,rgba(251,246,239,0.96),rgba(239,229,214,0.92))] p-7 shadow-[0_20px_70px_rgba(53,37,27,0.08)] sm:p-10">
              <div>
                <p className="section-kicker mb-4">Onsen Detail</p>
                <h2 className="text-3xl text-[#2f241c] sm:text-4xl">温泉データ</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {onsen.region && (
                  <DetailSection title="地域">
                    <DetailLabel label="都道府県" value={onsen.region.prefecture} />
                    <DetailLabel label="エリア" value={onsen.region.area} />
                  </DetailSection>
                )}

                {(onsen.onsen?.springTypes || onsen.onsen?.effects || onsen.onsen?.temperature || onsen.onsen?.ph) && (
                  <DetailSection title="泉質・効能">
                    {onsen.onsen?.springTypes && onsen.onsen.springTypes.length > 0 && (
                      <DetailLabel
                        label="泉質"
                        value={
                          <div className="flex flex-wrap gap-2">
                            {onsen.onsen.springTypes.map((type: string, i: number) => (
                              <span key={i} className="rounded-full border border-[#d8bb96] bg-[#f8ead7] px-3 py-1 text-sm text-[#744d26]">
                                {type}
                              </span>
                            ))}
                          </div>
                        }
                      />
                    )}
                    {onsen.onsen?.effects && onsen.onsen.effects.length > 0 && (
                      <DetailLabel
                        label="主な効能"
                        value={
                          <div className="flex flex-wrap gap-2">
                            {onsen.onsen.effects.map((effect: string, i: number) => (
                              <span key={i} className="rounded-full border border-[#e4d5c4] bg-white/75 px-3 py-1 text-sm text-[#5f4a3b]">
                                {effect}
                              </span>
                            ))}
                          </div>
                        }
                      />
                    )}
                    {onsen.onsen?.temperature && <DetailLabel label="源泉温度" value={`${onsen.onsen.temperature}℃`} />}
                    {onsen.onsen?.ph && <DetailLabel label="pH値" value={onsen.onsen.ph} />}
                  </DetailSection>
                )}

                {onsen.accommodation && (
                  <DetailSection title="日帰り">
                    <DetailLabel
                      label="利用可否"
                      value={
                        onsen.accommodation.dayTripAvailable ? (
                          <span className="rounded-full border border-[#d8bb96] bg-[#f8ead7] px-3 py-1 text-sm text-[#744d26]">日帰り可能</span>
                        ) : (
                          <span>日帰り不可</span>
                        )
                      }
                    />
                    {onsen.accommodation.dayTripFacilities && onsen.accommodation.dayTripFacilities.length > 0 && (
                      <DetailLabel
                        label="設備"
                        value={
                          <ul className="space-y-1">
                            {onsen.accommodation.dayTripFacilities.map((facility: string, i: number) => (
                              <li key={i}>・{facility}</li>
                            ))}
                          </ul>
                        }
                      />
                    )}
                  </DetailSection>
                )}

                <div id="access-map">
                  {onsen.access && (
                    <DetailSection title="アクセス">
                      {onsen.access.nearestStation && (
                        <DetailLabel
                          label="最寄り駅"
                          value={
                            <>
                              {onsen.access.nearestStation.name}
                              <span className="ml-2 text-[#8d7765]">({onsen.access.nearestStation.line})</span>
                              {onsen.access.nearestStation.walkingTime && <span className="block">徒歩{onsen.access.nearestStation.walkingTime}分</span>}
                            </>
                          }
                        />
                      )}
                      {onsen.access.fromTokyo?.byTrain && (
                        <DetailLabel label="電車" value={`${onsen.access.fromTokyo.byTrain.description} / 約${onsen.access.fromTokyo.byTrain.time}分`} />
                      )}
                      {onsen.access.fromTokyo?.byCar && (
                        <DetailLabel
                          label="車"
                          value={`${onsen.access.fromTokyo.byCar.description} / 約${onsen.access.fromTokyo.byCar.time}分${onsen.access.fromTokyo.byCar.distance ? ` (約${onsen.access.fromTokyo.byCar.distance}km)` : ''}`}
                        />
                      )}
                      {onsen.access.parking && (
                        <DetailLabel
                          label="駐車場"
                          value={`${onsen.access.parking.available ? 'あり' : 'なし'}${onsen.access.parking.fee ? ` (${onsen.access.parking.fee})` : ''}`}
                        />
                      )}
                    </DetailSection>
                  )}
                </div>
              </div>

              {representativeRyokan && (
                <DetailSection title="代表的な旅館">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-[#2f241c]">{representativeRyokan.name}</h4>
                      {representativeRyokan.priceRange && (
                        <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#8e6231]">{representativeRyokan.priceRange}</p>
                      )}
                    </div>

                    {representativeRyokan.features && representativeRyokan.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {representativeRyokan.features.map((feature: string, i: number) => (
                          <span key={i} className="rounded-full border border-[#e4d5c4] bg-white/75 px-3 py-1 text-sm text-[#5f4a3b]">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      {officialUrl && (
                        <a
                          href={officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-premium inline-flex items-center px-5 py-3 text-xs uppercase tracking-[0.2em]"
                        >
                          公式サイト
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      )}
                      {representativeRyokan.mapsUrl && (
                        <a
                          href={representativeRyokan.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-accent inline-flex items-center px-5 py-3 text-xs uppercase tracking-[0.2em]"
                        >
                          Googleマップ
                          <MapPinned className="ml-2 h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </DetailSection>
              )}

              {onsen.region?.coordinates && (
                <DetailSection title="地図">
                  <GoogleMap lat={onsen.region.coordinates.lat} lng={onsen.region.coordinates.lng} label={onsen.name} title={`${onsen.name}の位置`} height={380} />
                </DetailSection>
              )}

              <div id="onsen-faq">
                <DetailSection title="よくある質問（チェックポイント）">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-[#e2d3c1] bg-white/70 p-5">
                      <p className="section-kicker mb-3 text-[0.65rem]">持ち物</p>
                      <p className="text-[#5f4a3b] leading-7">タオル・アメニティ・決済手段は施設で異なります。現地到着前に公式案内を確認しておくと安心です。</p>
                    </div>
                    <div className="rounded-[24px] border border-[#e2d3c1] bg-white/70 p-5">
                      <p className="section-kicker mb-3 text-[0.65rem]">ルール</p>
                      <p className="text-[#5f4a3b] leading-7">撮影可否、刺青可否、年齢制限、混浴有無などは施設ごとの運用差が大きいため、必ず個別ページで確認しましょう。</p>
                    </div>
                  </div>
                </DetailSection>
              </div>

              {onsen.content?.seasons && (
                <DetailSection title="季節ごとの魅力">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {onsen.content.seasons.spring && (
                      <div className="rounded-[24px] border border-[#e2d3c1] bg-white/70 p-5">
                        <p className="section-kicker mb-3 text-[0.65rem]">Spring</p>
                        <p className="text-[#5f4a3b] leading-7">{onsen.content.seasons.spring}</p>
                      </div>
                    )}
                    {onsen.content.seasons.summer && (
                      <div className="rounded-[24px] border border-[#e2d3c1] bg-white/70 p-5">
                        <p className="section-kicker mb-3 text-[0.65rem]">Summer</p>
                        <p className="text-[#5f4a3b] leading-7">{onsen.content.seasons.summer}</p>
                      </div>
                    )}
                    {onsen.content.seasons.autumn && (
                      <div className="rounded-[24px] border border-[#e2d3c1] bg-white/70 p-5">
                        <p className="section-kicker mb-3 text-[0.65rem]">Autumn</p>
                        <p className="text-[#5f4a3b] leading-7">{onsen.content.seasons.autumn}</p>
                      </div>
                    )}
                    {onsen.content.seasons.winter && (
                      <div className="rounded-[24px] border border-[#e2d3c1] bg-white/70 p-5">
                        <p className="section-kicker mb-3 text-[0.65rem]">Winter</p>
                        <p className="text-[#5f4a3b] leading-7">{onsen.content.seasons.winter}</p>
                      </div>
                    )}
                  </div>
                </DetailSection>
              )}
            </section>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {prevDoc ? (
              <Link href={`/docs/${prevDoc.slug}`} className="group rounded-[28px] border border-[#dcc9b1] bg-white/70 p-6 transition-colors hover:bg-white/90">
                <div className="mb-3 text-[0.68rem] uppercase tracking-[0.28em] text-[#9f7753]">{texts.nav.pagination.previous}</div>
                <div className="flex items-center gap-3 text-[#2f241c]">
                  <ArrowLeftIcon className="h-4 w-4 text-[#8e6231] transition-transform group-hover:-translate-x-1" />
                  <span className="text-lg">{prevDoc.title}</span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextDoc ? (
              <Link href={`/docs/${nextDoc.slug}`} className="group rounded-[28px] border border-[#dcc9b1] bg-white/70 p-6 transition-colors hover:bg-white/90">
                <div className="mb-3 text-right text-[0.68rem] uppercase tracking-[0.28em] text-[#9f7753]">{texts.nav.pagination.next}</div>
                <div className="flex items-center justify-end gap-3 text-[#2f241c]">
                  <span className="text-lg">{nextDoc.title}</span>
                  <ArrowRightIcon className="h-4 w-4 text-[#8e6231] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-[28px] border border-[#dcc9b1] bg-white/70 p-6 shadow-[0_18px_50px_rgba(53,37,27,0.06)]">
            <TableOfContents content={page.content} />
          </div>
        </aside>
      </div>
    </main>
  );
}
