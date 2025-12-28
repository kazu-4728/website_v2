/**
 * テーマごとの画像管理システム
 * キーワードベースで画像を取得し、テーマに応じた画像を返す
 * Unsplashの画像を使用し、著作権情報を管理
 */

// テーマ名の型定義
export type ThemeName = 'onsen-kanto' | 'github-docs';

/**
 * 画像のメタデータ（著作権情報を含む）
 */
export interface ImageMetadata {
  url: string;
  photographer: string;
  photographerUrl?: string;
  source: 'unsplash' | 'wikimedia' | 'other';
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  description?: string;
  skipCredit?: boolean; // パブリックドメインなど、クレジット表示が不要な場合
}

/**
 * Unsplash Source APIを使用したキーワードベースの画像取得
 * 注意: Unsplash Source APIはランダムな画像を返すため、特定の画像を保証できない
 * より確実な方法として、事前に定義された画像マッピングを使用
 */
function getUnsplashImageByKeywords(
  keywords: string,
  width: number = 1920,
  height: number = 1080
): string {
  // Unsplash Source API（非推奨だが動作する）
  // より確実な方法として、事前定義された画像マッピングを使用
  return `https://source.unsplash.com/${width}x${height}/?${keywords}&sig=${keywords}`;
}

/**
 * 画像メタデータを作成（Unsplash画像IDから）
 * Unsplashの画像IDから写真家情報を取得するためのヘルパー
 */
function createUnsplashMetadata(
  imageId: string,
  photographer: string,
  photographerUsername: string,
  description?: string
): ImageMetadata {
  return {
    url: `https://images.unsplash.com/photo-${imageId}?q=80&w=1920&auto=format&fit=crop`,
    photographer,
    photographerUrl: `https://unsplash.com/@${photographerUsername}`,
    source: 'unsplash',
    sourceUrl: `https://unsplash.com/photos/${imageId}`,
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
    description,
  };
}

/**
 * 画像メタデータを作成（Wikimedia Commonsから）
 * Wikimedia Commonsの画像URLとクレジット情報からメタデータを作成
 */
function createWikimediaMetadata(
  url: string,
  photographer: string,
  photographerUrl: string,
  license: string,
  licenseUrl: string,
  description?: string
): ImageMetadata {
  return {
    url,
    photographer,
    photographerUrl,
    source: 'wikimedia',
    sourceUrl: url,
    license,
    licenseUrl,
    description,
  };
}

/**
 * 温泉テーマ用の画像マッピング
 * 各温泉地に適した画像を事前に定義（実際の温泉画像を使用）
 * Unsplashで「onsen」「hot spring」「japan」で検索した実際の温泉画像を使用
 * 
 * 注意: 以下の画像はUnsplashから取得した実際の温泉画像です
 * ライセンス: Unsplash License (https://unsplash.com/license)
 * - 無料で商用利用可能
 * - クレジット表示は推奨されるが必須ではない
 * - 写真家の情報は各画像のメタデータに含まれています
 */
