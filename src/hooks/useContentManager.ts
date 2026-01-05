// src/hooks/useContentManager.ts
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    writeBatch,
    query,
    orderBy
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// ✅ STRUCTURE MISE À JOUR AVEC "OUR STORY"
const defaultContent = {
    pageHeaders: {
        hero: {
            badge: 'Featured Destinations',
            title: 'Your Next Adventure Awaits',
            subtitle: '3€ offerts immédiatement et 5 points ajoutés à votre carte de fidélité.'
        },
        bestSellers: {
            badge: 'Best Sellers',
            title: 'Most Popular Adventures',
            subtitle: 'Handpicked experiences loved by thousands of travelers'
        },
        specialties: {
            badge: 'Our Expertise',
            title: 'Curated Experiences',
            subtitle: 'Bespoke adventures for the discerning explorer'
        },
        reviews: {
            badge: 'Testimonials',
            title: 'Loved By Travelers',
            subtitle: 'Real stories from adventurers who explored Madagascar with us'
        },
        videos: {
            badge: 'Video Gallery',
            title: 'See Madagascar Come Alive',
            subtitle: 'Immerse yourself in breathtaking adventures captured on film'
        },
        blog: {
            badge: 'Latest Story',
            title: 'Our Blog',
            subtitle: 'Expert insights, travel tips and stories from Madagascar'
        },
        about: {
            badge: 'About',
            title: 'About Sirius Expedition',
            subtitle: 'Your trusted partner for unforgettable Madagascar adventures'
        },
        quote: {
            badge: 'Ask a quote',
            title: 'Get your personalized quote',
            subtitle: 'Share your travel dates and preferences, we take care of the rest.'
        },
        contact: {
            badge: 'Get In Touch',
            title: 'Contact Us',
            subtitle: 'Get in touch with us to plan your Madagascar adventure'
        }
    },
    ourStory: {
        title: 'Our Story',
        paragraphs: [
            "Sirius Expedition est née d'une passion profonde pour les paysages uniques et la culture riche de Madagascar.",
            "Notre mission est de vous offrir des aventures authentiques et mémorables, en respectant la nature et les communautés locales."
        ]
    },
    heroSlides: [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
            title: 'Bienvenue à Madagascar',
            subtitle: 'L\'île rouge, un monde à part',
            cta: 'Découvrir',
            videoUrl: '',
        },
    ],
    bestSellers: [],
    tourSpecialties: [],
    reviews: [],
    blogPosts: [],
    faqs: [],
    videoGallery: [],
    imageGallery: [],
    siteConfig: {
        siteName: 'Sirius Expedition',
        tagline: 'Aventures authentiques à Madagascar',
        logo: '',
        contact: {
            email: 'contact@siriusexpedition.com',
            phone: '+261 34 00 000 00',
            address: 'Antananarivo, Madagascar',
            whatsapp: '+261340000000'
        },
        social: {
            facebook: 'https://facebook.com/siriusexpedition',
            youtube: 'https://youtube.com/@siriusexpedition',
            instagram: 'https://instagram.com/siriusexpedition',
            tripadvisor: 'https://tripadvisor.com/siriusexpedition',
            google: 'https://g.page/siriusexpedition',
            tiktok: 'https://tiktok.com/@siriusexpedition'
        },
        videos: {
            aboutUsVideoId: '',
            mainYouTubeId: '',
            channelUrl: 'https://youtube.com/@siriusexpedition'
        },
        services: {
            hosting: ['Hébergement 5*', 'Bungalows', 'Camping'],
            domain: 'siriusexpedition.com',
            email: 'reservation@siriusexpedition.com'
        },
    },
};

