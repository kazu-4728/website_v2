/**
 * GitHub Docs テーマ設定
 */

export const theme = {
  name: 'github-docs',
  
  colors: {
    primary: '#ff8a3d',
    primaryDark: '#ff6b35',
    accent: '#f59e0b',
    background: {
      start: '#0b0f14',
      end: '#1a1f2e',
    },
    text: {
      primary: '#e4e4e7',
      secondary: '#94a3b8',
      muted: '#64748b',
    },
    card: {
      background: 'rgba(15, 23, 42, 0.7)',
      border: 'rgba(51, 65, 85, 0.5)',
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
