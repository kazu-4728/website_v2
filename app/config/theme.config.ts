/**
 * 完全なテーマシステム
 * 容易に他のテーマに切り替え可能
 */

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    accent: Record<string, string>;
    background: Record<string, string>;
    text: Record<string, string>;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string;
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  animations: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
}

// GitHub Docsテーマ
export const githubDocsTheme: ThemeConfig = {
  name: 'GitHub Docs',
  description: 'Professional documentation theme inspired by GitHub',
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#ff8a3d',
      600: '#ff6b35',
      700: '#ea580c',
      800: '#c2410c',
      900: '#9a3412',
    },
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    background: {
      50: '#f8fafc',
      900: '#0f172a',
      950: '#020617',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      inverse: '#0f172a',
    },
  },
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgb(255 138 61 / 0.3)',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// Stripeスタイルテーマ
export const stripeTheme: ThemeConfig = {
  name: 'Stripe',
  description: 'Modern SaaS theme inspired by Stripe',
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#635bff',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#00d4ff',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    background: {
      50: '#ffffff',
      900: '#0a2540',
      950: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aab8c5',
      tertiary: '#6f7e8c',
      inverse: '#0a2540',
    },
  },
  typography: {
    fontFamily: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 12px 0 rgb(0 0 0 / 0.1)',
    lg: '0 12px 24px 0 rgb(0 0 0 / 0.15)',
    xl: '0 20px 40px 0 rgb(0 0 0 / 0.2)',
    '2xl': '0 32px 64px 0 rgb(0 0 0 / 0.25)',
    glow: '0 0 40px rgb(99 91 255 / 0.4)',
  },
  animations: {
    duration: {
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
};

// 現在のテーマ（環境変数で切り替え可能）
export const currentTheme = process.env.NEXT_PUBLIC_THEME === 'stripe' ? stripeTheme : githubDocsTheme;

// テーマ一覧
export const availableThemes = {
  'github-docs': githubDocsTheme,
  'stripe': stripeTheme,
};

/**
 * テーマをCSS変数として生成
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  const cssVars: string[] = [];
  
  // Colors
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    cssVars.push(`--color-primary-${key}: ${value};`);
  });
  
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    cssVars.push(`--color-secondary-${key}: ${value};`);
  });
  
  // Typography
  cssVars.push(`--font-heading: ${theme.typography.fontFamily.heading};`);
  cssVars.push(`--font-body: ${theme.typography.fontFamily.body};`);
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars.push(`--spacing-${key}: ${value};`);
  });
  
  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    cssVars.push(`--shadow-${key}: ${value};`);
  });
  
  return `:root {\n  ${cssVars.join('\n  ')}\n}`;
}
