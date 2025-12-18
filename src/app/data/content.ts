// ═══════════════════════════════════════════════════════════════════════════
// 📝 FICHIER DE CONTENU - SIRIUS EXPEDITION
// ═══════════════════════════════════════════════════════════════════════════
// 
// ⚡ IMPORTANT : Ce fichier centralise TOUT le contenu du site
// 
// 🎯 COMMENT MODIFIER LE CONTENU :
// 1. Trouvez la section que vous voulez modifier
// 2. Changez les valeurs (texte, URLs, prix, etc.)
// 3. Sauvegardez - les changements apparaissent immédiatement
// 
// 💡 CONSEIL : Pour préparer l'utilisation de Strapi ou autre CMS headless,
//    ce fichier sert de structure de données. Plus tard, ces données 
//    viendront d'une API au lieu d'être en dur ici.
// 
// ═══════════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────────────────
// 🏢 CONFIGURATION DU SITE
// ────────────────────────────────────────────────────────────────────────────
export const siteConfig = {
  siteName: "Sirius Expedition",
  tagline: "Discover Madagascar",
  logo: "🐭", // Vous pouvez remplacer par une URL d'image : "https://votre-logo.png"
  
  // Informations de contact
  contact: {
    email: "contact@siriusexpedition.mg",
    phone: "+261 34 00 000 00",
    address: "Antananarivo, Madagascar",
    whatsapp: "+261340000000", // Pour futur bouton WhatsApp
  },
  
  // Liens réseaux sociaux
  social: {
    facebook: "https://www.facebook.com/siriusexpedition",
    youtube: "https://www.youtube.com/@siriusexpedition",
    tripadvisor: "https://www.tripadvisor.com/siriusexpedition",
    google: "https://www.google.com/maps/siriusexpedition",
    instagram: "https://www.instagram.com/siriusexpedition", // Optionnel
  },
  
  // Services techniques (mentionnés sur le site)
  services: {
    hosting: ["GoDaddy", "Netlify"],
    domain: "GoDaddy",
    email: "Zoho Mail Pro",
  },
  
  // Vidéos principales
  videos: {
    mainYouTubeId: "dQw4w9WgXcQ", // Remplacez par votre ID vidéo YouTube
    aboutUsVideoId: "dQw4w9WgXcQ",
    channelUrl: "https://www.youtube.com/@siriusexpedition",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// 🎬 CARROUSEL HERO (Page d'accueil)
// ────────────────────────────────────────────────────────────────────────────
// COMMENT MODIFIER :
// - Changez l'image, le titre, le sous-titre
// - Ajoutez ou supprimez des slides (copiez/collez la structure)
// - Le carrousel défile automatiquement
// ────────────────────────────────────────────────────────────────────────────
export const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1700146606640-0202e6463425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    title: "Discover Madagascar's Wildlife",
    subtitle: "Experience the unique lemurs and exotic biodiversity",
    cta: "Explore Tours",
    videoUrl: "", // Optionnel : ajoutez une URL de vidéo background
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1659944975073-453265ccf3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    title: "Avenue of the Baobabs",
    subtitle: "Witness the majestic baobab trees at sunset",
    cta: "Book Now",
    videoUrl: "",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1570742544137-3a469196c32b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    title: "Tsingy de Bemaraha",
    subtitle: "Explore the stunning limestone formations",
    cta: "Learn More",
    videoUrl: "",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 🏆 BEST SELLERS - TOURS POPULAIRES
// ────────────────────────────────────────────────────────────────────────────
// COMMENT MODIFIER :
// - Pour AJOUTER un tour : copiez un objet existant, changez l'id et les infos
// - Pour SUPPRIMER un tour : supprimez l'objet complet
// - Highlights : liste des points forts (max 4 recommandé)
// ────────────────────────────────────────────────────────────────────────────
export const bestSellers = [
  {
    id: 1,
    title: "Baobab & Tsingy Safari",
    slug: "baobab-tsingy-safari", // Pour les URLs futures
    image: "https://images.unsplash.com/photo-1659944975073-453265ccf3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    gallery: [ // Images additionnelles pour page détaillée
      "https://images.unsplash.com/photo-1659944975073-453265ccf3a6?w=800",
      "https://images.unsplash.com/photo-1570742544137-3a469196c32b?w=800",
    ],
    duration: "7 days",
    location: "West Madagascar",
    price: "€1,299",
    pricePerPerson: true,
    rating: 4.9,
    reviews: 156,
    description: "Explore the iconic Avenue of the Baobabs and the unique Tsingy formations",
    longDescription: "Embark on an unforgettable 7-day journey through Western Madagascar's most spectacular landscapes. Visit the world-famous Avenue of the Baobabs at sunset, explore the UNESCO World Heritage Tsingy de Bemaraha with its razor-sharp limestone formations, and discover hidden local villages. This tour combines adventure, photography opportunities, and cultural immersion.",
    highlights: [
      "Avenue of Baobabs sunset experience",
      "Tsingy UNESCO World Heritage Site",
      "Local Malagasy villages visit",
      "Wildlife spotting opportunities",
    ],
    included: [
      "Professional English/French speaking guide",
      "All accommodation (hotels/lodges)",
      "All meals during the tour",
      "4x4 vehicle with driver",
      "National park fees",
      "Airport transfers",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips (optional)",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Antananarivo", description: "Airport pickup and hotel transfer" },
      { day: 2, title: "Drive to Morondava", description: "Scenic drive through highlands" },
      { day: 3, title: "Avenue of Baobabs", description: "Sunset photography session" },
      // ... add more days
    ],
    videoId: "dQw4w9WgXcQ", // ID vidéo YouTube du tour
    difficulty: "Moderate",
    groupSize: "2-8 people",
    bestTime: "April to November",
  },
  {
    id: 2,
    title: "Lemurs & Wildlife Discovery",
    slug: "lemurs-wildlife-discovery",
    image: "https://images.unsplash.com/photo-1700146606640-0202e6463425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1700146606640-0202e6463425?w=800",
    ],
    duration: "5 days",
    location: "Andasibe-Mantadia",
    price: "€899",
    pricePerPerson: true,
    rating: 4.8,
    reviews: 203,
    description: "Get close to lemurs and discover Madagascar's endemic wildlife",
    longDescription: "Spend 5 amazing days in Madagascar's premier wildlife reserve. Encounter the famous Indri lemurs, the largest living lemurs known for their haunting calls. Explore both day and night in search of rare species including chameleons, frogs, and nocturnal lemurs.",
    highlights: [
      "Indri lemurs close encounters",
      "Night walks for nocturnal species",
      "Rainforest trekking",
      "Chameleon spotting",
    ],
    included: [
      "Expert naturalist guide",
      "Eco-lodge accommodation",
      "All meals",
      "Night walks",
      "Park entrance fees",
    ],
    notIncluded: [
      "Flights to/from Antananarivo",
      "Insurance",
      "Drinks",
    ],
    videoId: "dQw4w9WgXcQ",
    difficulty: "Easy to Moderate",
    groupSize: "2-6 people",
    bestTime: "Year-round",
  },
  {
    id: 3,
    title: "Paradise Island Escape",
    slug: "paradise-island-escape",
    image: "https://images.unsplash.com/photo-1679053806925-7f0f595fab31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    gallery: [],
    duration: "6 days",
    location: "Sainte Marie",
    price: "€1,099",
    pricePerPerson: true,
    rating: 5.0,
    reviews: 89,
    description: "Relax on pristine beaches and explore the tropical paradise of Sainte Marie",
    longDescription: "Escape to Sainte Marie Island, Madagascar's tropical paradise. Enjoy white sand beaches, turquoise waters, and world-class snorkeling. During whale season (July-September), witness humpback whales in their breeding grounds.",
    highlights: [
      "White sand beaches",
      "Snorkeling coral reefs",
      "Whale watching (seasonal)",
      "Island culture & cuisine",
    ],
    included: [
      "Beachfront accommodation",
      "Breakfast daily",
      "Snorkeling equipment",
      "Island tours",
      "Boat transfers",
    ],
    notIncluded: [
      "Flights",
      "Lunch & dinner",
      "Diving activities",
    ],
    videoId: "dQw4w9WgXcQ",
    difficulty: "Easy - Relaxing",
    groupSize: "2-10 people",
    bestTime: "July to September (whales)",
  },
  {
    id: 4,
    title: "Birdwatching Paradise",
    slug: "birdwatching-paradise",
    image: "https://images.unsplash.com/photo-1611611835759-e7d32033c6dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    gallery: [],
    duration: "8 days",
    location: "Multiple Reserves",
    price: "€1,499",
    pricePerPerson: true,
    rating: 4.9,
    reviews: 124,
    description: "Spot over 250 endemic bird species across Madagascar's best locations",
    longDescription: "A specialized birdwatching tour designed for bird enthusiasts. Visit the best birding sites across Madagascar including Andasibe, Ranomafana, and Isalo. Led by expert ornithologist guides who know every call and species.",
    highlights: [
      "250+ endemic bird species",
      "Expert ornithologist guides",
      "Prime photography opportunities",
      "Multiple nature reserves",
    ],
    included: [
      "Specialist bird guide",
      "All accommodations",
      "All meals",
      "Transportation",
      "Park fees",
      "Bird checklist",
    ],
    notIncluded: [
      "Flights",
      "Camera equipment",
      "Insurance",
    ],
    videoId: "dQw4w9WgXcQ",
    difficulty: "Moderate",
    groupSize: "2-6 people",
    bestTime: "September to December",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 🎯 SPÉCIALITÉS DE TOURS
// ────────────────────────────────────────────────────────────────────────────
export const tourSpecialties = [
  {
    id: 1,
    icon: "🦜",
    title: "Birdwatching",
    description: "Discover over 250 endemic bird species in their natural habitats",
    image: "https://images.unsplash.com/photo-1611611835759-e7d32033c6dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    link: "/tours/birdwatching",
  },
  {
    id: 2,
    icon: "📷",
    title: "Photography Tours",
    description: "Capture stunning landscapes and wildlife with expert guidance",
    image: "https://images.unsplash.com/photo-1731355776006-9567df865d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    link: "/tours/photography",
  },
  {
    id: 3,
    icon: "🏖️",
    title: "Fort Dauphin Circuit",
    description: "Explore the southern coast with its unique ecosystem and beaches",
    image: "https://images.unsplash.com/photo-1679053806925-7f0f595fab31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    link: "/tours/fort-dauphin",
  },
  {
    id: 4,
    icon: "🚣",
    title: "Discovery East",
    description: "Navigate the Pangalanes Canal and explore Tamatave and Sainte Marie",
    image: "https://images.unsplash.com/photo-1677667495307-10e01bd9530f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    link: "/tours/east",
  },
  {
    id: 5,
    icon: "🏛️",
    title: "Culture & History",
    description: "Immerse yourself in Madagascar's rich cultural heritage",
    image: "https://images.unsplash.com/photo-1764933268558-3411b587f1e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    link: "/tours/culture",
  },
  {
    id: 6,
    icon: "🌿",
    title: "Nature",
    description: "Experience the incredible biodiversity of Madagascar's ecosystems",
    image: "https://images.unsplash.com/photo-1677667495307-10e01bd9530f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    link: "/tours/nature",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// ⭐ TÉMOIGNAGES CLIENTS (Reviews)
// ────────────────────────────────────────────────────────────────────────────
// Note : Plus tard, ces reviews peuvent venir de Elfsight Review ou Google Reviews API
// ────────────────────────────────────────────────────────────────────────────
export const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "United States",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6D4C41&color=fff",
    rating: 5,
    text: "An absolutely incredible experience! The guides were knowledgeable, and seeing the lemurs in their natural habitat was unforgettable. Sirius Expedition made our dream trip come true!",
    date: "November 2024",
    tour: "Lemurs & Wildlife Discovery",
    verified: true, // Badge "Verified"
    platform: "TripAdvisor", // D'où vient le review
  },
  {
    id: 2,
    name: "Pierre Dubois",
    country: "France",
    avatar: "https://ui-avatars.com/api/?name=Pierre+Dubois&background=6D4C41&color=fff",
    rating: 5,
    text: "L'avenue des baobabs au coucher de soleil était magique. L'organisation était parfaite et notre guide était exceptionnel. Je recommande vivement!",
    date: "October 2024",
    tour: "Baobab & Tsingy Safari",
    verified: true,
    platform: "Google",
  },
  {
    id: 3,
    name: "Emma Schmidt",
    country: "Germany",
    avatar: "https://ui-avatars.com/api/?name=Emma+Schmidt&background=6D4C41&color=fff",
    rating: 5,
    text: "The birdwatching tour exceeded all expectations. We saw so many endemic species and the photography opportunities were endless. Thank you Sirius Expedition!",
    date: "December 2024",
    tour: "Birdwatching Paradise",
    verified: true,
    platform: "TripAdvisor",
  },
  {
    id: 4,
    name: "Marco Rossi",
    country: "Italy",
    avatar: "https://ui-avatars.com/api/?name=Marco+Rossi&background=6D4C41&color=fff",
    rating: 5,
    text: "Magnifico! The beaches of Sainte Marie were paradise, and the whole experience was perfectly organized. Will definitely return!",
    date: "September 2024",
    tour: "Paradise Island Escape",
    verified: true,
    platform: "Google",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 📝 ARTICLES DE BLOG
// ────────────────────────────────────────────────────────────────────────────
export const blogPosts = [
  {
    id: 1,
    title: "Top 10 Endemic Species to See in Madagascar",
    slug: "top-10-endemic-species-madagascar",
    excerpt: "Discover the unique wildlife that makes Madagascar one of the world's most biodiverse hotspots. From lemurs to chameleons, explore the species you can only find here.",
    content: `Full article content here...`, // Pour page détaillée
    image: "https://images.unsplash.com/photo-1700146606640-0202e6463425?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    author: "Marie Rakoto",
    authorAvatar: "https://ui-avatars.com/api/?name=Marie+Rakoto&background=6D4C41&color=fff",
    authorBio: "Wildlife expert and tour guide",
    date: "December 10, 2024",
    category: "Wildlife",
    readTime: "5 min read",
    tags: ["wildlife", "lemurs", "endemic species", "biodiversity"],
    featured: true,
    views: 1248,
  },
  {
    id: 2,
    title: "Best Time to Visit the Avenue of Baobabs",
    slug: "best-time-avenue-baobabs",
    excerpt: "Learn about the optimal seasons and times of day to photograph these iconic trees. Insider tips for capturing the perfect sunset shot.",
    content: "",
    image: "https://images.unsplash.com/photo-1659944975073-453265ccf3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    author: "Jean Andriamanana",
    authorAvatar: "https://ui-avatars.com/api/?name=Jean+Andriamanana&background=6D4C41&color=fff",
    authorBio: "Professional photographer",
    date: "November 28, 2024",
    category: "Photography",
    readTime: "4 min read",
    tags: ["photography", "baobabs", "tips"],
    featured: false,
    views: 856,
  },
  {
    id: 3,
    title: "Birdwatching Guide: Madagascar's Endemic Birds",
    slug: "birdwatching-guide-endemic-birds",
    excerpt: "A comprehensive guide to spotting Madagascar's unique avian species. Includes the best locations and what to bring.",
    content: "",
    image: "https://images.unsplash.com/photo-1611611835759-e7d32033c6dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    author: "Sophie Martin",
    authorAvatar: "https://ui-avatars.com/api/?name=Sophie+Martin&background=6D4C41&color=fff",
    authorBio: "Ornithologist",
    date: "November 15, 2024",
    category: "Birdwatching",
    readTime: "7 min read",
    tags: ["birdwatching", "birds", "guide"],
    featured: false,
    views: 672,
  },
  {
    id: 4,
    title: "Exploring Tsingy de Bemaraha: What to Expect",
    slug: "exploring-tsingy-bemaraha",
    excerpt: "Everything you need to know before visiting this UNESCO World Heritage site. Safety tips and what makes it so special.",
    content: "",
    image: "https://images.unsplash.com/photo-1570742544137-3a469196c32b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    author: "David Rasolofo",
    authorAvatar: "https://ui-avatars.com/api/?name=David+Rasolofo&background=6D4C41&color=fff",
    authorBio: "Adventure guide",
    date: "October 30, 2024",
    category: "Adventure",
    readTime: "6 min read",
    tags: ["tsingy", "unesco", "adventure"],
    featured: false,
    views: 945,
  },
  {
    id: 5,
    title: "Cultural Immersion: Villages and Traditions",
    slug: "cultural-immersion-villages-traditions",
    excerpt: "Experience the rich cultural heritage of Madagascar through its people, traditions, and local communities.",
    content: "",
    image: "https://images.unsplash.com/photo-1764933268558-3411b587f1e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    author: "Hanitra Razafy",
    authorAvatar: "https://ui-avatars.com/api/?name=Hanitra+Razafy&background=6D4C41&color=fff",
    authorBio: "Cultural expert",
    date: "October 12, 2024",
    category: "Culture",
    readTime: "5 min read",
    tags: ["culture", "traditions", "villages"],
    featured: false,
    views: 534,
  },
  {
    id: 6,
    title: "Paradise Beaches: Sainte Marie Island Guide",
    slug: "paradise-beaches-sainte-marie",
    excerpt: "Your complete guide to Madagascar's tropical island paradise. Best beaches, snorkeling spots, and where to stay.",
    content: "",
    image: "https://images.unsplash.com/photo-1679053806925-7f0f595fab31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    author: "Lucas Bernard",
    authorAvatar: "https://ui-avatars.com/api/?name=Lucas+Bernard&background=6D4C41&color=fff",
    authorBio: "Island specialist",
    date: "September 25, 2024",
    category: "Travel",
    readTime: "8 min read",
    tags: ["beaches", "sainte marie", "island"],
    featured: false,
    views: 1123,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 📺 GALERIE VIDÉOS
// ────────────────────────────────────────────────────────────────────────────
export const videoGallery = [
  {
    id: 1,
    title: "Welcome to Sirius Expedition",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    category: "About Us",
  },
  {
    id: 2,
    title: "Lemurs of Madagascar",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    category: "Wildlife",
  },
  {
    id: 3,
    title: "Baobab Avenue Sunset",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    category: "Landscapes",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// ❓ FAQ - QUESTIONS FRÉQUENTES
// ────────────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    id: 1,
    question: "What is the best time to visit Madagascar?",
    answer: "The best time is April to November (dry season). July-September is ideal for whale watching in Sainte Marie.",
    category: "General",
  },
  {
    id: 2,
    question: "Do I need a visa for Madagascar?",
    answer: "Most nationalities can get a visa on arrival at the airport. It's valid for 30-90 days depending on your needs.",
    category: "Travel Info",
  },
  {
    id: 3,
    question: "Are your tours suitable for families with children?",
    answer: "Yes! We offer family-friendly tours. Some wildlife tours are perfect for kids, while adventure tours have age restrictions.",
    category: "Tours",
  },
  {
    id: 4,
    question: "What's included in the tour price?",
    answer: "Typically includes guide, accommodation, meals, transport, and park fees. Check each tour's details for specifics.",
    category: "Pricing",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🔮 PRÉPARATION POUR CMS HEADLESS (Strapi, etc.)
// ═══════════════════════════════════════════════════════════════════════════
// 
// Ce fichier est structuré pour faciliter la migration vers un CMS.
// Plus tard, au lieu d'importer depuis ce fichier, vous ferez :
// 
// ```typescript
// const response = await fetch('https://votre-cms.com/api/best-sellers');
// const bestSellers = await response.json();
// ```
// 
// La structure des données restera identique !
// ═══════════════════════════════════════════════════════════════════════════
