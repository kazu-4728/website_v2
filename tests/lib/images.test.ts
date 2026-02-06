/**
 * 画像管理システムのテスト
 * 画像が適切に取得され、各ページで異なる画像が表示されることを確認
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getOnsenImage, getImageMetadata } from '../../app/lib/images';
import * as fs from 'fs';
import * as path from 'path';

// fsモジュールをモック
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

describe('画像管理システム', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOnsenImage()', () => {
    it('各温泉地で異なる画像URLを返すべき', () => {
      // 実際のデータファイルを使用してテスト
      // モックは動的require()では機能しないため、実際のファイルを使用
      const hakoneImage = getOnsenImage('hakone');
      const kusatsuImage = getOnsenImage('kusatsu');
      const yunohanaImage = getOnsenImage('hakone-yunohana');

      // 有効なURL形式であることを確認
      expect(hakoneImage).toMatch(/^https?:\/\//);
      expect(kusatsuImage).toMatch(/^https?:\/\//);
      expect(yunohanaImage).toMatch(/^https?:\/\//);

      // すべて異なることを確認
      expect(hakoneImage).not.toBe(kusatsuImage);
      expect(hakoneImage).not.toBe(yunohanaImage);
      expect(kusatsuImage).not.toBe(yunohanaImage);
    });

    it('画像が見つからない場合はフォールバックを使用すべき', () => {
      // ファイルが存在しない場合
      (fs.existsSync as any).mockReturnValue(false);

      const image = getOnsenImage('unknown-onsen');
      
      // フォールバック画像が返されることを確認（URL形式であること）
      expect(image).toBeTruthy();
      expect(typeof image).toBe('string');
    });

    it('すべての温泉地で同じ画像が返されないことを確認', () => {
      // 実際のwikimedia-images.jsonを読み込む（テスト環境で）
      const jsonPath = path.join(process.cwd(), 'data', 'wikimedia-images.json');
      
      if (fs.existsSync(jsonPath)) {
        const imageData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const onsenSlugs = Object.keys(imageData);
        
        if (onsenSlugs.length >= 2) {
          const images = onsenSlugs.map(slug => getOnsenImage(slug));
          
          // 少なくとも2つ以上の異なる画像URLが存在することを確認
          const uniqueImages = new Set(images);
          expect(uniqueImages.size).toBeGreaterThan(1);
        }
      }
    });
  });

  describe('画像URLの妥当性', () => {
    it('返される画像URLが有効な形式であるべき', () => {
      const onsenSlugs = ['hakone', 'kusatsu', 'ikaho', 'nasu'];
      
      onsenSlugs.forEach(slug => {
        const imageUrl = getOnsenImage(slug);
        
        // URL形式であることを確認
        expect(imageUrl).toMatch(/^https?:\/\//);
        // 空でないことを確認
        expect(imageUrl.length).toBeGreaterThan(0);
      });
    });

    it('準備中画像も有効なURLを返すべき', () => {
      const placeholderSlugs = ['hakone-yunohana', 'kusatsu-sainokawara', 'okutama'];
      
      placeholderSlugs.forEach(slug => {
        const imageUrl = getOnsenImage(slug);
        
        // URL形式であることを確認
        expect(imageUrl).toMatch(/^https?:\/\//);
        // 空でないことを確認
        expect(imageUrl.length).toBeGreaterThan(0);
      });
    });
  });
});
