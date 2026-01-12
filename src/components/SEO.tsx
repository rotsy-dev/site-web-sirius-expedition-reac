// components/SEO.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_CONFIG = {
    siteName: 'Sirius Expedition',
    siteUrl: 'https://www.siriusexpedition.com',
    defaultImage: '/og-image.png', // Image par défaut pour Open Graph
    twitterHandle: '@SiriusExpedition',
    defaultDescription: 'Discover Madagascar with Sirius Expedition - Your premier tour operator for unforgettable adventures in Madagascar. Explore wildlife, pristine beaches, and unique landscapes.',
};

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    noindex?: boolean;
    schema?: object;
    lang?: string;
}

export default function SEO({
    title,
    description = SITE_CONFIG.defaultDescription,
    keywords = 'Madagascar tours, Madagascar safari, Madagascar travel, Madagascar expeditions, Madagascar wildlife, Madagascar beaches, Madagascar adventure, tour operator Madagascar',
    image,
    type = 'website',
    author = 'Sirius Expedition',
    publishedTime,
    modifiedTime,
    noindex = false,
    schema,
    lang = 'en',
}: SEOProps) {
    const location = useLocation();

    // Construire l'URL canonique
    const canonicalUrl = `${SITE_CONFIG.siteUrl}${location.pathname}`;

    // Construction du titre complet
    const fullTitle = title
        ? `${title} | ${SITE_CONFIG.siteName}`
        : `${SITE_CONFIG.siteName} | Premier Tour Operator & Travel Agency in Madagascar`;

    // Image par défaut si non fournie
    const ogImage = image
        ? (image.startsWith('http') ? image : `${SITE_CONFIG.siteUrl}${image}`)
        : `${SITE_CONFIG.siteUrl}${SITE_CONFIG.defaultImage}`;

    useEffect(() => {
        // Mise à jour du titre
        document.title = fullTitle;

        // Fonction helper pour créer/mettre à jour une balise meta
        const setMetaTag = (name: string, content: string, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attribute}="${name}"]`);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Fonction helper pour créer/mettre à jour un lien
        const setLink = (rel: string, href: string) => {
            let element = document.querySelector(`link[rel="${rel}"]`);

            if (!element) {
                element = document.createElement('link');
                element.setAttribute('rel', rel);
                document.head.appendChild(element);
            }

            element.setAttribute('href', href);
        };

        // Meta tags de base
        setMetaTag('description', description);
        setMetaTag('keywords', keywords);
        setMetaTag('author', author);

        // Langue
        document.documentElement.lang = lang;

        // Canonical
        setLink('canonical', canonicalUrl);

        // Robots
        if (noindex) {
            setMetaTag('robots', 'noindex, nofollow');
        } else {
            setMetaTag('robots', 'index, follow, max-image-preview:large');
        }

        // Open Graph
        setMetaTag('og:type', type, true);
        setMetaTag('og:title', fullTitle, true);
        setMetaTag('og:description', description, true);
        setMetaTag('og:url', canonicalUrl, true);
        setMetaTag('og:image', ogImage, true);
        setMetaTag('og:image:width', '1200', true);
        setMetaTag('og:image:height', '630', true);
        setMetaTag('og:site_name', SITE_CONFIG.siteName, true);
        setMetaTag('og:locale', lang === 'fr' ? 'fr_FR' : lang === 'de' ? 'de_DE' : lang === 'it' ? 'it_IT' : 'en_US', true);

        // Article specific OG tags
        if (type === 'article') {
            if (publishedTime) {
                setMetaTag('article:published_time', publishedTime, true);
            }
            if (modifiedTime) {
                setMetaTag('article:modified_time', modifiedTime, true);
            }
            if (author) {
                setMetaTag('article:author', author, true);
            }
        }

        // Twitter Card
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:site', SITE_CONFIG.twitterHandle);
        setMetaTag('twitter:title', fullTitle);
        setMetaTag('twitter:description', description);
        setMetaTag('twitter:image', ogImage);
        setMetaTag('twitter:creator', SITE_CONFIG.twitterHandle);

        // Structured Data (Schema.org)
        if (schema) {
            let scriptElement = document.querySelector('script[type="application/ld+json"]');

            if (!scriptElement) {
                scriptElement = document.createElement('script');
                scriptElement.setAttribute('type', 'application/ld+json');
                document.head.appendChild(scriptElement);
            }

            scriptElement.textContent = JSON.stringify(schema);
        }
    }, [fullTitle, description, keywords, author, canonicalUrl, ogImage, type, publishedTime, modifiedTime, noindex, schema, lang]);

    return null; // Ce composant ne rend rien visuellement
}

// ============================================
// HELPER: Generate Breadcrumb Schema
// ============================================
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `${SITE_CONFIG.siteUrl}${item.url}`
        }))
    };
}

// ============================================
// HELPER: Generate Article Schema
// ============================================
export function generateArticleSchema({
    title,
    description,
    image,
    datePublished,
    dateModified,
    author = 'Sirius Expedition'
}: {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": image,
        "datePublished": datePublished,
        "dateModified": dateModified || datePublished,
        "author": {
            "@type": "Organization",
            "name": author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Sirius Expedition",
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_CONFIG.siteUrl}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": SITE_CONFIG.siteUrl
        }
    };
}

// ============================================
// HELPER: Generate Product/Tour Schema
// ============================================
export function generateTourSchema({
    name,
    description,
    image,
    price,
    priceCurrency = 'USD',
    duration,
    url,
    rating = 4.9,
    reviewCount = 127
}: {
    name: string;
    description: string;
    image: string;
    price: number;
    priceCurrency?: string;
    duration?: string;
    url: string;
    rating?: number;
    reviewCount?: number;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description,
        "image": image,
        "brand": {
            "@type": "Brand",
            "name": "Sirius Expedition"
        },
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": priceCurrency,
            "price": price,
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString(),
            "seller": {
                "@type": "Organization",
                "name": "Sirius Expedition"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": reviewCount,
            "bestRating": "5",
            "worstRating": "1"
        },
        "provider": {
            "@type": "TravelAgency",
            "name": "Sirius Expedition"
        },
        "duration": duration
    };
}

// ============================================
// HELPER: Generate FAQ Schema
// ============================================
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

// ============================================
// HELPER: Generate Organization Schema
// ============================================
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Sirius Expedition",
        "url": SITE_CONFIG.siteUrl,
        "logo": `${SITE_CONFIG.siteUrl}/logo.png`,
        "description": "Premier tour operator and travel agency in Madagascar, offering unforgettable expeditions and safari experiences.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Madagascar"
        },
        "sameAs": [
            "https://www.facebook.com/SiriusExpedition",
            "https://www.instagram.com/siriusexpedition",
            "https://twitter.com/SiriusExpedition"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "availableLanguage": ["English", "French", "German", "Italian"]
        }
    };
}