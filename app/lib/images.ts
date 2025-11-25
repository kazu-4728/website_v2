/**
 * 画像管理システム（簡略化・実用版）
 * Unsplash画像を直接使用（外部依存だが確実に動作）
 */

// Unsplash画像URL
export const IMAGES = {
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
    security: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
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
 * 画像URLを取得
 */
export function getImage(category: keyof typeof IMAGES, key: string): string {
  const categoryImages = IMAGES[category] as Record<string, string>;
  return categoryImages[key] || categoryImages[Object.keys(categoryImages)[0]];
}

/**
 * ヒーロー画像を取得
 */
export function getHeroImage(key: keyof typeof IMAGES.hero = 'main'): string {
  return IMAGES.hero[key];
}

/**
 * 機能画像を取得
 */
export function getFeatureImage(key: keyof typeof IMAGES.features): string {
  return IMAGES.features[key];
}

/**
 * トピック画像を取得
 */
export function getTopicImage(topicId: string): string {
  return IMAGES.topics[topicId as keyof typeof IMAGES.topics] || IMAGES.topics['getting-started'];
}

/**
 * 背景画像を取得
 */
export function getBackgroundImage(key: keyof typeof IMAGES.backgrounds): string {
  return IMAGES.backgrounds[key];
}
