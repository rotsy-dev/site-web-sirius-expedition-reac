// src/hooks/useContentManager.ts
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
} from 'firebase/firestore';

// Données par défaut (utilisées pour le reset et comme fallback)
const defaultContent = {
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
    bestSellers: [
        {
            id: 1,
            title: 'Circuit Nord Authentique',
            slug: 'circuit-nord',
            image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800',
            duration: '10 jours',
            location: 'Nord de Madagascar',
            price: 'À partir de 2 800€',
            rating: 4.9,
            reviews: 124,
            description: 'Un voyage immersif à travers les paysages époustouflants du nord...',
            highlights: ['Tsingy de Bemaraha', 'Allée des Baobabs', 'Nosy Be', 'Guide expert'],
        },
    ],
    tourSpecialties: [
        {
            id: 1,
            icon: '🦎',
            title: 'Faune Endémique',
            description: 'Lémuriens, caméléons et oiseaux rares',
            image: 'https://images.unsplash.com/photo-1602498833062-4e0d2b0d0d8d?w=800',
            link: '/tours/faune',
        },
    ],
    reviews: [
        {
            id: 1,
            name: 'Sophie Martin',
            country: 'France',
            avatar: 'https://ui-avatars.com/api/?name=Sophie+Martin&background=6D4C41&color=fff',
            rating: 5,
            text: 'Voyage exceptionnel, organisation parfaite !',
            date: 'Décembre 2024',
            tour: 'Circuit Nord',
            verified: true,
            platform: 'Google',
        },
    ],
    blogPosts: [
        {
            id: 1,
            title: 'Les secrets des Tsingy de Bemaraha',
            slug: 'secrets-tsingy-bemaraha',
            excerpt: 'Découvrez ce site UNESCO unique au monde...',
            content: 'Article complet ici...',
            image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200',
            author: 'Jean Rakoto',
            authorAvatar: 'https://ui-avatars.com/api/?name=Jean+Rakoto',
            authorBio: 'Guide naturaliste passionné',
            date: '15 Décembre 2024',
            category: 'Nature',
            readTime: '7 min',
            tags: ['tsingy', 'unesco'],
            featured: true,
            views: 2450,
        },
    ],
    faqs: [
        {
            id: 1,
            question: 'Quelle est la meilleure période pour visiter Madagascar ?',
            answer: 'La saison sèche d\'avril à novembre est idéale pour le beau temps et l\'observation animale.',
            category: 'Travel Info',
        },
    ],

    videoGallery: [
        {
            id: 1,
            title: 'Aventure à Madagascar',
            youtubeId: 'dQw4w9WgXcQ',
        },
        {
            id: 2,
            title: 'Les merveilles naturelles',
            youtubeId: 'eY52Zsg-KVI',
        },
    ],

    siteConfig: {
        siteName: 'Sirius Expedition',
        tagline: 'Aventures authentiques à Madagascar',
        logo: '',
        contact: {
            email: 'contact@siriusexpedition.com',
            phone: '+261 34 00 000 00',
            address: 'Antananarivo, Madagascar',
            whatsapp: '+261 34 00 000 00',
        },
        social: {
            facebook: '',
            youtube: '',
            tripadvisor: '',
            google: '',
            instagram: '',
            mainYouTubeId: 'dQw4w9WgXcQ',
        },
        videos: {
            mainYouTubeId: 'dQw4w9WgXcQ',
            channelUrl: 'https://www.youtube.com/@siriusexpedition',
        },
        services: {
            hosting: ['Vercel', 'Netlify'],
            email: 'Gmail',
        },
    },
};

// Mot de passe admin (à changer en production !)
const ADMIN_PASSWORD = 'admin123';

