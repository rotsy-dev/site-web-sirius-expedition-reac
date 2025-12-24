// Types pour le contenu du site Sirius Expedition

export interface SiteConfig {
  siteName: string;
  tagline: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
  };
  social: {
    facebook: string;
    youtube: string;
    tripadvisor: string;
    google: string;
    instagram?: string;
  };
  services: {
    hosting: string[];
    domain: string;
    email: string;
  };
  videos: {
    mainYouTubeId: string;
    aboutUsVideoId: string;
    channelUrl: string;
  };
}

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  videoUrl?: string;
}

export interface Tour {
  id: number;
  title: string;
  slug: string;
  image: string;
  duration: string;
  location: string;
  price: string;
  pricePerPerson?: boolean;
  rating: number;
  reviews: number;
  description: string;
  longDescription?: string;
  highlights: string[];
  difficulty?: string;
  groupSize?: string;
  bestTime?: string;
}

export interface TourSpecialty {
  id: number;
  name?: string; // Ancien nom, gardé pour compatibilité
  title: string; // Nom utilisé dans les données (obligatoire)
  icon: string;
  description: string;
  image: string;
  tours?: number; // Optionnel
  slug?: string; // Optionnel
  link: string; // Lien utilisé dans les données (obligatoire)
}

export interface Review {
  id: number;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  tour: string;
  platform: 'TripAdvisor' | 'Google';
  verified: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  authorBio: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  views: number;
}

export interface Video {
  id: number;
  title: string;
  youtubeId: string;
  thumbnail: string;
  description?: string;
  category?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface ContentData {
  siteConfig: SiteConfig;
  heroSlides: HeroSlide[];
  bestSellers: Tour[];
  tourSpecialties: TourSpecialty[];
  reviews: Review[];
  blogPosts: BlogPost[];
  videoGallery: Video[];
  faqs: FAQ[];
}

// Type pour les sections modifiables dans le content manager
export type ContentSection = keyof ContentData;

