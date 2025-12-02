/**
 * ページテンプレート定義
 * 各ページタイプに応じた構造とデザインパターンを提供
 */

export const pageTemplates = {
  // ランディングページ
  landing: {
    sections: [
      { type: 'hero', required: true },
      { type: 'features', required: true },
      { type: 'content', required: false },
      { type: 'cta', required: true },
    ],
    heroStyle: 'full-screen',
    layout: 'centered',
  },
  
  // ドキュメントページ
  docs: {
    sections: [
      { type: 'header', required: true },
      { type: 'content', required: true },
      { type: 'sidebar', required: false },
    ],
    heroStyle: 'compact',
    layout: 'sidebar',
  },
  
  // ブログページ
  blog: {
    sections: [
      { type: 'header', required: true },
      { type: 'content-grid', required: true },
      { type: 'pagination', required: false },
    ],
    heroStyle: 'medium',
    layout: 'grid',
  },
  
  // ポートフォリオページ
  portfolio: {
    sections: [
      { type: 'hero', required: true },
      { type: 'gallery', required: true },
      { type: 'about', required: false },
      { type: 'contact', required: true },
    ],
    heroStyle: 'visual-heavy',
    layout: 'masonry',
  },
  
  // FAQページ
  faq: {
    sections: [
      { type: 'header', required: true },
      { type: 'accordion', required: true },
      { type: 'cta', required: false },
    ],
    heroStyle: 'simple',
    layout: 'single-column',
  },
};

export type PageTemplate = keyof typeof pageTemplates;
