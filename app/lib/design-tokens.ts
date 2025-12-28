/**
 * デザイントークン定義
 * デザインの一貫性を保つための基本値
 * 
 * Phase 2対応: colors, spacing, typography を追加
 */

// Phase 2: カラートークン（Ocean & Sky テーマ）
export const colors = {
  primary: {
    main: '#1e40af',      // Ocean Blue
    light: '#60a5fa',
    dark: '#1e3a8a',
  },
  secondary: {
    main: '#38bdf8',      // Sky Blue
    light: '#7dd3fc',
    dark: '#0284c7',
  },
  accent: {
    gold: '#fbbf24',      // Sunset Gold
    goldLight: '#fcd34d',
    goldDark: '#f59e0b',
  },
  background: {
    cloudWhite: '#f8fafc',
    mist: '#e0f2fe',
    ocean: '#0c4a6e',
  },
  text: {
    primary: '#1f2937',   // gray-900
    secondary: '#4b5563', // gray-600
    tertiary: '#6b7280',  // gray-500
    inverse: '#ffffff',
  },
} as const;

// Phase 2: スペーシングトークン
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// Phase 2: タイポグラフィトークン
export const typography = {
  fontFamily: {
    heading: '"Noto Serif JP", serif',
    body: '"Noto Sans JP", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem',     // 128px
  },
} as const;

// 既存のデザイントークン（後方互換性のため保持）
export const designTokens = {
  // スペーシング
  spacing: {
    section: {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-24 md:py-32',
      xl: 'py-32 md:py-40',
    },
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  
  // タイポグラフィ
  typography: {
    h1: 'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight',
    h2: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    h3: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    h4: 'text-2xl md:text-3xl font-bold',
    h5: 'text-xl md:text-2xl font-semibold',
    h6: 'text-lg md:text-xl font-semibold',
    lead: 'text-xl md:text-2xl text-dark-400',
    body: 'text-base md:text-lg text-dark-300',
    small: 'text-sm md:text-base text-dark-400',
  },
  
  // カード
  card: {
    base: 'bg-dark-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8',
    hover: 'hover:bg-dark-800/70 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all duration-300',
    glass: 'bg-white/5 backdrop-blur-2xl border border-white/10',
  },
  
  // ボタン
  button: {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/50 hover:scale-105',
    secondary: 'bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-primary-500/50 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300',
    ghost: 'text-dark-300 hover:text-white hover:bg-white/5 px-6 py-3 rounded-lg transition-all duration-200',
  },
  
  // グラデーション
  gradient: {
    primary: 'bg-gradient-to-r from-primary-500 via-primary-600 to-orange-600',
    radial: 'bg-gradient-radial from-primary-500/20 via-transparent to-transparent',
    text: 'bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-orange-500',
  },
  
  // 影
  shadow: {
    sm: 'shadow-lg shadow-black/10',
    md: 'shadow-2xl shadow-black/20',
    lg: 'shadow-2xl shadow-primary-500/20',
    glow: 'shadow-2xl shadow-primary-500/30',
  },
}

export type DesignTokens = typeof designTokens
