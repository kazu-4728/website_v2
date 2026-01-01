/**
 * 画像品質のテスト
 * 画像が適切な品質で表示されることを確認
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getOnsenImage } from '../../app/lib/images';

describe.skip('画像品質テスト', () => {
  describe('画像URLの妥当性', () => {
    it('すべての温泉地で有効な画像URLが返されるべき', () => {
      const requiredOnsen = [
        'hakone', 'hakone-yunohana', 'hakone-gora', 'hakone-sengokuhara',
        'kusatsu', 'kusatsu-yubatake', 'kusatsu-sainokawara',
        'kinugawa', 'ikaho', 'nasu', 'minakami', 'shima', 'nikko',
        'shiobara', 'atami', 'ito', 'shuzenji', 'shimoda', 'yugawara',
        'okutama', 'chichibu',
      ];

      requiredOnsen.forEach(slug => {
        const imageUrl = getOnsenImage(slug);

        // URL形式であることを確認
        expect(imageUrl).toMatch(/^https?:\/\//);
        // 空でないことを確認
        expect(imageUrl.length).toBeGreaterThan(0);
        // 適切な長さであることを確認
        expect(imageUrl.length).toBeLessThan(500);
      });
    });

    it('画像URLがWikimedia Commonsの形式であるべき', () => {
      const testSlugs = ['hakone', 'kusatsu', 'ikaho', 'nasu', 'minakami'];

      testSlugs.forEach(slug => {
        const imageUrl = getOnsenImage(slug);

        // Wikimedia CommonsのURLであることを確認
        expect(imageUrl).toContain('wikimedia.org');
        expect(imageUrl).toContain('commons');
      });
    });
  });

  describe('画像の多様性', () => {
    it('主要な温泉地で異なる画像が使用されているべき', () => {
      const majorOnsen = ['hakone', 'kusatsu', 'kinugawa', 'ikaho', 'nasu'];
      const imageUrls = majorOnsen.map(slug => getOnsenImage(slug));
      const uniqueUrls = new Set(imageUrls);

      // すべて異なる画像であることを確認
      expect(uniqueUrls.size).toBe(majorOnsen.length);
    });

    it('同じ画像が3ページ以上で使用されていないことを確認（kusatsu系を除く）', () => {
      const jsonPath = join(process.cwd(), 'data', 'wikimedia-images.json');
      if (!existsSync(jsonPath)) {
        return;
      }

      const imageData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      const urlCounts = new Map<string, string[]>();

      Object.entries(imageData).forEach(([slug, data]: [string, any]) => {
        const url = data.url;
        if (!urlCounts.has(url)) {
          urlCounts.set(url, []);
        }
        urlCounts.get(url)!.push(slug);
      });

      // kusatsuとkusatsu-yubatakeは同じ場所なので、同じ画像でも許容
      // それ以外で同じ画像が3ページ以上で使用されている場合はエラー
      let maxCount = 0;
      urlCounts.forEach((slugs, url) => {
        // kusatsu系のペアは除外
        const isKusatsuPair = slugs.length === 2 &&
          slugs.includes('kusatsu') &&
          slugs.includes('kusatsu-yubatake');

        if (!isKusatsuPair && slugs.length > maxCount) {
          maxCount = slugs.length;
        }
      });

      expect(maxCount).toBeLessThan(3);
    });
  });

  describe('準備中画像の品質', () => {
    it('準備中画像も有効な画像URLを返すべき', () => {
      const placeholderSlugs = ['hakone-yunohana', 'kusatsu-sainokawara', 'okutama'];

      placeholderSlugs.forEach(slug => {
        const imageUrl = getOnsenImage(slug);

        // URL形式であることを確認
        expect(imageUrl).toMatch(/^https?:\/\//);
        // 空でないことを確認
        expect(imageUrl.length).toBeGreaterThan(0);
        // Wikimedia CommonsのURLであることを確認
        expect(imageUrl).toContain('wikimedia.org');
      });
    });

    it('準備中画像が互いに異なるべき', () => {
      const placeholderSlugs = ['hakone-yunohana', 'kusatsu-sainokawara', 'okutama'];
      const imageUrls = placeholderSlugs.map(slug => getOnsenImage(slug));
      const uniqueUrls = new Set(imageUrls);

      // すべて異なる画像であることを確認
      expect(uniqueUrls.size).toBe(placeholderSlugs.length);
    });
  });
});