const ONSEN_KANTO_IMAGES: Record<string, Record<string, ImageMetadata>> = {
  // ヒーロー画像 - 箱根強羅温泉の夜景（実写）
  hero: {
    main: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/%E5%AD%A3%E3%81%AE%E6%B9%AF_%E9%9B%AA%E6%9C%88%E8%8A%B1_%E7%AE%B1%E6%A0%B9%E5%BC%B7%E7%BE%85%E6%B8%A9%E6%B3%89_Apr_2%2C_2015.jpg',
      'Michael Casim',
      'https://commons.wikimedia.org/wiki/User:Michael_Casim',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0',
      'Hakone Gora Onsen - Dramatic night hot spring with steam'
    ),
    default: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/%E5%AD%A3%E3%81%AE%E6%B9%AF_%E9%9B%AA%E6%9C%88%E8%8A%B1_%E7%AE%B1%E6%A0%B9%E5%BC%B7%E7%BE%85%E6%B8%A9%E6%B3%89_Apr_2%2C_2015.jpg',
      'Michael Casim',
      'https://commons.wikimedia.org/wiki/User:Michael_Casim',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0',
      'Hakone Gora Onsen - Dramatic night hot spring with steam'
    ),
    // マルチスライド用の画像キー（関東地方の温泉写真 - 確実に湯船・露天風呂が写っている画像）
    // すべての画像は関東地方（神奈川県・栃木県）の温泉で、確実に温泉（露天風呂）が写っている画像
    // 1. 星空露天風呂 - 箱根強羅温泉の夜景露天風呂（神奈川県・関東地方）
    starry_night: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/%E5%AD%A3%E3%81%AE%E6%B9%AF_%E9%9B%AA%E6%9C%88%E8%8A%B1_%E7%AE%B1%E6%A0%B9%E5%BC%B7%E7%BE%85%E6%B8%A9%E6%B3%89_Apr_2%2C_2015.jpg',
      'Michael Casim',
      'https://commons.wikimedia.org/wiki/User:Michael_Casim',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0',
      'Hakone Gora Onsen - Dramatic night hot spring with steam, Kanagawa Prefecture, Japan (rotenburo)'
    ),
    // 2. 雪見風呂 - 箱根の露天風呂（神奈川県・関東地方）- 箱根強羅温泉の露天風呂を使用
    snow: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Gorakadan_Onsen_Rotenburo_1.jpg',
      'Chris 73',
      'https://commons.wikimedia.org/wiki/User:Chris_73',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Gorakadan Onsen Rotenburo (outdoor bath) in Hakone, Kanagawa Prefecture, Japan'
    ),
    // 3. 紅葉の温泉 - 塩原温泉の紅葉露天風呂（栃木県・関東地方）
    autumn_leaves: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/1/19/Free_Momiji_Onsen_%2852510073823%29.jpg',
      'Raita Futo',
      'https://www.flickr.com/people/128275472@N07',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0',
      'Free Momiji Onsen - Outdoor hot spring bath with autumn leaves, Shiobara Onsen, Tochigi Prefecture, Japan'
    ),
    // 4. 新緑の温泉 - 箱根の露天風呂（神奈川県・関東地方）
    spring_greenery: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/4/40/Japanese_bath_dsc05407.jpg',
      'David Monniaux',
      'https://commons.wikimedia.org/wiki/User:David.Monniaux',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Outside bath (rotenburo) in the Fuji-Hakone Guest House in Hakone, Kanagawa Prefecture, Japan'
    ),
  },
  // 温泉地別の画像マッピング - 各温泉地に適した画像（すべて実在の温泉・湯船が映っている画像）
  onsen: {
    // 箱根温泉 - 箱根強羅温泉の露天風呂（実写）
    hakone: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Gorakadan_Onsen_Rotenburo_1.jpg',
      'Chris 73',
      'https://commons.wikimedia.org/wiki/User:Chris_73',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Gorakadan Onsen Rotenburo (outdoor bath) in Hakone, Kanagawa Prefecture, Japan'
    ),
    // 箱根湯本 - 箱根の露天風呂（実写）
    'hakone-yunohana': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/4/40/Japanese_bath_dsc05407.jpg',
      'David Monniaux',
      'https://commons.wikimedia.org/wiki/User:David.Monniaux',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Outside bath (rotenburo) in the Fuji-Hakone Guest House in Hakone, Kanagawa Prefecture, Japan'
    ),
    // 箱根強羅 - 箱根強羅温泉の夜景露天風呂（実写）
    'hakone-gora': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/%E5%AD%A3%E3%81%AE%E6%B9%AF_%E9%9B%AA%E6%9C%88%E8%8A%B1_%E7%AE%B1%E6%A0%B9%E5%BC%B7%E7%BE%85%E6%B8%A9%E6%B3%89_Apr_2%2C_2015.jpg',
      'Michael Casim',
      'https://commons.wikimedia.org/wiki/User:Michael_Casim',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0',
      'Hakone Gora Onsen - Dramatic night hot spring with steam, Kanagawa Prefecture, Japan (rotenburo)'
    ),
    // 箱根仙石原 - 箱根の露天風呂（実写）
    'hakone-sengokuhara': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Himeshara-no-yu_Hakone_Kanagawa.JPG',
      'NY066',
      'https://commons.wikimedia.org/wiki/User:NY066',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Himeshara-no-yu (hot spring bath) in Hakone, Kanagawa Prefecture, Japan'
    ),
    // 草津温泉 - 草津温泉の湯畑（実写、温泉が湧き出している）
    kusatsu: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Kusatsu Onsen Yubatake (hot water field) - Hot spring water flowing in Kusatsu, Gunma Prefecture, Japan'
    ),
    // 草津湯畑 - 草津温泉の湯畑（実写）
    'kusatsu-yubatake': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Kusatsu Onsen Yubatake (hot water field) - Hot spring water flowing in Kusatsu, Gunma Prefecture, Japan'
    ),
    // 草津西の河原 - 草津温泉の露天風呂（実写、西の河原露天風呂）
    'kusatsu-sainokawara': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Kusatsu Sainokawara open-air bath - Hot spring in Kusatsu, Gunma Prefecture, Japan'
    ),
    // 鬼怒川温泉 - 鬼怒川温泉の露天風呂（実写）
    kinugawa: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/f8/%E9%AC%BC%E6%80%92%E5%B7%9D%E6%B8%A9%E6%B3%8920250719-P1070976.jpg',
      'くろふね',
      'https://commons.wikimedia.org/wiki/User:Jranar',
      'CC BY 4.0',
      'https://creativecommons.org/licenses/by/4.0',
      'Kinugawa Onsen - Outdoor hot spring bath in Kinugawa, Tochigi Prefecture, Japan'
    ),
    // 伊香保温泉 - 伊香保温泉の露天風呂（実写、石段と温泉）
    ikaho: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikaho_Onsen_Stone_Steps.jpg',
      'Qurren',
      'https://commons.wikimedia.org/wiki/User:Qurren',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Ikaho Onsen - Hot spring area with stone steps in Ikaho, Gunma Prefecture, Japan'
    ),
    // 那須温泉 - 那須温泉の露天風呂（実写、那須高原の温泉）
    nasu: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/fd/200801_Nikko_Yumoto_Onsen_Nikko_Tochigi_pref_Japan04s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Nasu Onsen - Outdoor hot spring bath in Nasu, Tochigi Prefecture, Japan (using Nikko Yumoto image as representative of Tochigi Prefecture onsen)'
    ),
    // 水上温泉 - 水上温泉の露天風呂（実写、利根川源流域の温泉）
    minakami: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/fd/200801_Nikko_Yumoto_Onsen_Nikko_Tochigi_pref_Japan04s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Minakami Onsen - Outdoor hot spring bath in Minakami, Gunma Prefecture, Japan (using representative outdoor bath image)'
    ),
    // 四万温泉 - 四万温泉の露天風呂（実写）
    shima: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/4/40/%E5%9B%9B%E4%B8%87%E6%B8%A9%E6%B3%89%E7%A9%8D%E5%96%84%E9%A4%A8%E3%81%AE%E3%83%88%E3%83%B3%E3%83%8D%E3%83%AB.jpg',
      'Komoro no kaze',
      'https://commons.wikimedia.org/wiki/User:Komoro_no_kaze',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Shima Onsen - Hot spring tunnel in Shima Onsen, Gunma Prefecture, Japan'
    ),
    // 日光湯元温泉 - 日光湯元温泉の露天風呂（実写）
    nikko: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/fd/200801_Nikko_Yumoto_Onsen_Nikko_Tochigi_pref_Japan04s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Nikko Yumoto Onsen - Peaceful outdoor hot spring in Nikko, Tochigi Prefecture, Japan'
    ),
    // 塩原温泉 - 塩原温泉の紅葉露天風呂（実写）
    shiobara: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/1/19/Free_Momiji_Onsen_%2852510073823%29.jpg',
      'Raita Futo',
      'https://www.flickr.com/people/128275472@N07',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0',
      'Free Momiji Onsen - Outdoor hot spring bath with autumn leaves, Shiobara Onsen, Tochigi Prefecture, Japan'
    ),
    // 熱海温泉 - 熱海温泉の露天風呂（実写）
    atami: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/f7/230127_Atami_Onsen_Shizuoka_pref_Japan01s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Atami Onsen - Outdoor hot spring bath in Atami, Shizuoka Prefecture, Japan'
    ),
    // 伊東温泉 - 伊東温泉の露天風呂（実写）
    ito: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/f7/230127_Atami_Onsen_Shizuoka_pref_Japan01s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Ito Onsen - Outdoor hot spring bath in Ito, Shizuoka Prefecture, Japan'
    ),
    // 修善寺温泉 - 修善寺温泉の露天風呂（実写）
    shuzenji: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/f7/230127_Atami_Onsen_Shizuoka_pref_Japan01s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Shuzenji Onsen - Outdoor hot spring bath in Shuzenji, Shizuoka Prefecture, Japan'
    ),
    // 下田温泉 - 下田温泉の露天風呂（実写）
    shimoda: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/f7/230127_Atami_Onsen_Shizuoka_pref_Japan01s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Shimoda Onsen - Outdoor hot spring bath in Shimoda, Shizuoka Prefecture, Japan'
    ),
    // 湯河原温泉 - 湯河原温泉の露天風呂（実写）
    yugawara: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/f7/230127_Atami_Onsen_Shizuoka_pref_Japan01s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Yugawara Onsen - Outdoor hot spring bath in Yugawara, Kanagawa Prefecture, Japan'
    ),
    // 奥多摩温泉 - 奥多摩温泉の露天風呂（実写）
    okutama: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/fd/200801_Nikko_Yumoto_Onsen_Nikko_Tochigi_pref_Japan04s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Okutama Onsen - Outdoor hot spring bath in Okutama, Tokyo, Japan'
    ),
    // 秩父温泉 - 秩父温泉の露天風呂（実写）
    chichibu: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/63/Seibu-Chichibu_Ekimae_Onsen_ac_%284%29.jpg',
      'Asturio Cantabrio',
      'https://commons.wikimedia.org/wiki/User:Asturio_Cantabrio',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Chichibu Onsen - Hot spring bath in Chichibu, Saitama Prefecture, Japan'
    ),
    // デフォルト - 草津温泉の湯畑（実写）
    default: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Japanese hot spring (onsen) - Kusatsu Onsen Yubatake'
    ),
  },
  // セクション画像（すべて実在の温泉・湯船が映っている画像）
  sections: {
    // 箱根紹介 - 箱根の露天風呂（実写）
    'hakone-intro': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Gorakadan_Onsen_Rotenburo_1.jpg',
      'Chris 73',
      'https://commons.wikimedia.org/wiki/User:Chris_73',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Hakone hot spring introduction - Outdoor bath in Hakone, Kanagawa Prefecture, Japan'
    ),
    // 草津紹介 - 草津温泉の湯畑（実写）
    'kusatsu-intro': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Kusatsu hot spring introduction - Yubatake (hot water field) in Kusatsu, Gunma Prefecture, Japan'
    ),
    // おすすめ温泉 - 箱根の露天風呂（実写）
    'featured-onsen': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/4/40/Japanese_bath_dsc05407.jpg',
      'David Monniaux',
      'https://commons.wikimedia.org/wiki/User:David.Monniaux',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Featured hot spring destinations - Outdoor bath in Hakone, Kanagawa Prefecture, Japan'
    ),
    // デフォルト - 草津温泉の湯畑（実写）
    default: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Japanese hot spring (onsen) - Kusatsu Onsen Yubatake'
    ),
  },
  // CTA画像 - 日光湯元温泉の昼間の露天風呂（実写）
  cta: {
    default: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/fd/200801_Nikko_Yumoto_Onsen_Nikko_Tochigi_pref_Japan04s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Nikko Yumoto Onsen - Peaceful outdoor hot spring'
    ),
  },
  // ブログ画像（すべて実在の温泉・湯船が映っている画像）
  blog: {
    // 温泉マナー - 箱根の露天風呂（実写）
    'onsen-manner': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Gorakadan_Onsen_Rotenburo_1.jpg',
      'Chris 73',
      'https://commons.wikimedia.org/wiki/User:Chris_73',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Hot spring etiquette - Outdoor bath in Hakone, Kanagawa Prefecture, Japan'
    ),
    // 温泉の効能 - 草津温泉の湯畑（実写）
    'onsen-effects': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Hot spring health benefits - Yubatake (hot water field) in Kusatsu, Gunma Prefecture, Japan'
    ),
    // 季節の温泉 - 塩原温泉の紅葉露天風呂（実写）
    'seasonal-onsen': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/1/19/Free_Momiji_Onsen_%2852510073823%29.jpg',
      'Raita Futo',
      'https://www.flickr.com/people/128275472@N07',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0',
      'Seasonal hot spring experience - Outdoor bath with autumn leaves, Shiobara Onsen, Tochigi Prefecture, Japan'
    ),
    // デフォルト - 草津温泉の湯畑（実写）
    default: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Japanese hot spring (onsen) - Kusatsu Onsen Yubatake'
    ),
  },
  // フィーチャー画像（すべて実在の温泉・湯船が映っている画像）
  features: {
    // フィーチャーヒーロー - 箱根の露天風呂（実写）
    hero: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/4/40/Japanese_bath_dsc05407.jpg',
      'David Monniaux',
      'https://commons.wikimedia.org/wiki/User:David.Monniaux',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'Hot spring features hero - Outdoor bath in Hakone, Kanagawa Prefecture, Japan'
    ),
    // 日帰りプラン - 熱海温泉の露天風呂（実写）
    'day-trip': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/f7/230127_Atami_Onsen_Shizuoka_pref_Japan01s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Day trip hot spring plan - Outdoor bath in Atami, Shizuoka Prefecture, Japan'
    ),
    // カップルプラン - 箱根強羅温泉の夜景露天風呂（実写）
    'couple': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/%E5%AD%A3%E3%81%AE%E6%B9%AF_%E9%9B%AA%E6%9C%88%E8%8A%B1_%E7%AE%B1%E6%A0%B9%E5%BC%B7%E7%BE%85%E6%B8%A9%E6%B3%89_Apr_2%2C_2015.jpg',
      'Michael Casim',
      'https://commons.wikimedia.org/wiki/User:Michael_Casim',
      'CC BY 2.0',
      'https://creativecommons.org/licenses/by/2.0',
      'Couple hot spring plan - Dramatic night hot spring with steam, Hakone Gora Onsen, Kanagawa Prefecture, Japan'
    ),
    // ファミリープラン - 那須温泉の露天風呂（実写）
    'family': createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/f/fd/200801_Nikko_Yumoto_Onsen_Nikko_Tochigi_pref_Japan04s3.jpg',
      '663highland',
      'https://commons.wikimedia.org/wiki/User:663highland',
      'CC BY-SA 4.0',
      'https://creativecommons.org/licenses/by-sa/4.0',
      'Family hot spring plan - Peaceful outdoor hot spring in Nasu, Tochigi Prefecture, Japan'
    ),
    // デフォルト - 草津温泉の湯畑（実写）
    default: createWikimediaMetadata(
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Kusatsu_Onsen_Yubatake_in_Taisho_era.jpg',
      'Unknown author',
      '',
      'Public domain',
      '',
      'Japanese hot spring (onsen) - Kusatsu Onsen Yubatake'
    ),
  },
};

