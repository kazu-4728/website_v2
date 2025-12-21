/**
 * 温泉画像選択システムのテスト
 * 
 * 要件:
 * - ヒーローセクションと温泉紹介ページには温泉が写っている画像が絶対条件
 * - 複数の画像候補から選択可能
 */

import { describe, it, expect } from 'vitest';
import {
  getHeroOnsenImages,
  getRecommendedHeroImage,
  getOnsenPageImages,
  getRecommendedOnsenImage,
  getAvailableOnsenIds,
  validateOnsenImage,
  selectImage,
  type OnsenImage,
} from '../app/lib/onsen-image-selector';

describe('温泉画像選択システム', () => {
  describe('getHeroOnsenImages', () => {
    it('primary画像を取得できる', () => {
      const images = getHeroOnsenImages('primary');
      expect(images).toBeDefined();
      expect(images.length).toBeGreaterThan(0);
    });

    it('すべてのprimary画像が温泉を含んでいる', () => {
      const images = getHeroOnsenImages('primary');
      images.forEach(img => {
        expect(img.hasOnsen).toBe(true);
      });
    });

    it('alternative画像を取得できる', () => {
      const images = getHeroOnsenImages('alternative');
      expect(images).toBeDefined();
    });

    it('すべてのalternative画像が温泉を含んでいる', () => {
      const images = getHeroOnsenImages('alternative');
      images.forEach(img => {
        expect(img.hasOnsen).toBe(true);
      });
    });
  });

  describe('getRecommendedHeroImage', () => {
    it('推奨ヒーロー画像を取得できる', () => {
      const image = getRecommendedHeroImage();
      expect(image).toBeDefined();
      expect(image.hasOnsen).toBe(true);
    });

    it('推奨画像は必須フィールドを持つ', () => {
      const image = getRecommendedHeroImage();
      expect(image.id).toBeDefined();
      expect(image.url).toBeDefined();
      expect(image.title).toBeDefined();
      expect(image.author).toBeDefined();
      expect(image.license).toBeDefined();
    });
  });

  describe('getOnsenPageImages', () => {
    it('草津温泉の画像を取得できる', () => {
      const images = getOnsenPageImages('kusatsu');
      expect(images).toBeDefined();
      expect(images.length).toBeGreaterThan(0);
    });

    it('すべての草津温泉画像が温泉を含んでいる', () => {
      const images = getOnsenPageImages('kusatsu');
      images.forEach(img => {
        expect(img.hasOnsen).toBe(true);
      });
    });

    it('存在しない温泉地の場合は空配列を返す', () => {
      const images = getOnsenPageImages('nonexistent');
      expect(images).toEqual([]);
    });
  });

  describe('getRecommendedOnsenImage', () => {
    it('草津温泉の推奨画像を取得できる', () => {
      const image = getRecommendedOnsenImage('kusatsu');
      expect(image).toBeDefined();
      expect(image?.hasOnsen).toBe(true);
    });

    it('推奨画像が設定されている場合はそれを返す', () => {
      const image = getRecommendedOnsenImage('kusatsu');
      expect(image).toBeDefined();
      // 草津温泉の最初の画像は recommended: true のはず
      expect(image?.recommended).toBe(true);
    });

    it('存在しない温泉地の場合はnullを返す', () => {
      const image = getRecommendedOnsenImage('nonexistent');
      expect(image).toBeNull();
    });
  });

  describe('getAvailableOnsenIds', () => {
    it('利用可能な温泉地IDのリストを取得できる', () => {
      const ids = getAvailableOnsenIds();
      expect(ids).toBeDefined();
      expect(ids.length).toBeGreaterThan(0);
      expect(ids).toContain('kusatsu');
      expect(ids).toContain('ikaho');
      expect(ids).toContain('nasu');
    });
  });

  describe('validateOnsenImage', () => {
    it('温泉が写っている画像は検証に合格する', () => {
      const image: OnsenImage = {
        id: 'test',
        url: 'https://example.com/image.jpg',
        title: 'テスト画像',
        description: 'テスト用の温泉画像',
        hasOnsen: true,
        features: ['温泉'],
        author: 'テスト作者',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        source: 'wikimedia',
      };

      expect(() => validateOnsenImage(image)).not.toThrow();
    });

    it('温泉が写っていない画像は検証に失敗する', () => {
      const image: OnsenImage = {
        id: 'test',
        url: 'https://example.com/image.jpg',
        title: 'テスト画像',
        description: 'テスト用の画像',
        hasOnsen: false,
        features: ['景色'],
        author: 'テスト作者',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        source: 'wikimedia',
      };

      expect(() => validateOnsenImage(image)).toThrow();
    });
  });

  describe('selectImage', () => {
    const mockImages: OnsenImage[] = [
      {
        id: 'image1',
        url: 'https://example.com/image1.jpg',
        title: '画像1',
        description: '温泉画像1',
        hasOnsen: true,
        features: ['温泉'],
        author: '作者1',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        source: 'wikimedia',
      },
      {
        id: 'image2',
        url: 'https://example.com/image2.jpg',
        title: '画像2',
        description: '温泉画像2',
        hasOnsen: true,
        features: ['温泉'],
        author: '作者2',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        source: 'wikimedia',
      },
    ];

    it('インデックスで画像を選択できる', () => {
      const selected = selectImage(mockImages, 1);
      expect(selected.id).toBe('image2');
    });

    it('デフォルトでは最初の画像を選択する', () => {
      const selected = selectImage(mockImages);
      expect(selected.id).toBe('image1');
    });

    it('範囲外のインデックスの場合は最初の画像を返す', () => {
      const selected = selectImage(mockImages, 10);
      expect(selected.id).toBe('image1');
    });

    it('空配列の場合はエラーをスローする', () => {
      expect(() => selectImage([])).toThrow();
    });
  });

  describe('実際のデータの整合性チェック', () => {
    it('すべてのヒーロー画像が温泉を含んでいる', () => {
      const primaryImages = getHeroOnsenImages('primary');
      const alternativeImages = getHeroOnsenImages('alternative');
      
      const allHeroImages = [...primaryImages, ...alternativeImages];
      
      allHeroImages.forEach(img => {
        expect(img.hasOnsen).toBe(true);
      });
    });

    it('すべての温泉地に少なくとも1つの温泉画像がある', () => {
      const onsenIds = getAvailableOnsenIds();
      
      onsenIds.forEach(id => {
        const images = getOnsenPageImages(id);
        expect(images.length).toBeGreaterThan(0);
        
        // すべての画像が温泉を含んでいることを確認
        images.forEach(img => {
          expect(img.hasOnsen).toBe(true);
        });
      });
    });

    it('推奨画像がある温泉地は正しく取得できる', () => {
      const onsenIds = getAvailableOnsenIds();
      
      onsenIds.forEach(id => {
        const recommendedImage = getRecommendedOnsenImage(id);
        if (recommendedImage) {
          expect(recommendedImage.hasOnsen).toBe(true);
        }
      });
    });
  });
});
