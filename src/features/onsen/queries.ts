/**
 * Features Layer: Onsen Queries
 * 
 * 温泉データの検索・フィルタ・ソート機能
 * Repository層からデータを取得し、UI層で使いやすい形に変換
 */

import { OnsenSpot } from '../../domain/onsen/types';
import { getAllOnsens, getOnsenBySlug } from './repository';

/**
 * エリアでフィルタ
 */
export async function filterByArea(area: string): Promise<OnsenSpot[]> {
  const all = await getAllOnsens();
  return all.filter((onsen) => onsen.region.area === area);
}

/**
 * 都道府県でフィルタ
 */
export async function filterByPrefecture(prefecture: string): Promise<OnsenSpot[]> {
  const all = await getAllOnsens();
  return all.filter((onsen) => onsen.region.prefecture === prefecture);
}

/**
 * 名称で検索（部分一致）
 */
export async function searchByName(query: string): Promise<OnsenSpot[]> {
  const all = await getAllOnsens();
  const lowerQuery = query.toLowerCase();
  
  return all.filter((onsen) => {
    const nameMatch = onsen.name.toLowerCase().includes(lowerQuery);
    const nameEnMatch = onsen.nameEn.toLowerCase().includes(lowerQuery);
    const locationMatch = onsen.location.toLowerCase().includes(lowerQuery);
    const descriptionMatch = onsen.description.toLowerCase().includes(lowerQuery);
    
    return nameMatch || nameEnMatch || locationMatch || descriptionMatch;
  });
}

/**
 * タグでフィルタ
 */
export async function filterByTags(tags: string[]): Promise<OnsenSpot[]> {
  const all = await getAllOnsens();
  if (tags.length === 0) return all;
  
  return all.filter((onsen) => {
    return tags.some((tag) => onsen.seoTags.includes(tag));
  });
}

/**
 * 複合検索（エリア・都道府県・名称・タグ）
 */
export async function searchOnsens(params: {
  area?: string;
  prefecture?: string;
  query?: string;
  tags?: string[];
}): Promise<OnsenSpot[]> {
  let results = await getAllOnsens();

  if (params.area) {
    results = results.filter((onsen) => onsen.region.area === params.area);
  }

  if (params.prefecture) {
    results = results.filter((onsen) => onsen.region.prefecture === params.prefecture);
  }

  if (params.query) {
    const lowerQuery = params.query.toLowerCase();
    results = results.filter((onsen) => {
      const nameMatch = onsen.name.toLowerCase().includes(lowerQuery);
      const nameEnMatch = onsen.nameEn.toLowerCase().includes(lowerQuery);
      const locationMatch = onsen.location.toLowerCase().includes(lowerQuery);
      const descriptionMatch = onsen.description.toLowerCase().includes(lowerQuery);
      return nameMatch || nameEnMatch || locationMatch || descriptionMatch;
    });
  }

  if (params.tags && params.tags.length > 0) {
    results = results.filter((onsen) => {
      return params.tags!.some((tag) => onsen.seoTags.includes(tag));
    });
  }

  return results;
}

/**
 * 人気順でソート（将来的にpriorityフィールドでソート可能）
 * 現在は名称順でソート
 */
export async function getPopularOnsens(limit?: number): Promise<OnsenSpot[]> {
  const all = await getAllOnsens();
  // TODO: priorityフィールドが追加されたら、それでソート
  const sorted = all.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * 新着順でソート（将来的にpublishedAtフィールドでソート可能）
 * 現在は名称順でソート
 */
export async function getRecentOnsens(limit?: number): Promise<OnsenSpot[]> {
  const all = await getAllOnsens();
  // TODO: publishedAtフィールドが追加されたら、それでソート
  const sorted = all.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * 全エリアのリストを取得
 */
export async function getAllAreas(): Promise<string[]> {
  const all = await getAllOnsens();
  const areas = new Set<string>();
  all.forEach((onsen) => {
    if (onsen.region.area) {
      areas.add(onsen.region.area);
    }
  });
  return Array.from(areas).sort();
}

/**
 * 全都道府県のリストを取得
 */
export async function getAllPrefectures(): Promise<string[]> {
  const all = await getAllOnsens();
  const prefectures = new Set<string>();
  all.forEach((onsen) => {
    if (onsen.region.prefecture) {
      prefectures.add(onsen.region.prefecture);
    }
  });
  return Array.from(prefectures).sort();
}

/**
 * 全タグのリストを取得
 */
export async function getAllTags(): Promise<string[]> {
  const all = await getAllOnsens();
  const tags = new Set<string>();
  all.forEach((onsen) => {
    onsen.seoTags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * スラッグで温泉を取得（Queries層経由）
 */
export async function getOnsen(slug: string): Promise<OnsenSpot | null> {
  return getOnsenBySlug(slug);
}
