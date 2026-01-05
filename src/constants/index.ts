// ═══════════════════════════════════════════════════════════════════════════
// 📋 CONSTANTES - SIRIUS EXPEDITION
// ═══════════════════════════════════════════════════════════════════════════
// Centralisation de toutes les constantes pour faciliter la maintenance

// ────────────────────────────────────────────────────────────────────────────
// 🔐 STORAGE KEYS
// ────────────────────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  CONTENT: 'sirius_content',
  AUTH: 'sirius_admin_auth',
  THEME: 'sirius_theme',
} as const;

// ────────────────────────────────────────────────────────────────────────────
// 🎯 SECTIONS DU SITE
// ────────────────────────────────────────────────────────────────────────────
export const SITE_SECTIONS = {
  HOME: 'home',
  TOURS: 'tours',
  BLOGS: 'blogs',
  ABOUT: 'about',
  QUOTE: 'quote',
  CONTACT: 'contact',
  ADMIN: 'admin',
} as const;

export type SiteSection = typeof SITE_SECTIONS[keyof typeof SITE_SECTIONS];

// ────────────────────────────────────────────────────────────────────────────
// 📱 BREAKPOINTS (pour cohérence avec Tailwind)
// ────────────────────────────────────────────────────────────────────────────
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// ⏱️ TIMING & ANIMATIONS
// ────────────────────────────────────────────────────────────────────────────
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.6,
  VERY_SLOW: 1.0,
} as const;

export const TRANSITION_EASING = {
  EASE_OUT: [0.22, 1, 0.36, 1],
  EASE_IN_OUT: [0.32, 0.72, 0, 1],
  SPRING: { type: 'spring' as const, stiffness: 200, damping: 20 },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// 🎨 DESIGN TOKENS
// ────────────────────────────────────────────────────────────────────────────
export const SPACING = {
  SECTION_PADDING: {
    MOBILE: 'py-12 sm:py-16',
    DESKTOP: 'md:py-20 lg:py-24',
  },
  CONTAINER_PADDING: {
    MOBILE: 'px-4 sm:px-6',
    DESKTOP: 'lg:px-8',
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// 🔔 MESSAGES & NOTIFICATIONS
// ────────────────────────────────────────────────────────────────────────────
export const MESSAGES = {
  SUCCESS: {
    CONTENT_IMPORTED: 'Contenu importé avec succès !',
    CONTENT_EXPORTED: 'Contenu exporté avec succès !',
    CONTENT_RESET: 'Contenu réinitialisé !',
    MESSAGE_SENT: 'Message envoyé avec succès !',
  },
  ERROR: {
    IMPORT_FAILED: 'Erreur lors de l\'importation',
    LOAD_FAILED: 'Erreur lors du chargement',
    SAVE_FAILED: 'Erreur lors de la sauvegarde',
    INVALID_FILE: 'Fichier invalide',
  },
  CONFIRM: {
    RESET_CONTENT: 'Êtes-vous sûr de vouloir réinitialiser tout le contenu ?',
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// 🔍 VALIDATION
// ────────────────────────────────────────────────────────────────────────────
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\+\-\(\)]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_NAME_LENGTH: 100,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// 🎯 CONFIGURATION PAR DÉFAUT
// ────────────────────────────────────────────────────────────────────────────
export const DEFAULT_CONFIG = {
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
  CAROUSEL_AUTOPLAY_SPEED: 5000,
  CAROUSEL_TRANSITION_SPEED: 800,
  ITEMS_PER_PAGE: 6,
} as const;
