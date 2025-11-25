/**
 * Portfolio テーマ設定
 * クリエイター・デザイナー向けのテーマ
 */

export const theme = {
  name: 'portfolio',
  
  colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    accent: '#8b5cf6',
    background: {
      start: '#0f172a',
      end: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      muted: '#64748b',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.8)',
      border: 'rgba(71, 85, 105, 0.5)',
    },
  },

  typography: {
    fontFamily: {
      base: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      heading: '"Outfit", sans-serif',
      code: '"JetBrains Mono", monospace',
    },
    fontSize: {
      hero: '4.5rem',
      h1: '3rem',
      h2: '2.25rem',
      h3: '1.875rem',
      body: '1rem',
      small: '0.875rem',
    },
  },

  spacing: {
    section: {
      small: '4rem',
      default: '6rem',
      large: '10rem',
    },
  },

  borderRadius: {
    small: '6px',
    default: '10px',
    large: '16px',
    full: '9999px',
  },

  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
};

export type Theme = typeof theme;
