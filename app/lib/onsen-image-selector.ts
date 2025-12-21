/**
 * 温泉画像選択システム
 * 
 * 要件:
 * - ヒーローセクションと温泉紹介ページには、温泉が写っている画像が絶対条件
 * - 複数の画像候補から選択可能
 * - 画像のストック機能により、適切な画像を保証
 */

import onsenImageStock from '../../data/onsen-image-stock.json';

/**
 * 温泉画像のメタデータ
 */
export interface OnsenImage {
  id: string;
  url: string;
  title: string;
  description: string;
  hasOnsen: boolean; // 温泉が写っているかどうか
  features: string[];
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
  recommended?: boolean;
  note?: string;
}

/**
 * ヒーローセクション用の温泉画像を取得
 * 
 * @param preference 'primary' | 'alternative' - 優先度
 * @returns 温泉が写っている画像のリスト
 */
export function getHeroOnsenImages(
  preference: 'primary' | 'alternative' = 'primary'
): OnsenImage[] {
  const images = onsenImageStock.hero[preference] as OnsenImage[];
  
  // 温泉が写っている画像のみをフィルタ
  return images.filter(img => img.hasOnsen === true);
}

/**
 * ヒーローセクション用の推奨画像を取得
 * 
 * @returns 最も推奨される温泉画像
 */
export function getRecommendedHeroImage(): OnsenImage {
  const primaryImages = getHeroOnsenImages('primary');
  
  if (primaryImages.length === 0) {
    throw new Error('ヒーローセクション用の温泉画像が見つかりません');
  }
  
  // 最初の画像を推奨画像として返す
  return primaryImages[0];
}

/**
 * 温泉紹介ページ用の画像を取得
 * 
 * @param onsenId 温泉地のID（例: 'kusatsu', 'ikaho'）
 * @returns 温泉が写っている画像のリスト
 */
export function getOnsenPageImages(onsenId: string): OnsenImage[] {
  const images = (onsenImageStock.onsenPages as Record<string, OnsenImage[]>)[onsenId];
  
  if (!images || images.length === 0) {
    console.warn(`温泉地 "${onsenId}" の画像が見つかりません`);
    return [];
  }
  
  // 温泉が写っている画像のみをフィルタ
  return images.filter(img => img.hasOnsen === true);
}

/**
 * 温泉紹介ページ用の推奨画像を取得
 * 
 * @param onsenId 温泉地のID
 * @returns 最も推奨される温泉画像
 */
export function getRecommendedOnsenImage(onsenId: string): OnsenImage | null {
  const images = getOnsenPageImages(onsenId);
  
  if (images.length === 0) {
    console.warn(`温泉地 "${onsenId}" の温泉画像が見つかりません`);
    return null;
  }
  
  // recommended: true の画像を優先
  const recommended = images.find(img => img.recommended === true);
  if (recommended) {
    return recommended;
  }
  
  // recommended がない場合は最初の画像を返す
  return images[0];
}

/**
 * すべての利用可能な温泉地IDを取得
 * 
 * @returns 温泉地IDのリスト
 */
export function getAvailableOnsenIds(): string[] {
  return Object.keys(onsenImageStock.onsenPages);
}

/**
 * 画像が温泉を含んでいるかを検証
 * 
 * @param image 検証する画像
 * @throws Error 温泉が写っていない場合
 */
export function validateOnsenImage(image: OnsenImage): void {
  if (!image.hasOnsen) {
    throw new Error(
      `画像 "${image.id}" は温泉が写っていません。` +
      `ヒーローセクションと温泉紹介ページには温泉が写っている画像が必須です。` +
      `${image.note ? `注: ${image.note}` : ''}`
    );
  }
}

/**
 * 画像選択のヘルパー: 複数の画像から選択可能
 * 
 * @param images 画像のリスト
 * @param index 選択するインデックス（デフォルト: 0）
 * @returns 選択された画像
 */
export function selectImage(images: OnsenImage[], index: number = 0): OnsenImage {
  if (images.length === 0) {
    throw new Error('画像が見つかりません');
  }
  
  if (index < 0 || index >= images.length) {
    console.warn(`インデックス ${index} は範囲外です。最初の画像を返します。`);
    index = 0;
  }
  
  const selected = images[index];
  validateOnsenImage(selected);
  
  return selected;
}

/**
 * 画像のクレジット情報を取得
 * 
 * @param image 画像
 * @returns クレジット情報の文字列
 */
export function getImageCredit(image: OnsenImage): string {
  return `Photo by ${image.author} (${image.license})`;
}

/**
 * 画像のクレジットHTMLを取得
 * 
 * @param image 画像
 * @returns クレジット情報のHTML文字列
 */
export function getImageCreditHTML(image: OnsenImage): string {
  return `Photo by <a href="${image.licenseUrl}" target="_blank" rel="noopener noreferrer">${image.author}</a> (<a href="${image.licenseUrl}" target="_blank" rel="noopener noreferrer">${image.license}</a>)`;
}
