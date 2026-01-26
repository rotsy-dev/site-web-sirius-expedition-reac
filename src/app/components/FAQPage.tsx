import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, ArrowRight, Loader2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';

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
            const timeout = setTimeout(() => setHeroImageLoaded(true), 100);
            return () => clearTimeout(timeout);
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

    return (
        <div className="w-full min-h-screen bg-[#0a0806] overflow-hidden">
            {/* Hero */}
            <section className="relative h-screen flex items-end overflow-hidden bg-[#0a0806]">
                <div className="absolute inset-0">
                    {HERO_IMAGE ? (
                        <img
                            src={HERO_IMAGE}
                            alt="FAQ"
                            className={`w-full h-full object-cover transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{ filter: 'brightness(0.5) contrast(1.1)' }}
                            loading="eager"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#0a0806]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/50 to-transparent" />
                </div>

                <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 pb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="mb-6">
                            <span className="text-xs font-light text-[#F0E7D5]/60 uppercase tracking-[0.3em]">
                                {header.badge || t('sections.faq')}
                            </span>
                            <div className="h-px w-16 bg-[#F0E7D5]/30 mt-3" />
                        </div>

                        <h1 className="text-5xl lg:text-8xl xl:text-9xl font-light text-[#F0E7D5] mb-8 leading-[1.05] tracking-tight max-w-5xl">
                            {header.title || t('faq.title')}
                        </h1>

                        <p className="text-lg lg:text-xl text-[#F0E7D5]/70 max-w-2xl font-light leading-relaxed">
                            {header.subtitle || t('faq.subtitle')}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 flex flex-col items-center lg:items-start gap-4"
                >
                    <span className="text-[#F0E7D5]/40 text-[10px] font-light uppercase tracking-[0.3em] lg:-rotate-90">
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-12 bg-gradient-to-b from-[#F0E7D5]/60 to-transparent"
                    />
                </motion.div>
            </section>

            {/* Content Section - DESIGN VISIBLE ET PREMIUM */}
            <section className="py-20 px-6 lg:px-12 bg-[#F0E7D5]">
                <div className="max-w-[1600px] mx-auto">

                    {isLoading ? (
                        <div className="text-center py-32">
                            <Loader2 className="w-16 h-16 text-[#443C34] animate-spin mx-auto mb-6" />
                            <p className="text-2xl text-[#443C34] font-bold">{t('common.loading')}</p>
                        </div>
                    ) : (
                        <>
                            {/* Search & Filters - DESIGN MODERNE */}
                            <div className="mb-20">
                                <div className="relative max-w-3xl mx-auto mb-8">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('faq.searchPlaceholder') || 'Rechercher une question...'}
                                        className="w-full px-6 py-5 bg-white border-2 border-[#D4A574]/30 rounded-2xl text-[#443C34] placeholder:text-[#8B7355]/50 focus:outline-none focus:border-[#443C34] focus:ring-4 focus:ring-[#D4A574]/20 transition-all font-medium text-lg shadow-lg"
                                    />
                                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#443C34]/40 pointer-events-none" />
                                    {searchQuery && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-16 top-1/2 -translate-y-1/2 p-2 hover:bg-[#4B3935]/10 rounded-full transition-colors cursor-pointer"
                                        >
                                            <X size={20} className="text-[#443C34]" />
                                        </motion.button>
                                    )}
                                </div>

                                {/* Categories - BOUTONS PREMIUM */}
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {categories.map((category) => (
                                        <motion.button
                                            key={category}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-8 py-4 text-sm font-bold uppercase tracking-wider  cursor-pointer rounded-xl transition-all shadow-md hover:shadow-xl ${selectedCategory === category
                                                    ? 'bg-gradient-to-r from-[#443C34] to-[#5a4a44] text-white'
                                                    : 'bg-white text-[#443C34] border-2 border-[#D4A574]/30 hover:border-[#443C34]'
                                                }`}
                                        >
                                            {category === 'all' ? t('faq.allCategories') || 'Toutes' : category}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Stats - CARTES VISIBLES */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                                {[
                                    { label: t('faq.totalQuestions') || 'Questions', value: faqs.length },
                                    { label: t('faq.categories') || 'Catégories', value: categories.length - 1 },
                                    { label: t('faq.resultsFound') || 'Résultats', value: filteredFaqs.length },
                                    { label: t('faq.openAnswers') || 'Ouverte', value: openFaqId ? 1 : 0 },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-2xl p-8 text-center shadow-xl border-2 border-[#D4A574]/30 hover:shadow-2xl transition-all"
                                    >
                                        <p className="text-5xl font-bold text-[#443C34] mb-3">{stat.value}</p>
                                        <p className="text-sm text-[#8B7355] uppercase tracking-wider font-bold">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* FAQs List - ACCORDÉONS PREMIUM */}
                            {filteredFaqs.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-white rounded-2xl shadow-xl border-2 border-[#D4A574]/30"
                                >
                                    <HelpCircle size={64} className="text-[#D4A574] mx-auto mb-6" />
                                    <p className="text-2xl text-[#443C34] mb-6 font-bold">
                                        {t('faq.noResults') || 'Aucune question trouvée'}
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                        className="bg-gradient-to-r from-[#443C34] to-[#5a4a44] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer"
                                    >
                                        {t('faq.resetFilters') || 'Réinitialiser les filtres'}
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <div className="space-y-12">
                                    {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                                        <div key={category}>
                                            {/* Category Header - DESIGN VISIBLE */}
                                            <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-[#D4A574]/30">
                                                <h2 className="text-3xl font-bold text-[#443C34]">{category}</h2>
                                                <p className="text-sm text-[#8B7355] mt-2 font-medium">
                                                    {categoryFaqs.length} {categoryFaqs.length === 1 ? 'question' : 'questions'}
                                                </p>
                                            </div>

                                            {/* FAQ Items - ACCORDÉONS ÉLÉGANTS */}
                                            <div className="space-y-4">
                                                {categoryFaqs.map((faq, index) => {
                                                    const isOpen = openFaqId === faq.id;

                                                    return (
                                                        <motion.div
                                                            key={faq.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className={`bg-white rounded-2xl shadow-lg border-2 transition-all overflow-hidden ${isOpen
                                                                    ? 'border-[#443C34] shadow-2xl'
                                                                    : 'border-[#D4A574]/30 hover:border-[#D4A574]'
                                                                }`}
                                                        >
                                                            <button
                                                                onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                                                                className="w-full p-6 lg:p-8 flex items-start justify-between gap-6 text-left group cursor-pointer"
                                                            >
                                                                <h3 className="text-lg lg:text-xl font-bold text-[#443C34] flex-1 leading-relaxed">
                                                                    {faq.question}
                                                                </h3>

                                                                <motion.div
                                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#D4A574] to-[#c89963] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                                                                >
                                                                    <ChevronDown size={24} strokeWidth={3} />
                                                                </motion.div>
                                                            </button>

                                                            <AnimatePresence>
                                                                {isOpen && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="px-6 lg:px-8 pb-6 lg:pb-8 pt-0">
                                                                            <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#D4A574]">
                                                                                <p className="text-[#443C34] font-medium leading-relaxed text-base">
                                                                                    {faq.answer}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CTA Section - DESIGN PREMIUM */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-32 bg-gradient-to-br from-[#443C34] to-[#5a4a44] rounded-3xl p-12 lg:p-16 text-center shadow-2xl text-white"
                            >
                                <h3 className="text-3xl lg:text-5xl font-bold mb-6">
                                    {t('faq.stillHaveQuestions') || 'Vous avez encore des questions ?'}
                                </h3>
                                <p className="text-lg lg:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                                    {t('faq.contactUsMessage') || 'Notre équipe est là pour vous aider à planifier votre aventure parfaite.'}
                                </p>

                                {onNavigateToContact && (
                                    <motion.button
                                        whileHover={{ scale: 1.05, x: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onNavigateToContact}
                                        className="group inline-flex items-center gap-4 bg-white text-[#443C34] px-10 py-5 rounded-xl font-bold text-lg uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                                    >
                                        <span>{t('contact.title') || 'Nous contacter'}</span>
                                        <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
                                    </motion.button>
                                )}
                            </motion.div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}