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

// ✅ STRUCTURE 100% COMPATIBLE AVEC VOS COMPOSANTS
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
        contact: {
            badge: 'Get In Touch',
            title: 'Contact Us',
            subtitle: 'Get in touch with us to plan your Madagascar adventure'
        }
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
    siteConfig: {
        siteName: 'Sirius Expedition',
        tagline: 'Aventures authentiques à Madagascar',
        logo: '', // Pour le Header
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
            google: 'https://g.page/siriusexpedition'
        },
        videos: { 
            aboutUsVideoId: '', // ✅ Ajouté (pour AboutUs)
            mainYouTubeId: '', // Pour VideoGallery
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

    // ✅ CHARGEMENT PARALLÈLE OPTIMISÉ (Auth + Data en même temps)
    useEffect(() => {
        let authResolved = false;
        let dataResolved = false;

        const checkLoadingComplete = () => {
            if (authResolved && dataResolved) {
                setLoading(false);
            }
        };

        // 1. Surveillance auth (non-bloquante)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            authResolved = true;
            checkLoadingComplete();
        });

        // 2. Chargement data (parallèle)
        const loadContent = async () => {
            try {
                const collections = [
                    'heroSlides', 'bestSellers', 'tourSpecialties', 
                    'reviews', 'blogPosts', 'faqs', 'videoGallery'
                ];

                const fetchedContent: any = { ...defaultContent };

                // ✅ Tout en parallèle (1 seul round-trip réseau)
                const [configSnap, pageHeadersSnap, ...collectionSnapshots] = await Promise.all([
                    getDoc(doc(db, 'siteConfig', 'main')),
                    getDoc(doc(db, 'pageHeaders', 'main')),
                    ...collections.map(coll => 
                        getDocs(query(collection(db, coll), orderBy("id", "asc")))
                    )
                ]);

                // Traitement des collections
                collections.forEach((coll, index) => {
                    fetchedContent[coll] = collectionSnapshots[index].docs.map(d => d.data());
                });

                // ✅ Charger pageHeaders
                if (pageHeadersSnap.exists()) {
                    fetchedContent.pageHeaders = {
                        ...defaultContent.pageHeaders,
                        ...pageHeadersSnap.data()
                    };
                }

                // ✅ Merge intelligent du siteConfig (ORDRE IMPORTANT)
                if (configSnap.exists()) {
                    const firebaseData = configSnap.data();
                    fetchedContent.siteConfig = {
                        // 1. D'abord les propriétés simples
                        siteName: firebaseData.siteName || defaultContent.siteConfig.siteName,
                        tagline: firebaseData.tagline || defaultContent.siteConfig.tagline,
                        logo: firebaseData.logo || defaultContent.siteConfig.logo,
                        
                        // 2. Merge profond avec defaults TOUJOURS présents
                        contact: {
                            ...defaultContent.siteConfig.contact,
                            ...(firebaseData.contact || {})
                        },
                        social: {
                            ...defaultContent.siteConfig.social,
                            ...(firebaseData.social || {})
                        },
                        videos: {
                            ...defaultContent.siteConfig.videos,
                            ...(firebaseData.videos || {})
                        },
                        services: {
                            ...defaultContent.siteConfig.services,
                            ...(firebaseData.services || {})
                        }
                    };
                }

                setContent(fetchedContent);
            } catch (err) {
                console.error('❌ Erreur chargement Firebase:', err);
                // On garde les valeurs par défaut en cas d'erreur
            } finally {
                dataResolved = true;
                checkLoadingComplete();
            }
        };

        loadContent();

        return () => unsubscribe();
    }, []);

    // 3. Mise à jour ULTRA-RAPIDE avec WriteBatch (Optimistic UI)
    const updateSection = async (section: string, data: any) => {
        const previousContent = { ...content };
        setContent(prev => ({ ...prev, [section]: data }));

        try {
            const batch = writeBatch(db);

            // ✅ Cas spéciaux pour les objets (siteConfig, pageHeaders)
            if (section === 'siteConfig' || section === 'pageHeaders') {
                batch.set(doc(db, section, 'main'), data);
            } 
            // ✅ Cas pour les collections (arrays)
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
            setContent(previousContent); // Rollback en cas d'erreur
            alert('❌ Erreur de sauvegarde. Vérifiez votre connexion.');
        }
    };

    // 4. Reset Complet
    const resetToDefaults = async () => {
        if (!confirm('⚠️ Réinitialiser TOUT le contenu ? Cette action est irréversible.')) return;
        
        try {
            const batch = writeBatch(db);
            const collections = ['heroSlides', 'bestSellers', 'tourSpecialties', 'reviews', 'blogPosts', 'faqs', 'videoGallery'];

            for (const coll of collections) {
                const snap = await getDocs(collection(db, coll));
                snap.docs.forEach(d => batch.delete(d.ref));
                
                const defaults = (defaultContent as any)[coll];
                defaults.forEach((item: any) => {
                    batch.set(doc(db, coll, item.id.toString()), item);
                });
            }
            batch.set(doc(db, 'siteConfig', 'main'), defaultContent.siteConfig);
            batch.set(doc(db, 'pageHeaders', 'main'), defaultContent.pageHeaders);
            
            await batch.commit();
            alert('✅ Contenu réinitialisé !');
            window.location.reload();
        } catch (err) {
            console.error('❌ Erreur reset:', err);
            alert('❌ Erreur lors du reset');
        }
    };

    // 5. Export JSON
    const exportContent = () => {
        const dataStr = JSON.stringify(content, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup-sirius-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // 6. Import JSON
    const importContent = async (file: File) => {
        try {
            const text = await file.text();
            const imported = JSON.parse(text);
            
            // Validation basique
            if (!imported.siteConfig || !Array.isArray(imported.heroSlides)) {
                throw new Error('Format de fichier invalide');
            }

            const batch = writeBatch(db);

            for (const [key, value] of Object.entries(imported)) {
                if (key === 'siteConfig' || key === 'pageHeaders') {
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
            alert('✅ Import réussi ! La page va se recharger.');
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            console.error('❌ Erreur import:', err);
            alert('❌ Fichier invalide ou corrompu');
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