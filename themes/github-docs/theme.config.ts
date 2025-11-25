/**
 * Café Culture テーマ設定
 * 温かみのあるコーヒーブラウンを基調としたカフェテーマ
 */

export const theme = {
  name: 'cafe-culture',
  
  colors: {
    primary: '#c4a574',
    primaryDark: '#a88b5a',
    accent: '#d4a574',
    background: {
      start: '#1a1512',
      end: '#2d2520',
    },
    text: {
      primary: '#f5f0eb',
      secondary: '#c9bfb3',
      muted: '#8c7b6b',
    },
    card: {
      background: 'rgba(35, 28, 24, 0.8)',
      border: 'rgba(100, 85, 70, 0.4)',
    },
  },

  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", sans-serif',
      heading: 'inherit',
      code: '"Fira Code", "Consolas", "Monaco", monospace',
    },
    fontSize: {
      hero: '5rem',
      h1: '3rem',
      h2: '2.5rem',
      h3: '2rem',
      body: '1rem',
      small: '0.875rem',
    },
  },

  spacing: {
    section: {
      small: '3rem',
      default: '5rem',
      large: '8rem',
    },
  },

  borderRadius: {
    small: '8px',
    default: '12px',
    large: '20px',
    full: '9999px',
  },

  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
};

export type Theme = typeof theme;