export function useContentManager() {
    const [content, setContent] = useState(defaultContent);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let authResolved = false;
        let dataResolved = false;

        const checkLoadingComplete = () => {
            if (authResolved && dataResolved) {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            authResolved = true;
            checkLoadingComplete();
        });

        const loadContent = async () => {
            try {
                const collections = [
                    'heroSlides', 'bestSellers', 'tourSpecialties',
                    'reviews', 'blogPosts', 'faqs', 'videoGallery', 'imageGallery'
                ];

                const fetchedContent: any = { ...defaultContent };

                // ✅ CHARGEMENT PARALLÈLE (Inclus ourStory)
                const [configSnap, pageHeadersSnap, storySnap, ...collectionSnapshots] = await Promise.all([
                    getDoc(doc(db, 'siteConfig', 'main')),
                    getDoc(doc(db, 'pageHeaders', 'main')),
                    getDoc(doc(db, 'ourStory', 'main')), // <--- Récupération Histoire
                    ...collections.map(coll =>
                        getDocs(query(collection(db, coll), orderBy("id", "asc")))
                    )
                ]);

                // Traitement des collections
                collections.forEach((coll, index) => {
                    const docs = collectionSnapshots[index].docs.map(d => d.data());
                    fetchedContent[coll] = docs;
                    // Debug pour imageGallery
                    if (coll === 'imageGallery') {
                        console.log('useContentManager - imageGallery chargé:', docs);
                        console.log('useContentManager - nombre d\'images:', docs.length);
                    }
                });

                // ✅ Page Headers
                if (pageHeadersSnap.exists()) {
                    fetchedContent.pageHeaders = { ...defaultContent.pageHeaders, ...pageHeadersSnap.data() };
                }

                // ✅ Our Story
                if (storySnap.exists()) {
                    fetchedContent.ourStory = { ...defaultContent.ourStory, ...storySnap.data() };
                }

                // ✅ Site Config Merge
                if (configSnap.exists()) {
                    const firebaseData = configSnap.data();
                    fetchedContent.siteConfig = {
                        siteName: firebaseData.siteName || defaultContent.siteConfig.siteName,
                        tagline: firebaseData.tagline || defaultContent.siteConfig.tagline,
                        logo: firebaseData.logo || defaultContent.siteConfig.logo,
                        contact: { ...defaultContent.siteConfig.contact, ...(firebaseData.contact || {}) },
                        social: { ...defaultContent.siteConfig.social, ...(firebaseData.social || {}) },
                        videos: { ...defaultContent.siteConfig.videos, ...(firebaseData.videos || {}) },
                        services: { ...defaultContent.siteConfig.services, ...(firebaseData.services || {}) }
                    };
                }

                setContent(fetchedContent);
            } catch (err) {
                console.error('❌ Erreur chargement Firebase:', err);
            } finally {
                dataResolved = true;
                checkLoadingComplete();
            }
        };

        loadContent();
        return () => unsubscribe();
    }, []);

    const updateSection = async (section: string, data: any) => {
        const previousContent = { ...content };
        setContent(prev => ({ ...prev, [section]: data }));

        try {
            const batch = writeBatch(db);

            // ✅ GESTION DES OBJETS UNIQUES (Inclus ourStory)
            if (['siteConfig', 'pageHeaders', 'ourStory'].includes(section)) {
                batch.set(doc(db, section, 'main'), data);
            }
            // ✅ GESTION DES COLLECTIONS
            else if (Array.isArray(data)) {
                const snapshot = await getDocs(collection(db, section));
                snapshot.docs.forEach(d => batch.delete(d.ref));

                data.forEach((item: any) => {
                    const ref = doc(db, section, item.id.toString());
                    batch.set(ref, item);
                });
            }

            await batch.commit();
        } catch (err) {
            console.error('❌ Echec synchro Firebase:', err);
            setContent(previousContent);
            alert('❌ Erreur de sauvegarde.');
        }
    };

    const resetToDefaults = async () => {
        if (!confirm('⚠️ Réinitialiser TOUT le contenu ?')) return;

        try {
            const batch = writeBatch(db);
            const collections = ['heroSlides', 'bestSellers', 'tourSpecialties', 'reviews', 'blogPosts', 'faqs', 'videoGallery', 'imageGallery'];

            for (const coll of collections) {
                const snap = await getDocs(collection(db, coll));
                snap.docs.forEach(d => batch.delete(d.ref));
                const defaults = (defaultContent as any)[coll];
                defaults.forEach((item: any) => {
                    batch.set(doc(db, coll, item.id.toString()), item);
                });
            }

            // Reset des documents uniques
            batch.set(doc(db, 'siteConfig', 'main'), defaultContent.siteConfig);
            batch.set(doc(db, 'pageHeaders', 'main'), defaultContent.pageHeaders);
            batch.set(doc(db, 'ourStory', 'main'), defaultContent.ourStory); // <--- Reset Histoire

            await batch.commit();
            alert('✅ Contenu réinitialisé !');
            window.location.reload();
        } catch (err) {
            console.error('❌ Erreur reset:', err);
        }
    };

    const exportContent = () => {
        const dataStr = JSON.stringify(content, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup-sirius-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const importContent = async (file: File) => {
        try {
            const text = await file.text();
            const imported = JSON.parse(text);
            const batch = writeBatch(db);

            for (const [key, value] of Object.entries(imported)) {
                if (['siteConfig', 'pageHeaders', 'ourStory'].includes(key)) {
                    batch.set(doc(db, key, 'main'), value);
                } else if (Array.isArray(value)) {
                    const snap = await getDocs(collection(db, key));
                    snap.docs.forEach(d => batch.delete(d.ref));
                    value.forEach((item: any) => {
                        batch.set(doc(db, key, item.id.toString()), item);
                    });
                }
            }
            await batch.commit();
            alert('✅ Import réussi !');
            window.location.reload();
        } catch (err) {
            alert('❌ Fichier invalide');
        }
    };

    const logout = () => signOut(auth);

    return {
        content,
        updateSection,
        exportContent,
        importContent,
        resetToDefaults,
        isAuthenticated,
        loading,
        logout,
    };
}