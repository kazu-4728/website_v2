/**
 * 画像表示の統合テスト
 * 実際のビルド結果を確認し、画像が適切に表示されることを検証
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('画像表示の統合テスト', () => {
  describe('wikimedia-images.jsonの検証', () => {
    it('wikimedia-images.jsonが存在し、すべての温泉地の画像が含まれているべき', () => {
      const jsonPath = join(process.cwd(), 'data', 'wikimedia-images.json');
      expect(existsSync(jsonPath)).toBe(true);

      const imageData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      
      // 必要な温泉地のリスト
      const requiredOnsen = [
        'hakone', 'hakone-yunohana', 'hakone-gora', 'hakone-sengokuhara',
        'kusatsu', 'kusatsu-yubatake', 'kusatsu-sainokawara',
        'kinugawa', 'ikaho', 'nasu', 'minakami', 'shima', 'nikko',
        'shiobara', 'atami', 'ito', 'shuzenji', 'shimoda', 'yugawara',
        'okutama', 'chichibu',
      ];

      // すべての必要な温泉地の画像が存在することを確認
      requiredOnsen.forEach(slug => {
        expect(imageData[slug]).toBeDefined();
        expect(imageData[slug].url).toBeDefined();
        expect(typeof imageData[slug].url).toBe('string');
        expect(imageData[slug].url).toMatch(/^https?:\/\//);
      });
    });

    it('画像URLが重複していないことを確認（準備中画像を除く）', () => {
      const jsonPath = join(process.cwd(), 'data', 'wikimedia-images.json');
      if (!existsSync(jsonPath)) {
        return;
      }

      const imageData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      const urlMap = new Map<string, string[]>();
      
      Object.entries(imageData).forEach(([slug, data]: [string, any]) => {
        const url = data.url;
        if (!urlMap.has(url)) {
          urlMap.set(url, []);
        }
        urlMap.get(url)!.push(slug);
      });

      // 同じURLが使用されている温泉地を確認
      const duplicates: string[][] = [];
      urlMap.forEach((slugs, url) => {
        if (slugs.length > 1) {
          // 準備中画像は同じURLを使用しても許容
          const isPlaceholder = slugs.some(slug => {
            const data = imageData[slug];
            return data.title?.toLowerCase().includes('準備中') || 
                   data.isPlaceholder === true;
          });
          
          if (!isPlaceholder) {
            duplicates.push(slugs);
          }
        }
      });

      // 準備中画像以外で重複がないことを確認
      // ただし、準備中画像が同じ画像を使用することは許容
      const nonPlaceholderDuplicates = duplicates.filter(duplicate => {
        return duplicate.some(slug => {
          const data = imageData[slug];
          return !(data.title?.toLowerCase().includes('準備中') || data.isPlaceholder === true);
        });
      });
      
      expect(nonPlaceholderDuplicates.length).toBe(0);
    });

    it('画像URLが有効な形式であることを確認', () => {
      const jsonPath = join(process.cwd(), 'data', 'wikimedia-images.json');
      if (!existsSync(jsonPath)) {
        return;
      }

      const imageData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      
      Object.entries(imageData).forEach(([slug, data]: [string, any]) => {
        const url = data.url;
        
        // URL形式であることを確認
        expect(url).toMatch(/^https?:\/\//);
        
        // ドメインが適切であることを確認
        if (url.includes('wikimedia.org')) {
          expect(url).toContain('upload.wikimedia.org');
        }
        
        // 空でないことを確認
        expect(url.length).toBeGreaterThan(10);
      });
    });
  });

  describe('画像の多様性チェック', () => {
    it('異なる温泉地で異なる画像が使用されているべき', () => {
      const jsonPath = join(process.cwd(), 'data', 'wikimedia-images.json');
      if (!existsSync(jsonPath)) {
        return;
      }

      const imageData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      const imageUrls = Object.values(imageData).map((data: any) => data.url);
      const uniqueUrls = new Set(imageUrls);
      
      // 少なくとも50%以上の異なる画像が存在することを確認
      const uniqueRatio = uniqueUrls.size / imageUrls.length;
      expect(uniqueRatio).toBeGreaterThan(0.5);
    });

    it('主要な温泉地で適切な画像が設定されているべき', () => {
      const jsonPath = join(process.cwd(), 'data', 'wikimedia-images.json');
      if (!existsSync(jsonPath)) {
        return;
      }

      const imageData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      
      // 主要な温泉地のリスト
      const majorOnsen = ['hakone', 'kusatsu', 'kinugawa', 'ikaho', 'nasu'];
      
      majorOnsen.forEach(slug => {
        const data = imageData[slug];
        expect(data).toBeDefined();
        expect(data.url).toBeDefined();
        
        // 準備中画像でないことを確認
        const isPlaceholder = data.title?.toLowerCase().includes('準備中') || 
                             data.isPlaceholder === true;
        expect(isPlaceholder).toBe(false);
      });
    });
  });
});