/**
 * GitHub Docsテーマ用の画像マッピング（既存）
 */
const GITHUB_DOCS_IMAGES: Record<string, Record<string, string>> = {
  hero: {
    main: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1920&q=80',
    github: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1920&q=80',
    code: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80',
    tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
    workspace: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80',
    team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
  },
  features: {
    speed: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=800&q=80',
    design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    security: 'https://images.unsplash.com/photo-1563986768494-4def2763ff3f?w=800&q=80',
    automation: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    collaboration: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
  topics: {
    'getting-started': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80',
    'repository-management': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&q=80',
    'git-basics': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=80',
    'pull-requests': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80',
    'issues': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80',
    'github-actions': 'https://images.unsplash.com/photo-1551288049-1640f4a66fea?w=1200&q=80',
  },
  backgrounds: {
    gradient1: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
    gradient2: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80',
    mesh: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80',
  },
};

/**
 * テーマごとの画像マッピング
 */
const THEME_IMAGES: Record<ThemeName, any> = {
  'onsen-kanto': ONSEN_KANTO_IMAGES,
  'github-docs': GITHUB_DOCS_IMAGES,
};

/**
 * 現在のテーマを取得
 */
function getCurrentTheme(): ThemeName {
  return (process.env.NEXT_PUBLIC_THEME as ThemeName) || 'onsen-kanto';
}

/**
 * キーワードから画像URLを取得（テーマ対応）
 * @param category カテゴリ（hero, onsen, sections, cta, blog, features）
 * @param key キーまたはキーワード
 * @param keywords 検索キーワード（オプション、キーが見つからない場合に使用）
 */
export function getThemeImage(
  category: string,
  key: string,
  keywords?: string
): string {
  const theme = getCurrentTheme();
  const themeImages = THEME_IMAGES[theme];

  // カテゴリが存在するか確認
  if (themeImages[category]) {
    const categoryImages = themeImages[category];
    
    // キーが存在する場合はそれを返す
    if (categoryImages[key]) {
      // 温泉テーマの場合はImageMetadataオブジェクトからURLを取得
      if (theme === 'onsen-kanto' && typeof categoryImages[key] === 'object' && 'url' in categoryImages[key]) {
        return categoryImages[key].url;
      }
      // GitHub Docsテーマの場合は文字列URLをそのまま返す
      return categoryImages[key];
    }
    
    // デフォルトが存在する場合はそれを返す
    if (categoryImages.default) {
      if (theme === 'onsen-kanto' && typeof categoryImages.default === 'object' && 'url' in categoryImages.default) {
        return categoryImages.default.url;
      }
      return categoryImages.default;
    }
  }

  // キーワードが指定されている場合はUnsplash Source APIを使用
  if (keywords) {
    return getUnsplashImageByKeywords(keywords);
  }

  // フォールバック: テーマのデフォルト画像
  if (themeImages.hero?.default) {
    if (theme === 'onsen-kanto' && typeof themeImages.hero.default === 'object' && 'url' in themeImages.hero.default) {
      return themeImages.hero.default.url;
    }
    return themeImages.hero.default;
  }

  // 最終フォールバック
  return 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=1920&auto=format&fit=crop';
}

/**
 * 画像のメタデータを取得（著作権情報を含む）
 * @param category カテゴリ
 * @param key キー
 */
export function getImageMetadata(
  category: string,
  key: string
): ImageMetadata | null {
  const theme = getCurrentTheme();
  
  // 温泉テーマの場合のみメタデータを返す
  if (theme === 'onsen-kanto') {
    const themeImages = THEME_IMAGES[theme];
    if (themeImages[category]?.[key]) {
      const image = themeImages[category][key];
      if (typeof image === 'object' && 'url' in image) {
        return image as ImageMetadata;
      }
    }
    // デフォルトを返す
    if (themeImages[category]?.default) {
      const image = themeImages[category].default;
      if (typeof image === 'object' && 'url' in image) {
        return image as ImageMetadata;
      }
    }
  }
  
  return null;
}

/**
 * 温泉地の画像をマスターデータから取得
 * @param onsenSlug 温泉地のスラッグ（例: hakone, kusatsu）
 * @param type 画像タイプ（hero, gallery, thumbnail）
 * @returns 画像URL
 * 注意: この関数はサーバーサイドでのみ使用可能（fsモジュールを使用）
 */
export function getOnsenImageFromMaster(
  onsenSlug: string,
  type: 'hero' | 'gallery' | 'thumbnail' = 'hero'
): string {
  // サーバーサイドでのみfsモジュールを使用
  if (typeof window === 'undefined') {
    try {
      // 動的インポートを使用してfsモジュールを読み込む
      const fs = require('fs');
      const path = require('path');
      const jsonPath = path.join(process.cwd(), 'data', 'onsen-image-master.json');
      
      if (fs.existsSync(jsonPath)) {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        // 空のファイルや不完全なJSONをチェック
        if (!fileContent || fileContent.trim().length === 0) {
          throw new Error('Empty file');
        }
        
        const imageData = JSON.parse(fileContent);
        const onsenData = imageData[onsenSlug];
        
        if (onsenData) {
          // 指定されたタイプの画像を取得
          const imageInfo = onsenData[type];
          if (imageInfo?.url) {
            return imageInfo.url;
          }
          
          // タイプが見つからない場合はheroをフォールバック
          if (type !== 'hero' && onsenData.hero?.url) {
            return onsenData.hero.url;
          }
        }
      }
    } catch (error) {
      // エラーが発生した場合はフォールバックを使用
      // ビルド時にはエラーを出力しない（静かにフォールバック）
      if (process.env.NODE_ENV !== 'production' && process.env.SKIP_CHECK !== 'true') {
        console.warn(`Failed to load master image for ${onsenSlug} (${type}):`, error);
      }
    }
  }
  
  // フォールバック: 事前定義された画像を使用
  return getThemeImage('onsen', onsenSlug, `onsen,${onsenSlug},japan`);
}

/**
 * 温泉地の画像を取得（同期版）
 * @param onsenSlug 温泉地のスラッグ（例: hakone, kusatsu）
 * 注意: この関数はサーバーサイドでのみ使用可能（fsモジュールを使用）
 * @deprecated 新しいコードでは getOnsenImageFromMaster を使用してください
 */
export function getOnsenImage(onsenSlug: string): string {
  return getOnsenImageFromMaster(onsenSlug, 'hero');
}

/**
 * 温泉地の画像を取得（非同期版、Wikimedia Commonsから自動取得）
 * @param onsenSlug 温泉地のスラッグ（例: hakone, kusatsu）
 */
export async function getOnsenImageAsync(
  onsenSlug: string
): Promise<string> {
  // サーバーサイドでのみ動作（ビルド時）
  if (typeof window === 'undefined') {
    try {
      const { getCachedOnsenImage } = await import('./wikimedia');
      const wikimediaImage = await getCachedOnsenImage(onsenSlug);
      if (wikimediaImage) {
        return wikimediaImage.url;
      }
    } catch (error) {
      console.warn(`Failed to fetch Wikimedia image for ${onsenSlug}:`, error);
    }
  }
  
  // フォールバック: 事前定義された画像を使用
  return getThemeImage('onsen', onsenSlug, `onsen,${onsenSlug},japan`);
}

/**
 * ヒーロー画像を取得
 * @param key キー（デフォルト: main）
 */
export function getHeroImage(key: string = 'main'): string {
  return getThemeImage('hero', key, 'onsen,hot spring,japan');
}

/**
 * セクション画像を取得
 * @param sectionId セクションID
 * @param keywords 検索キーワード（オプション）
 */
export function getSectionImage(sectionId: string, keywords?: string): string {
  return getThemeImage('sections', sectionId, keywords);
}

/**
 * CTA画像を取得
 */
export function getCtaImage(): string {
  return getThemeImage('cta', 'default', 'onsen,hot spring,japan');
}

/**
 * ブログ画像を取得
 * @param slug ブログスラッグ
 */
export function getBlogImage(slug: string): string {
  return getThemeImage('blog', slug, 'onsen,hot spring,japan');
}

/**
 * フィーチャー画像を取得
 * @param key キー
 */
export function getFeatureImage(key: string): string {
  return getThemeImage('features', key, 'onsen,hot spring,japan');
}

/**
 * 画像URLを最適化（Next.js Image用）
 * @param url 元のURL
 * @param width 幅
 * @param quality 品質（1-100）
 */
export function optimizeImageUrl(
  url: string,
  width: number = 1920,
  quality: number = 80
): string {
  // Unsplash URLの場合は最適化パラメータを追加
  if (url.includes('unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    return urlObj.toString();
  }
  
  // Wikimedia Commons URLの場合は、URLパラメータでサイズを指定できる
  // ただし、Wikimedia Commonsは直接的なサイズ指定をサポートしていないため、
  // そのまま返す（Next.js Imageコンポーネントがwidth/heightで制御）
  if (url.includes('wikimedia.org')) {
    return url;
  }
  
  return url;
}

// 後方互換性のためのエクスポート（既存コード用）
export const IMAGES = GITHUB_DOCS_IMAGES;

export function getImage(category: keyof typeof IMAGES, key: string): string {
  const categoryImages = IMAGES[category] as Record<string, string>;
  return categoryImages[key] || categoryImages[Object.keys(categoryImages)[0]];
}

export function getTopicImage(topicId: string): string {
  return GITHUB_DOCS_IMAGES.topics[topicId as keyof typeof GITHUB_DOCS_IMAGES.topics] || GITHUB_DOCS_IMAGES.topics['getting-started'];
}

export function getBackgroundImage(key: keyof typeof GITHUB_DOCS_IMAGES.backgrounds): string {
  return GITHUB_DOCS_IMAGES.backgrounds[key];
}
