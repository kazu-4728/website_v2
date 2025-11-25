/**
 * デザイントークン定義
 * デザインの一貫性を保つための基本値
 */

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
