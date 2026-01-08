import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Clock, Scale, ShieldCheck, Globe } from 'lucide-react';

// MODIF : Ajouter l'interface pour les props
interface TermsPageProps {
  currentLang: string;
}

export default function TermsPage({ currentLang }: TermsPageProps) {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // MODIF : Utiliser la prop directement
    // const currentLang = lang || 'en';

    // Traductions pour les textes fixes
    const translations = {
        loading: {
            en: 'Loading...',
            fr: 'Chargement...',
            de: 'Laden...',
            it: 'Caricamento...'
        },
        notFound: {
            en: 'Content not found.',
            fr: 'Contenu non trouvé.',
            de: 'Inhalt nicht gefunden.',
            it: 'Contenuto non trovato.'
        },
        updated: {
            en: 'Updated',
            fr: 'Mis à jour',
            de: 'Aktualisiert',
            it: 'Aggiornato'
        },
        jurisdiction: {
            en: 'Jurisdiction',
            fr: 'Juridiction',
            de: 'Gerichtsbarkeit',
            it: 'Giurisdizione'
        },
        version: {
            en: 'Version',
            fr: 'Version',
            de: 'Version',
            it: 'Versione'
        },
        notAvailable: {
            en: 'Terms and conditions are not yet available in this language.',
            fr: 'Les conditions générales ne sont pas encore disponibles dans cette langue.',
            de: 'Die Allgemeinen Geschäftsbedingungen sind in dieser Sprache noch nicht verfügbar.',
            it: 'I Termini e Condizioni non sono ancora disponibili in questa lingua.'
        }
    };

    // Fonction pour changer de langue
    const handleLanguageChange = (newLang: string) => {
        navigate(`/${newLang}/terms-and-conditions`);
    };

    useEffect(() => {
        if (!currentLang) return;
        
        console.log(`Chargement des données pour la langue: ${currentLang}`);

        const fetchData = async () => {
            try {
                let snap = await getDoc(doc(db, 'privacy_policy', currentLang));
                
                if (snap.exists()) {
                    console.log(`Données trouvées pour ${currentLang}:`, snap.data());
                    setData(snap.data());
                } else {
                    console.log(`Document non trouvé pour ${currentLang}, fallback vers anglais`);
                    const englishSnap = await getDoc(doc(db, 'privacy_policy', 'en'));
                    if (englishSnap.exists()) {
                        setData(englishSnap.data());
                    } else {
                        setData({
                            title: translations.notFound[currentLang as keyof typeof translations.notFound] || 'Content not found',
                            heroSubtitle: '',
                            lastUpdated: new Date().toISOString().split('T')[0],
                            version: '1.0',
                            contactEmail: '',
                            jurisdiction: 'Madagascar',
                            sections: []
                        });
                    }
                }
            } catch (error) {
                console.error('Erreur de chargement:', error);
                setData({
                    title: currentLang === 'fr' ? 'Conditions Générales' : 'Terms & Conditions',
                    heroSubtitle: currentLang === 'fr' ? 'Veuillez patienter...' : 'Please check back later.',
                    lastUpdated: new Date().toISOString().split('T')[0],
                    version: '1.0',
                    contactEmail: '',
                    jurisdiction: 'Madagascar',
                    sections: []
                });
            }
            setLoading(false);
            window.scrollTo(0, 0);
        };
        
        fetchData();
    }, [currentLang]); // MODIF : Seulement currentLang comme dépendance

    console.log('Current lang:', currentLang);
    console.log('Data loaded:', data);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-lg text-[#443C34]">
                    {translations.loading[currentLang as keyof typeof translations.loading] || 'Loading...'}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-lg text-[#443C34]">
                    {translations.notFound[currentLang as keyof typeof translations.notFound] || 'Content not found.'}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-16">
            <header className="bg-[#FAF7F2] py-24 px-6 border-b border-gray-100 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#443C34] mb-6 tracking-tight">
                        {data.title}
                    </h1>
                    <p className="text-[#443C34]/60 text-lg mb-10 leading-relaxed">
                        {data.heroSubtitle}
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-[#443C34]/40 text-xs font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Clock size={14}/> 
                            {translations.updated[currentLang as keyof typeof translations.updated]}: {data.lastUpdated}
                        </div>
                        <div className="flex items-center gap-2">
                            <Scale size={14}/> 
                            {translations.jurisdiction[currentLang as keyof typeof translations.jurisdiction]}: {data.jurisdiction}
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14}/> 
                            {translations.version[currentLang as keyof typeof translations.version]}: {data.version}
                        </div>
                        {data.contactEmail && (
                            <div className="flex items-center gap-2">
                                <Globe size={14}/> 
                                Email: {data.contactEmail}
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Globe size={16} />
                        {currentLang.toUpperCase()} - {translations.jurisdiction[currentLang as keyof typeof translations.jurisdiction]}: {data.jurisdiction}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20">
                {data.sections && data.sections.length > 0 ? (
                    <div className="space-y-16">
                        {data.sections.map((section: any) => (
                            <div key={section.id} className="group">
                                {section.subtitle && (
                                    <h2 className="text-3xl font-extrabold text-[#443C34] mb-6 flex items-center gap-4">
                                        <span className="h-px w-12 bg-[#443C34]/20 inline-block"></span>
                                        {section.subtitle}
                                    </h2>
                                )}
                                <div className="md:pl-16">
                                    <div 
                                        className="prose prose-stone max-w-none 
                                        prose-p:text-[#443C34]/80 prose-p:leading-relaxed prose-p:text-lg
                                        prose-li:text-[#443C34]/80 prose-li:my-2
                                        prose-strong:text-[#443C34] prose-strong:font-bold"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-[#443C34]/60 text-lg">
                            {translations.notFound[currentLang as keyof typeof translations.notFound]}
                        </p>
                        <p className="text-[#443C34]/40 mt-4">
                            {translations.notAvailable[currentLang as keyof typeof translations.notAvailable]}
                        </p>

                    </div>
                )}
            </main>
        </div>
    );
}