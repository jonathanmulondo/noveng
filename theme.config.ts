// NovEng Theme Configuration - Purple/Pink Creative Theme

export const theme = {
  colors: {
    // Primary purple/pink gradient palette
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',  // Main purple
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    secondary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',  // Main pink
      600: '#db2777',
      700: '#be185d',
      800: '#9f1239',
      900: '#831843',
    },
    accent: {
      purple: '#a855f7',
      pink: '#ec4899',
      fuchsia: '#d946ef',
      violet: '#8b5cf6',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // Breadboard colors for simulator
    breadboard: {
      base: '#f5e6d3',        // Beige background
      holes: '#8b7355',       // Dark brown holes
      powerRail: '#dc2626',   // Red power rail
      groundRail: '#1e40af',  // Blue ground rail
      wire: {
        red: '#ef4444',
        black: '#1f2937',
        green: '#22c55e',
        blue: '#3b82f6',
        yellow: '#eab308',
        orange: '#f97316',
      }
    }
  },

  gradients: {
    primary: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    hero: 'linear-gradient(135deg, #7e22ce 0%, #a855f7 50%, #ec4899 100%)',
    card: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
    button: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
    accent: 'linear-gradient(90deg, #d946ef 0%, #f472b6 100%)',
  },

  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
      display: '"Space Grotesk", "Inter", sans-serif',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
  },

  spacing: {
    // Minimalist spacing - more generous white space
    section: '4rem',      // Between major sections
    card: '1.5rem',       // Inside cards
    element: '1rem',      // Between elements
    tight: '0.5rem',      // Compact spacing
  },

  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(168, 85, 247, 0.05)',
    md: '0 4px 6px -1px rgba(168, 85, 247, 0.1), 0 2px 4px -1px rgba(168, 85, 247, 0.06)',
    lg: '0 10px 15px -3px rgba(168, 85, 247, 0.1), 0 4px 6px -2px rgba(168, 85, 247, 0.05)',
    xl: '0 20px 25px -5px rgba(168, 85, 247, 0.1), 0 10px 10px -5px rgba(168, 85, 247, 0.04)',
    glow: '0 0 20px rgba(168, 85, 247, 0.3)',
    pink: '0 0 20px rgba(236, 72, 153, 0.3)',
  },

  animations: {
    // Smooth, minimal animations
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      smooth: 'cubic-bezier(0.45, 0, 0.55, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  }
};

export type Theme = typeof theme;
