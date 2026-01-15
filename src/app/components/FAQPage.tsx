import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { HelpCircle, ChevronDown, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

interface FAQPageProps {
    onNavigateToContact?: () => void;
    content?: {
        pageHeaders?: {
            faqs?: {
                badge?: string;
                title?: string;
                subtitle?: string;
            };
        };
    };
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&h=600&fit=crop";

export function FAQPage({ onNavigateToContact, content = {} }: FAQPageProps) {
    const { t } = useTranslation();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [heroImageLoaded, setHeroImageLoaded] = useState(false);
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const { translatedContent: translatedFaqs } = useTranslatedContent(
        faqs,
        ['question', 'answer']
    );
    
    const { translatedContent: translatedFaqsHeader } = useTranslatedContent(
        content.pageHeaders?.faqs ?? null,
        ['badge', 'title', 'subtitle']
    );

    const header = (translatedFaqsHeader as { badge?: string; title?: string; subtitle?: string } | null)
        || content.pageHeaders?.faqs
        || {};

    const translatedFaqList = (translatedFaqs as FAQ[] | null) || faqs;

    useEffect(() => {
        if (HERO_IMAGE) {
            const img = new Image();
            img.onload = () => setHeroImageLoaded(true);
            img.onerror = () => setHeroImageLoaded(true);
            img.src = HERO_IMAGE;
        } else {
            setHeroImageLoaded(true);
        }
    }, []);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const faqsCollection = collection(db, 'faqs');
                const snapshot = await getDocs(faqsCollection);
                const fetchedFaqs: FAQ[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<FAQ, 'id'>
                }));

                fetchedFaqs.sort((a, b) => a.id - b.id);
                setFaqs(fetchedFaqs);
            } catch (err) {
                console.error('Error loading FAQs:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const categories = useMemo(() => 
        ['all', ...Array.from(new Set(translatedFaqList.map(faq => faq.category)))],
        [translatedFaqList]
    );

    const filteredFaqs = useMemo(() => 
        translatedFaqList.filter(faq => {
            const matchesSearch = searchQuery === '' ||
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

            return matchesSearch && matchesCategory;
        }),
        [translatedFaqList, searchQuery, selectedCategory]
    );

    const groupedFaqs = useMemo(() => 
        filteredFaqs.reduce((acc, faq) => {
            if (!acc[faq.category]) acc[faq.category] = [];
            acc[faq.category].push(faq);
            return acc;
        }, {} as Record<string, FAQ[]>),
        [filteredFaqs]
    );

    const handleClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleToggleFaq = useCallback((id: number) => {
        setOpenFaqId(prev => prev === id ? null : id);
    }, []);

    return (
        <div className="bg-gradient-to-b from-[#F0E7D5] to-[#F0E7D5] min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    {HERO_IMAGE && (
                        <>
                            <img
                                src={HERO_IMAGE}
                                alt="FAQ Hero"
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                                    heroImageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                loading="eager"
                                // fetchPriority="high"
                            />
                            {!heroImageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#4B3935] to-[#3d2f2b]" />
                            )}
                        </>
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                </div>

               <div className="absolute bottom-0 left-0 w-full leading-[0] z-20">
                <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path
                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.83C0,95.83,161,122.35,321.39,56.44Z"
                    className="fill-[#F0E7D5] dark:fill-[#1a1410]"
                    ></path>
                </svg>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-1.5 bg-[#D4A574] text-white rounded-full text-xs md:text-sm font-semibold mb-4">
                        {header.badge || t('sections.faq')}
                    </span>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                        {header.title || t('faq.title')}
                    </h1>

                    <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
                        {header.subtitle || t('faq.subtitle')}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-[#D4A574] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-lg text-gray-600">{t('common.loading')}</p>
                    </div>
                ) : (
                    <>
                        {/* Search Bar */}
                        <div className="mb-10">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('faq.searchPlaceholder') || 'Rechercher une question...'}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent shadow-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={18} className="text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-10">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            selectedCategory === category
                                                ? 'bg-[#D4A574] text-white shadow-md'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                    >
                                        {category === 'all' ? t('faq.allCategories') || 'Toutes' : category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {[
                                { label: t('faq.totalQuestions') || 'Total', value: faqs.length },
                                { label: t('faq.categories') || 'Catégories', value: categories.length - 1 },
                                { label: t('faq.resultsFound') || 'Résultats', value: filteredFaqs.length },
                                { label: t('faq.openAnswers') || 'Ouverte', value: openFaqId ? 1 : 0 },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100"
                                >
                                    <p className="text-3xl font-bold text-[#443C34] mb-1">{stat.value}</p>
                                    <p className="text-xs text-gray-600 uppercase tracking-wide">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* FAQs List */}
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <HelpCircle size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {t('faq.noResults') || 'Aucune question trouvée'}
                                </h3>
                                <p className="text-gray-600">
                                    {t('faq.tryDifferentSearch') || 'Essayez une autre recherche'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                                    <div key={category}>
                                        {/* Category Header */}
                                        <div className="mb-6 pb-3 border-b-2 border-gray-200">
                                            <h2 className="text-2xl font-bold text-[#443C34]">{category}</h2>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {categoryFaqs.length} {categoryFaqs.length === 1 ? 'question' : 'questions'}
                                            </p>
                                        </div>

                                        {/* FAQ Items */}
                                        <div className="space-y-3">
                                            {categoryFaqs.map((faq) => {
                                                const isOpen = openFaqId === faq.id;
                                                return (
                                                    <div
                                                        key={faq.id}
                                                        className={`bg-white rounded-xl border transition-all ${
                                                            isOpen 
                                                                ? 'border-[#D4A574] shadow-md' 
                                                                : 'border-gray-200 shadow-sm hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <button
                                                            onClick={() => handleToggleFaq(faq.id)}
                                                            className="w-full px-5 py-4 flex items-start justify-between gap-4 text-left"
                                                        >
                                                            <h3 className="text-base md:text-lg font-semibold text-gray-800 flex-1">
                                                                {faq.question}
                                                            </h3>
                                                            <ChevronDown 
                                                                size={20} 
                                                                className={`text-gray-500 flex-shrink-0 mt-1 transition-transform ${
                                                                    isOpen ? 'rotate-180' : ''
                                                                }`}
                                                            />
                                                        </button>

                                                        {isOpen && (
                                                            <div className="px-5 pb-5">
                                                                <div className="pt-3 border-t border-gray-100">
                                                                    <p className="text-gray-700 leading-relaxed">
                                                                        {faq.answer}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA Section */}
                        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-gray-100">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#443C34] mb-3">
                                {t('faq.stillHaveQuestions') || 'Vous avez encore des questions ?'}
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                                {t('faq.contactUsMessage') || "Notre équipe est là pour vous aider."}
                            </p>
                            {onNavigateToContact && (
                                <button 
                                    onClick={onNavigateToContact}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4A574] text-white rounded-lg font-semibold hover:bg-[#C39563] transition-colors shadow-md"
                                >
                                    {t('contact.title') || 'Nous contacter'}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}