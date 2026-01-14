// config/seoConfig.ts
import {
    generateOrganizationSchema,
    generateBreadcrumbSchema,
    generateFAQSchema
} from '../components/SEO';

export interface PageSEO {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    schema?: object;
    noindex?: boolean;
}

export interface SEOConfig {
    [key: string]: {
        en: PageSEO;
        fr: PageSEO;
        de: PageSEO;
        it: PageSEO;
    };
}

// ============================================
// CONFIGURATION SEO CENTRALISÉE
// ============================================
export const seoConfig: SEOConfig = {
    // PAGE D'ACCUEIL
    home: {
        en: {
            title: 'Discover Madagascar',
            description: 'Explore Madagascar with Sirius Expedition - Premier tour operator offering unforgettable safaris, wildlife expeditions, and beach adventures in Madagascar. Book your dream vacation today!',
            keywords: 'Madagascar tours, Madagascar safari, Madagascar travel, Madagascar expeditions, Madagascar wildlife, Madagascar beaches, Madagascar adventure, tour operator Madagascar, Madagascar vacation',
            schema: generateOrganizationSchema(),
        },
        fr: {
            title: 'Découvrez Madagascar',
            description: 'Explorez Madagascar avec Sirius Expedition - Opérateur de voyages premium proposant des safaris inoubliables, des expéditions naturelles et des aventures plage à Madagascar. Réservez vos vacances de rêve dès aujourd\'hui!',
            keywords: 'circuits Madagascar, safari Madagascar, voyage Madagascar, expéditions Madagascar, faune Madagascar, plages Madagascar, aventure Madagascar, tour opérateur Madagascar, vacances Madagascar',
            schema: generateOrganizationSchema(),
        },
        de: {
            title: 'Entdecken Sie Madagaskar',
            description: 'Erkunden Sie Madagaskar mit Sirius Expedition - Premium-Reiseveranstalter für unvergessliche Safaris, Wildlife-Expeditionen und Strandabenteuer in Madagaskar. Buchen Sie Ihren Traumurlaub noch heute!',
            keywords: 'Madagaskar Touren, Madagaskar Safari, Madagaskar Reisen, Madagaskar Expeditionen, Madagaskar Tierwelt, Madagaskar Strände, Madagaskar Abenteuer, Reiseveranstalter Madagaskar, Madagaskar Urlaub',
            schema: generateOrganizationSchema(),
        },
        it: {
            title: 'Scopri il Madagascar',
            description: 'Esplora il Madagascar con Sirius Expedition - Tour operator premium che offre safari indimenticabili, spedizioni naturalistiche e avventure balneari in Madagascar. Prenota la tua vacanza da sogno oggi!',
            keywords: 'tour Madagascar, safari Madagascar, viaggi Madagascar, spedizioni Madagascar, fauna Madagascar, spiagge Madagascar, avventura Madagascar, tour operator Madagascar, vacanze Madagascar',
            schema: generateOrganizationSchema(),
        },
    },

    // PAGE TOURS
    tours: {
        en: {
            title: 'Madagascar Tours & Expeditions',
            description: 'Browse our collection of carefully curated Madagascar tours. From wildlife safaris to beach getaways, lemur watching to baobab adventures. Find your perfect Madagascar expedition with Sirius Expedition.',
            keywords: 'Madagascar tours, Madagascar safari packages, Madagascar wildlife tours, Madagascar beach holidays, lemur watching tours, baobab avenue tours, Madagascar adventure tours, Madagascar expedition packages',
            image: '/tours-hero.jpg',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/en' },
                { name: 'Tours', url: '/en/tours' },
            ]),
        },
        fr: {
            title: 'Circuits & Expéditions à Madagascar',
            description: 'Parcourez notre collection de circuits Madagascar soigneusement sélectionnés. Des safaris nature aux escapades plage, observation des lémuriens aux aventures baobabs. Trouvez votre expédition Madagascar parfaite avec Sirius Expedition.',
            keywords: 'circuits Madagascar, forfaits safari Madagascar, circuits faune Madagascar, vacances plage Madagascar, observation lémuriens, circuits allée baobabs, circuits aventure Madagascar, forfaits expédition Madagascar',
            image: '/tours-hero.jpg',
            schema: generateBreadcrumbSchema([
                { name: 'Accueil', url: '/fr' },
                { name: 'Circuits', url: '/fr/tours' },
            ]),
        },
        de: {
            title: 'Madagaskar Touren & Expeditionen',
            description: 'Durchsuchen Sie unsere Sammlung sorgfältig kuratierter Madagaskar-Touren. Von Wildlife-Safaris bis zu Strandausflügen, Lemuren-Beobachtung bis zu Baobab-Abenteuern. Finden Sie Ihre perfekte Madagaskar-Expedition mit Sirius Expedition.',
            keywords: 'Madagaskar Touren, Madagaskar Safari-Pakete, Madagaskar Wildlife-Touren, Madagaskar Strandurlaub, Lemuren-Beobachtungstouren, Baobab-Allee-Touren, Madagaskar Abenteuertouren, Madagaskar Expeditionspakete',
            image: '/tours-hero.jpg',
            schema: generateBreadcrumbSchema([
                { name: 'Startseite', url: '/de' },
                { name: 'Touren', url: '/de/tours' },
            ]),
        },
        it: {
            title: 'Tour & Spedizioni in Madagascar',
            description: 'Sfoglia la nostra collezione di tour Madagascar accuratamente selezionati. Dai safari naturalistici alle fughe in spiaggia, osservazione dei lemuri alle avventure baobab. Trova la tua spedizione Madagascar perfetta con Sirius Expedition.',
            keywords: 'tour Madagascar, pacchetti safari Madagascar, tour fauna Madagascar, vacanze mare Madagascar, tour osservazione lemuri, tour viale baobab, tour avventura Madagascar, pacchetti spedizione Madagascar',
            image: '/tours-hero.jpg',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/it' },
                { name: 'Tour', url: '/it/tours' },
            ]),
        },
    },

    // PAGE BLOG
    blog: {
        en: {
            title: 'Madagascar Travel Blog',
            description: 'Discover travel tips, destination guides, wildlife insights, and inspiring stories about Madagascar. Get expert advice for planning your Madagascar adventure from Sirius Expedition.',
            keywords: 'Madagascar travel blog, Madagascar travel tips, Madagascar travel guide, Madagascar wildlife blog, Madagascar destination guide, Madagascar travel stories, Madagascar adventure blog',
            image: '/blog-hero.jpg',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/en' },
                { name: 'Blog', url: '/en/blog' },
            ]),
        },
        fr: {
            title: 'Blog Voyage Madagascar',
            description: 'Découvrez des conseils de voyage, des guides de destination, des aperçus de la faune et des histoires inspirantes sur Madagascar. Obtenez des conseils d\'experts pour planifier votre aventure Madagascar avec Sirius Expedition.',
            keywords: 'blog voyage Madagascar, conseils voyage Madagascar, guide voyage Madagascar, blog faune Madagascar, guide destination Madagascar, récits voyage Madagascar, blog aventure Madagascar',
            image: '/blog-hero.jpg',
            schema: generateBreadcrumbSchema([
                { name: 'Accueil', url: '/fr' },
                { name: 'Blog', url: '/fr/blog' },
            ]),
        },
        de: {
            title: 'Madagaskar Reiseblog',
            description: 'Entdecken Sie Reisetipps, Reiseführer, Wildlife-Einblicke und inspirierende Geschichten über Madagaskar. Erhalten Sie Expertenrat für die Planung Ihres Madagaskar-Abenteuers von Sirius Expedition.',
            keywords: 'Madagaskar Reiseblog, Madagaskar Reisetipps, Madagaskar Reiseführer, Madagaskar Wildlife-Blog, Madagaskar Zielführer, Madagaskar Reisegeschichten, Madagaskar Abenteuerblog',
            image: '/blog-hero.jpg',
            schema: generateBreadcrumbSchema([
                { name: 'Startseite', url: '/de' },
                { name: 'Blog', url: '/de/blog' },
            ]),
        },
        it: {
            title: 'Blog Viaggi Madagascar',
            description: 'Scopri consigli di viaggio, guide alle destinazioni, approfondimenti sulla fauna e storie ispiratrici sul Madagascar. Ottieni consigli esperti per pianificare la tua avventura Madagascar con Sirius Expedition.',
            keywords: 'blog viaggi Madagascar, consigli viaggio Madagascar, guida viaggio Madagascar, blog fauna Madagascar, guida destinazione Madagascar, storie viaggio Madagascar, blog avventura Madagascar',
            image: '/blog-hero.jpg',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/it' },
                { name: 'Blog', url: '/it/blog' },
            ]),
        },
    },

    // PAGE CONTACT
    contact: {
        en: {
            title: 'Contact Us',
            description: 'Get in touch with Sirius Expedition for your Madagascar travel inquiries. Our expert team is ready to help you plan your perfect Madagascar adventure. Contact us today!',
            keywords: 'contact Sirius Expedition, Madagascar travel inquiry, Madagascar tour booking, contact Madagascar tour operator, Madagascar travel consultation',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/en' },
                { name: 'Contact', url: '/en/contact' },
            ]),
        },
        fr: {
            title: 'Contactez-Nous',
            description: 'Contactez Sirius Expedition pour vos demandes de voyage à Madagascar. Notre équipe d\'experts est prête à vous aider à planifier votre aventure Madagascar parfaite. Contactez-nous dès aujourd\'hui!',
            keywords: 'contacter Sirius Expedition, demande voyage Madagascar, réservation circuit Madagascar, contacter tour opérateur Madagascar, consultation voyage Madagascar',
            schema: generateBreadcrumbSchema([
                { name: 'Accueil', url: '/fr' },
                { name: 'Contact', url: '/fr/contact' },
            ]),
        },
        de: {
            title: 'Kontaktieren Sie Uns',
            description: 'Kontaktieren Sie Sirius Expedition für Ihre Madagaskar-Reiseanfragen. Unser Expertenteam ist bereit, Ihnen bei der Planung Ihres perfekten Madagaskar-Abenteuers zu helfen. Kontaktieren Sie uns heute!',
            keywords: 'Sirius Expedition kontaktieren, Madagaskar Reiseanfrage, Madagaskar Tour buchen, Madagaskar Reiseveranstalter kontaktieren, Madagaskar Reiseberatung',
            schema: generateBreadcrumbSchema([
                { name: 'Startseite', url: '/de' },
                { name: 'Kontakt', url: '/de/contact' },
            ]),
        },
        it: {
            title: 'Contattaci',
            description: 'Contatta Sirius Expedition per le tue richieste di viaggio in Madagascar. Il nostro team di esperti è pronto ad aiutarti a pianificare la tua perfetta avventura Madagascar. Contattaci oggi!',
            keywords: 'contattare Sirius Expedition, richiesta viaggio Madagascar, prenotazione tour Madagascar, contattare tour operator Madagascar, consulenza viaggio Madagascar',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/it' },
                { name: 'Contatto', url: '/it/contact' },
            ]),
        },
    },

    // PAGE ABOUT
    about: {
        en: {
            title: 'About Us',
            description: 'Learn about Sirius Expedition, your trusted Madagascar travel partner since [YEAR]. Discover our mission, values, and commitment to providing exceptional Madagascar expeditions and sustainable tourism.',
            keywords: 'about Sirius Expedition, Madagascar tour operator, Madagascar travel company, sustainable tourism Madagascar, Madagascar expedition company, Madagascar travel experts',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/en' },
                { name: 'About', url: '/en/about' },
            ]),
        },
        fr: {
            title: 'À Propos',
            description: 'Découvrez Sirius Expedition, votre partenaire de voyage Madagascar de confiance depuis [ANNÉE]. Découvrez notre mission, nos valeurs et notre engagement à fournir des expéditions Madagascar exceptionnelles et un tourisme durable.',
            keywords: 'à propos Sirius Expedition, tour opérateur Madagascar, agence voyage Madagascar, tourisme durable Madagascar, compagnie expédition Madagascar, experts voyage Madagascar',
            schema: generateBreadcrumbSchema([
                { name: 'Accueil', url: '/fr' },
                { name: 'À Propos', url: '/fr/about' },
            ]),
        },
        de: {
            title: 'Über Uns',
            description: 'Erfahren Sie mehr über Sirius Expedition, Ihren vertrauenswürdigen Madagaskar-Reisepartner seit [JAHR]. Entdecken Sie unsere Mission, Werte und unser Engagement für außergewöhnliche Madagaskar-Expeditionen und nachhaltigen Tourismus.',
            keywords: 'über Sirius Expedition, Madagaskar Reiseveranstalter, Madagaskar Reiseunternehmen, nachhaltiger Tourismus Madagaskar, Madagaskar Expeditionsunternehmen, Madagaskar Reiseexperten',
            schema: generateBreadcrumbSchema([
                { name: 'Startseite', url: '/de' },
                { name: 'Über Uns', url: '/de/about' },
            ]),
        },
        it: {
            title: 'Chi Siamo',
            description: 'Scopri Sirius Expedition, il tuo partner di viaggio Madagascar di fiducia dal [ANNO]. Scopri la nostra missione, i nostri valori e il nostro impegno nel fornire spedizioni Madagascar eccezionali e turismo sostenibile.',
            keywords: 'chi siamo Sirius Expedition, tour operator Madagascar, agenzia viaggi Madagascar, turismo sostenibile Madagascar, compagnia spedizioni Madagascar, esperti viaggio Madagascar',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/it' },
                { name: 'Chi Siamo', url: '/it/about' },
            ]),
        },
    },

    // PAGE QUOTE
    quote: {
        en: {
            title: 'Request a Quote',
            description: 'Get a personalized quote for your Madagascar adventure. Tell us about your dream trip and our experts will create a custom itinerary tailored to your preferences and budget.',
            keywords: 'Madagascar quote, Madagascar tour quote, Madagascar travel quote, custom Madagascar itinerary, Madagascar trip planning, Madagascar tour pricing',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/en' },
                { name: 'Quote', url: '/en/quote' },
            ]),
        },
        fr: {
            title: 'Demander un Devis',
            description: 'Obtenez un devis personnalisé pour votre aventure Madagascar. Parlez-nous de votre voyage de rêve et nos experts créeront un itinéraire sur mesure adapté à vos préférences et votre budget.',
            keywords: 'devis Madagascar, devis circuit Madagascar, devis voyage Madagascar, itinéraire Madagascar personnalisé, planification voyage Madagascar, tarif circuit Madagascar',
            schema: generateBreadcrumbSchema([
                { name: 'Accueil', url: '/fr' },
                { name: 'Devis', url: '/fr/quote' },
            ]),
        },
        de: {
            title: 'Angebot Anfordern',
            description: 'Erhalten Sie ein personalisiertes Angebot für Ihr Madagaskar-Abenteuer. Erzählen Sie uns von Ihrer Traumreise und unsere Experten erstellen eine maßgeschneiderte Reiseroute nach Ihren Wünschen und Budget.',
            keywords: 'Madagaskar Angebot, Madagaskar Tour Angebot, Madagaskar Reise Angebot, individuelle Madagaskar Reiseroute, Madagaskar Reiseplanung, Madagaskar Tour Preise',
            schema: generateBreadcrumbSchema([
                { name: 'Startseite', url: '/de' },
                { name: 'Angebot', url: '/de/quote' },
            ]),
        },
        it: {
            title: 'Richiedi un Preventivo',
            description: 'Ottieni un preventivo personalizzato per la tua avventura Madagascar. Raccontaci del tuo viaggio dei sogni e i nostri esperti creeranno un itinerario su misura per le tue preferenze e budget.',
            keywords: 'preventivo Madagascar, preventivo tour Madagascar, preventivo viaggio Madagascar, itinerario Madagascar personalizzato, pianificazione viaggio Madagascar, prezzi tour Madagascar',
            schema: generateBreadcrumbSchema([
                { name: 'Home', url: '/it' },
                { name: 'Preventivo', url: '/it/quote' },
            ]),
        },
    },

    // PAGES LÉGALES
    terms: {
        en: {
            title: 'Terms & Conditions',
            description: 'Read the terms and conditions for booking tours with Sirius Expedition. Understand our policies, cancellation rules, and legal agreements.',
            keywords: 'terms and conditions, booking terms, tour policies, cancellation policy',
            noindex: true,
        },
        fr: {
            title: 'Conditions Générales',
            description: 'Lisez les conditions générales de réservation de circuits avec Sirius Expedition. Comprenez nos politiques, règles d\'annulation et accords juridiques.',
            keywords: 'conditions générales, conditions de réservation, politiques de circuits, politique d\'annulation',
            noindex: true,
        },
        de: {
            title: 'Allgemeine Geschäftsbedingungen',
            description: 'Lesen Sie die Allgemeinen Geschäftsbedingungen für die Buchung von Touren mit Sirius Expedition. Verstehen Sie unsere Richtlinien, Stornierungsregeln und rechtlichen Vereinbarungen.',
            keywords: 'Allgemeine Geschäftsbedingungen, Buchungsbedingungen, Tour-Richtlinien, Stornierungsbedingungen',
            noindex: true,
        },
        it: {
            title: 'Termini e Condizioni',
            description: 'Leggi i termini e le condizioni per la prenotazione di tour con Sirius Expedition. Comprendi le nostre politiche, regole di cancellazione e accordi legali.',
            keywords: 'termini e condizioni, termini di prenotazione, politiche tour, politica di cancellazione',
            noindex: true,
        },
    },

    privacy: {
        en: {
            title: 'Privacy Policy',
            description: 'Learn how Sirius Expedition collects, uses, and protects your personal information. Read our comprehensive privacy policy.',
            keywords: 'privacy policy, data protection, personal information, GDPR',
            noindex: true,
        },
        fr: {
            title: 'Politique de Confidentialité',
            description: 'Découvrez comment Sirius Expedition collecte, utilise et protège vos informations personnelles. Lisez notre politique de confidentialité complète.',
            keywords: 'politique de confidentialité, protection des données, informations personnelles, RGPD',
            noindex: true,
        },
        de: {
            title: 'Datenschutzerklärung',
            description: 'Erfahren Sie, wie Sirius Expedition Ihre persönlichen Daten erfasst, verwendet und schützt. Lesen Sie unsere umfassende Datenschutzerklärung.',
            keywords: 'Datenschutzerklärung, Datenschutz, persönliche Informationen, DSGVO',
            noindex: true,
        },
        it: {
            title: 'Informativa sulla Privacy',
            description: 'Scopri come Sirius Expedition raccoglie, utilizza e protegge le tue informazioni personali. Leggi la nostra informativa sulla privacy completa.',
            keywords: 'informativa sulla privacy, protezione dati, informazioni personali, GDPR',
            noindex: true,
        },
    },

    cookies: {
        en: {
            title: 'Cookie Policy',
            description: 'Understand how Sirius Expedition uses cookies to improve your browsing experience. Learn about our cookie policy and preferences.',
            keywords: 'cookie policy, cookies, website cookies, browser cookies',
            noindex: true,
        },
        fr: {
            title: 'Politique des Cookies',
            description: 'Comprenez comment Sirius Expedition utilise les cookies pour améliorer votre expérience de navigation. Découvrez notre politique de cookies et préférences.',
            keywords: 'politique des cookies, cookies, cookies de site web, cookies de navigateur',
            noindex: true,
        },
        de: {
            title: 'Cookie-Richtlinie',
            description: 'Verstehen Sie, wie Sirius Expedition Cookies verwendet, um Ihr Surferlebnis zu verbessern. Erfahren Sie mehr über unsere Cookie-Richtlinie und Einstellungen.',
            keywords: 'Cookie-Richtlinie, Cookies, Website-Cookies, Browser-Cookies',
            noindex: true,
        },
        it: {
            title: 'Politica dei Cookie',
            description: 'Comprendi come Sirius Expedition utilizza i cookie per migliorare la tua esperienza di navigazione. Scopri la nostra politica sui cookie e le preferenze.',
            keywords: 'politica dei cookie, cookie, cookie del sito web, cookie del browser',
            noindex: true,
        },
    },

    faq: {
        en: {
            title: 'Frequently Asked Questions',
            description: 'Find answers to common questions about traveling to Madagascar with Sirius Expedition. Get information on tours, bookings, and more.',
            keywords: 'Madagascar FAQ, travel questions, tour questions, booking questions',
            noindex: true,

        },
        fr: {
            title: 'Foire Aux Questions',
            description: 'Trouvez des réponses aux questions courantes sur les voyages à Madagascar avec Sirius Expedition. Obtenez des informations sur les circuits, les réservations, et plus encore.',
            keywords: 'FAQ Madagascar, questions de voyage, questions sur les circuits, questions de réservation',
            noindex: true,
        },
        de: {
            title: 'Häufig Gestellte Fragen',
            description: 'Finden Sie Antworten auf häufig gestellte Fragen zum Reisen nach Madagaskar mit Sirius Expedition. Erhalten Sie Informationen zu Touren, Buchungen und mehr.',
            keywords: 'Madagaskar FAQ, Reise Fragen, Tour Fragen, Buchungs Fragen',
            noindex: true,
        },
        it: {
            title: 'Domande Frequenti',
            description: 'Trova risposte alle domande comuni sui viaggi in Madagascar con Sirius Expedition. Ottieni informazioni su tour, prenotazioni e altro.',
            keywords: 'Madagascar FAQ, domande di viaggio, domande sui tour, domande di prenotazione',
            noindex: true,
        },
    },
};

// ============================================
// FONCTION HELPER POUR RÉCUPÉRER LE SEO
// ============================================
export function getSEOForPage(
    page: string,
    lang: 'en' | 'fr' | 'de' | 'it' = 'en'
): PageSEO {
    const pageSEO = seoConfig[page];
    if (!pageSEO) {
        // Valeurs par défaut si la page n'existe pas
        return {
            title: 'Sirius Expedition',
            description: 'Discover Madagascar with Sirius Expedition',
            keywords: 'Madagascar tours, Madagascar safari',
        };
    }
    return pageSEO[lang];
}