export function useContentManager() {
    const [content, setContent] = useState(defaultContent);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Chargement du contenu depuis Firestore au démarrage
    useEffect(() => {
        const loadContent = async () => {
            try {
                const collections = [
                    'heroSlides',
                    'bestSellers',
                    'tourSpecialties',
                    'reviews',
                    'blogPosts',
                    'faqs',
                    'videoGallery',
                ];

                const newContent: any = {};

                for (const coll of collections) {
                    const snapshot = await getDocs(collection(db, coll));
                    const items = snapshot.docs.map((doc) => ({
                        id: parseInt(doc.id),
                        ...doc.data(),
                    }));
                    newContent[coll] = items.sort((a: any, b: any) => a.id - b.id);
                }

                // Chargement de la config avec fusion sécurisée
                const configSnap = await getDoc(doc(db, 'siteConfig', 'main'));
                const firebaseConfig = configSnap.exists() ? configSnap.data() : {};

                newContent.siteConfig = {
                    ...defaultContent.siteConfig,
                    ...firebaseConfig,
                    contact: {
                        ...defaultContent.siteConfig.contact,
                        ...(firebaseConfig.contact || {}),
                    },
                    social: {
                        ...defaultContent.siteConfig.social,
                        ...(firebaseConfig.social || {}),
                    },
                    videos: {
                        ...defaultContent.siteConfig.videos,
                        ...(firebaseConfig.videos || {}),
                    },
                    services: {
                        ...defaultContent.siteConfig.services,
                        ...(firebaseConfig.services || {}),
                    },
                };

                setContent(newContent);
            } catch (err) {
                console.error('Erreur chargement contenu Firebase :', err);
                setContent(defaultContent);
            }
        };

        loadContent();
    }, []);

    // Mise à jour d'une section
    const updateSection = async (section: string, data: any) => {
        setContent((prev) => ({ ...prev, [section]: data }));

        try {
            if (section === 'siteConfig') {
                await setDoc(doc(db, 'siteConfig', 'main'), data);
            } else {
                const oldSnapshot = await getDocs(collection(db, section));
                for (const oldDoc of oldSnapshot.docs) {
                    await deleteDoc(oldDoc.ref);
                }

                for (const item of data) {
                    await setDoc(doc(db, section, item.id.toString()), item);
                }
            }
        } catch (err) {
            console.error('Erreur mise à jour section Firebase :', err);
            alert('Erreur lors de la sauvegarde dans Firebase');
        }
    };

    // Export complet
    const exportContent = async () => {
        try {
            const exportData: any = {};

            const collections = [
                'heroSlides',
                'bestSellers',
                'tourSpecialties',
                'reviews',
                'blogPosts',
                'faqs',
                'videoGallery',
            ];

            for (const coll of collections) {
                const snapshot = await getDocs(collection(db, coll));
                exportData[coll] = snapshot.docs.map((d) => ({
                    id: parseInt(d.id),
                    ...d.data(),
                }));
            }

            const configSnap = await getDoc(doc(db, 'siteConfig', 'main'));
            exportData.siteConfig = configSnap.exists() ? configSnap.data() : defaultContent.siteConfig;

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sirius-expedition-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);

            alert('✅ Export terminé ! Fichier téléchargé.');
        } catch (err) {
            console.error('Erreur export :', err);
            alert('❌ Erreur lors de l\'export');
        }
    };

    // Import complet
    const importContent = async (file: File): Promise<void> => {
        try {
            const text = await file.text();
            const imported = JSON.parse(text);

            const collections = [
                'heroSlides',
                'bestSellers',
                'tourSpecialties',
                'reviews',
                'blogPosts',
                'faqs',
                'videoGallery',
            ];

            for (const coll of collections) {
                if (Array.isArray(imported[coll])) {
                    const oldSnap = await getDocs(collection(db, coll));
                    for (const old of oldSnap.docs) {
                        await deleteDoc(old.ref);
                    }

                    for (const item of imported[coll]) {
                        await setDoc(doc(db, coll, item.id.toString()), item);
                    }
                }
            }

            if (imported.siteConfig) {
                await setDoc(doc(db, 'siteConfig', 'main'), imported.siteConfig);
            }

            alert('✅ Import terminé ! La page va se recharger.');
            window.location.reload();
        } catch (err) {
            console.error('Erreur import :', err);
            alert('❌ Fichier invalide ou erreur lors de l\'import');
        }
    };

    // Reset complet
    const resetToDefaults = async () => {
        if (!confirm('⚠️ TOUT le contenu sera supprimé et remplacé par les valeurs par défaut. Continuer ?')) {
            return;
        }

        try {
            const collections = [
                'heroSlides',
                'bestSellers',
                'tourSpecialties',
                'reviews',
                'blogPosts',
                'faqs',
                'videoGallery',
            ];

            for (const coll of collections) {
                const snap = await getDocs(collection(db, coll));
                for (const d of snap.docs) {
                    await deleteDoc(d.ref);
                }
            }

            for (const [key, value] of Object.entries(defaultContent)) {
                if (key === 'siteConfig') {
                    await setDoc(doc(db, 'siteConfig', 'main'), value);
                } else if (Array.isArray(value)) {
                    for (const item of value as any[]) {
                        await setDoc(doc(db, key, item.id.toString()), item);
                    }
                }
            }

            alert('🔄 Contenu réinitialisé ! Page en rechargement...');
            window.location.reload();
        } catch (err) {
            console.error('Erreur reset :', err);
            alert('❌ Erreur lors du reset');
        }
    };

    // Authentification simple
    const login = (password: string) => {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return {
        content,
        updateSection,
        exportContent,
        importContent,
        resetToDefaults,
        isAuthenticated,
        login,
        logout,
    };
}