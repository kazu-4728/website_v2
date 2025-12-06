/**
 * 画像管理システムのテスト
 * 画像が適切に取得され、各ページで異なる画像が表示されることを確認
 */

import { describe, it, expect } from 'vitest';
import { getOnsenImage, getImageMetadata } from '../../app/lib/images';

describe('画像管理システム', () => {
  describe('getOnsenImage()', () => {
    it('各温泉地で異なる画像URLを返すべき', () => {
      // 主要な温泉地の画像を取得
      const hakoneImage = getOnsenImage('hakone');
      const kusatsuImage = getOnsenImage('kusatsu');
      const yunohanaImage = getOnsenImage('hakone-yunohana');

      // 異なる画像URLが返されることを確認
      expect(hakoneImage).toMatch(/^https?:\/\//);
      expect(kusatsuImage).toMatch(/^https?:\/\//);
      expect(yunohanaImage).toMatch(/^https?:\/\//);

      // すべて異なることを確認
      expect(hakoneImage).not.toBe(kusatsuImage);
      expect(hakoneImage).not.toBe(yunohanaImage);
      expect(kusatsuImage).not.toBe(yunohanaImage);
    });

    it('画像が見つからない場合はフォールバックを使用すべき', () => {
      const image = getOnsenImage('unknown-onsen');
      
      // フォールバック画像が返されることを確認（URL形式であること）
      expect(image).toBeTruthy();
      expect(typeof image).toBe('string');
      expect(image).toMatch(/^https?:\/\//);
    });

    it('すべての温泉地で同じ画像が返されないことを確認', () => {
      const onsenSlugs = ['hakone', 'kusatsu', 'kinugawa', 'ikaho', 'nasu'];
      const images = onsenSlugs.map(slug => getOnsenImage(slug));
      
      // 少なくとも2つ以上の異なる画像URLが存在することを確認
      const uniqueImages = new Set(images);
      expect(uniqueImages.size).toBeGreaterThan(1);
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

    it('すべての温泉地で有効なURLを返すべき', () => {
      const allSlugs = [
        'hakone-yunohana', 'kusatsu-sainokawara', 'okutama',
        'hakone-gora', 'hakone-sengokuhara', 'kusatsu-yubatake',
        'shima', 'nikko', 'shiobara', 'atami', 'ito', 'shuzenji',
        'shimoda', 'yugawara', 'chichibu', 'minakami'
      ];
      
      allSlugs.forEach(slug => {
        const imageUrl = getOnsenImage(slug);
        
        // URL形式であることを確認
        expect(imageUrl).toMatch(/^https?:\/\//);
        // 空でないことを確認
        expect(imageUrl.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getImageMetadata()', () => {
    it('ヒーロー画像のメタデータを返すべき', () => {
      const metadata = getImageMetadata('hero', 'main');
      
      // メタデータが存在することを確認
      expect(metadata).toBeDefined();
      if (metadata) {
        expect(metadata.url).toMatch(/^https?:\/\//);
        expect(metadata.photographer).toBeTruthy();
        expect(metadata.license).toBeTruthy();
      }
    });
  });
});
