/**
 * Design System - Thème Mocha & Vanilla pour Agence de Voyage
 * Toutes les couleurs et styles sont centralisés ici pour une cohérence globale
 */

export const COLORS = {
  // Mocha (couleurs sombres)
  mocha: {
    dark: '#3D2F2B',
    base: '#4B3935',
    light: '#6B5B52',
  },
  // Vanilla (couleurs claires)
  vanilla: {
    dark: '#E8DCC8',
    base: '#F0E7D5',
    light: '#F8F3E8',
  },
  // Accents voyage
  accent: {
    travel: '#2FB5A3',
    travelHover: '#26A393',
    gold: '#D4A574',
    goldHover: '#C4965F',
  },
  // Neutres
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
} as const;

export const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['Monaco', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const TRANSITIONS = {
  fast: '150ms',
  base: '300ms',
  slow: '500ms',
  slower: '800ms',
} as const;

// Classes Tailwind réutilisables
export const CLASSES = {
  // Cards
  card: 'bg-[#F0E7D5] rounded-3xl border-2 border-[#D4A574]/20 shadow-lg hover:shadow-2xl transition-all duration-300',
  cardHover: 'hover:border-[#4B3935] hover:-translate-y-2',
  
  // Buttons
  buttonPrimary: 'bg-[#2FB5A3] hover:bg-[#26A393] text-white font-bold rounded-xl px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95',
  buttonSecondary: 'bg-[#4B3935] hover:bg-[#3D2F2B] text-[#F0E7D5] font-bold rounded-xl px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95',
  buttonAccent: 'bg-[#D4A574] hover:bg-[#C4965F] text-[#4B3935] font-bold rounded-xl px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95',
  
  // Section headers
  sectionHeader: 'text-center mb-12 md:mb-16',
  sectionBadge: 'inline-block px-5 py-1.5 bg-[#D4A574] text-white rounded-full text-xs md:text-sm font-bold tracking-wider mb-4',
  sectionTitle: 'text-3xl md:text-4xl lg:text-5xl font-black text-[#4B3935] mb-4 tracking-tight',
  sectionSubtitle: 'text-base md:text-lg text-[#4B3935]/70 max-w-2xl mx-auto leading-relaxed',
  
  // Backgrounds
  bgMocha: 'bg-[#4B3935]',
  bgVanilla: 'bg-[#F0E7D5]',
  bgGradient: 'bg-gradient-to-br from-[#F0E7D5] via-[#F8F5F0] to-[#F0E7D5]',
} as const;
