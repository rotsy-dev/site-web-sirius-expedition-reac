import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, X, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ScrollReveal from 'scrollreveal';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

interface FAQPageProps {
    content?: {
        pageHeaders?: {
            faq?: {
                badge?: string;
                title?: string;
                subtitle?: string;
            };
        };
    };
}


const HERO_IMAGE = "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=600&fit=crop";

export function FAQPage({ content = {} }: FAQPageProps) {
    const { t } = useTranslation();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [heroImageLoaded, setHeroImageLoaded] = useState(false);
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const header = content?.pageHeaders?.faq || {};

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

    useEffect(() => {
        if (typeof ScrollReveal === 'undefined' || isLoading) return;

        let sr: any = null;
        let isMounted = true;

        try {
            sr = ScrollReveal({
                reset: false,
                distance: '40px',
                duration: 800,
                delay: 0,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                mobile: true
            });

            if (isMounted && sr) {
                sr.reveal('.reveal-faq', { origin: 'bottom', interval: 100 });
                sr.reveal('.reveal-category', { origin: 'bottom', interval: 50 });
            }
        } catch (error) {
            console.warn('ScrollReveal initialization error:', error);
        }

        return () => {
            isMounted = false;
            if (sr && typeof sr.destroy === 'function') {
                try {
                    sr.destroy();
                } catch (error) {
                    console.warn('ScrollReveal cleanup error:', error);
                }
            }
        };
    }, [isLoading]);

    const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
        if (!acc[faq.category]) acc[faq.category] = [];
        acc[faq.category].push(faq);
        return acc;
    }, {} as Record<string, FAQ[]>);

    return (
        <div className="bg-[#F0E7D5] min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 overflow-hidden"
                >
                    {HERO_IMAGE ? (
                        <>
                            <img
                                src={HERO_IMAGE}
                                alt="FAQ Hero"
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                loading="eager"
                                fetchPriority="high"
                            />
                            {!heroImageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#4B3935] to-[#3d2f2b]" />
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4B3935] to-[#3d2f2b]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full leading-[0] z-20">
                    <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.83C0,95.83,161,122.35,321.39,56.44Z"
                            className="fill-[#F3E5D1]"
                        />
                    </svg>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-4"
                    >
                        <span className="inline-block px-5 py-1.5 bg-[#D4A574] text-white rounded-full text-xs md:text-sm font-bold tracking-wider">
                            {header.badge || t('sections.faq')}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-4xl md:text-6xl lg:text-6xl font-black text-white mb-4 tracking-tight"
                    >
                        {header.title || t('faq.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-base md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        {header.subtitle || t('faq.subtitle')}
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="text-center py-16">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#443C34]" />
                        <p className="text-lg text-gray-600">{t('common.loading')}</p>
                    </div>
                ) : (
                    <>
                        {/* Search & Filter */}
                        <div className="mb-12 space-y-6">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('faq.searchPlaceholder') || 'Search questions...'}
                                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-[#D4A574]/20 rounded-2xl text-[#443C34] focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent shadow-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#443C34] transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${selectedCategory === category
                                            ? 'bg-gradient-to-r from-[#443C34] to-[#8B7355] text-white shadow-lg'
                                            : 'bg-white text-[#443C34] border-2 border-[#D4A574]/20 hover:border-[#D4A574] hover:shadow-md'
                                            }`}
                                    >
                                        {category === 'all' ? t('faq.allCategories') || 'All' : category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm">
                                <p className="text-sm text-[#8B7355] mb-1 font-medium">{t('faq.totalQuestions') || 'Total Questions'}</p>
                                <p className="text-3xl font-bold text-[#443C34]">{faqs.length}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm">
                                <p className="text-sm text-[#8B7355] mb-1 font-medium">{t('faq.categories') || 'Categories'}</p>
                                <p className="text-3xl font-bold text-[#443C34]">{categories.length - 1}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm">
                                <p className="text-sm text-[#8B7355] mb-1 font-medium">{t('faq.resultsFound') || 'Results'}</p>
                                <p className="text-3xl font-bold text-[#443C34]">{filteredFaqs.length}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm">
                                <p className="text-sm text-[#8B7355] mb-1 font-medium">{t('faq.openAnswers') || 'Open'}</p>
                                <p className="text-3xl font-bold text-[#443C34]">{openFaqId ? 1 : 0}</p>
                            </div>
                        </div>

                        {/* FAQs by Category */}
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-[#D4A574]/30">
                                <HelpCircle size={64} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-[#443C34] mb-2">
                                    {t('faq.noResults') || 'No questions found'}
                                </h3>
                                <p className="text-gray-600">
                                    {t('faq.tryDifferentSearch') || 'Try a different search term or category'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                                    <div key={category} className="reveal-category">
                                        <div className="mb-8 pb-4 border-b-2 border-[#D4A574]/30">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#D4A574] to-[#C4965F] rounded-xl flex items-center justify-center shadow-md">
                                                    <HelpCircle size={24} className="text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-[#443C34] mb-1">
                                                        {category}
                                                    </h2>
                                                    <p className="text-sm text-[#8B7355] font-medium">
                                                        {categoryFaqs.length} {categoryFaqs.length === 1 ? 'question' : 'questions'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {categoryFaqs.map((faq, index) => {
                                                const isOpen = openFaqId === faq.id;
                                                return (
                                                    <div
                                                        key={faq.id}
                                                        className="reveal-faq bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#D4A574]/40 transition-all duration-300 group"
                                                    >
                                                        <button
                                                            onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                                                            className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left group-hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div className="flex items-start gap-4 flex-1">
                                                                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen
                                                                        ? 'bg-[#D4A574]'
                                                                        : 'bg-gray-200 group-hover:bg-[#D4A574]/20'
                                                                    }`}>
                                                                    <span className={`text-xs font-bold ${isOpen ? 'text-white' : 'text-gray-500 group-hover:text-[#D4A574]'
                                                                        }`}>
                                                                        {index + 1}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-lg font-semibold text-[#443C34] leading-tight">
                                                                    {faq.question}
                                                                </h3>
                                                            </div>
                                                            <motion.div
                                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="flex-shrink-0"
                                                            >
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen
                                                                        ? 'bg-[#D4A574]'
                                                                        : 'bg-gray-100 group-hover:bg-gray-200'
                                                                    }`}>
                                                                    <ChevronDown size={20} className={isOpen ? 'text-white' : 'text-[#443C34]'} />
                                                                </div>
                                                            </motion.div>
                                                        </button>

                                                        <AnimatePresence>
                                                            {isOpen && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="px-6 pb-6 pt-2 pl-16">
                                                                        <div className="bg-gradient-to-br from-[#F8F5F0] to-white rounded-lg p-5 border-l-4 border-[#D4A574]">
                                                                            <div className="flex items-start gap-3">
                                                                                <CheckCircle size={20} className="text-[#D4A574] mt-0.5 flex-shrink-0" />
                                                                                <p className="text-[#443C34]/90 leading-relaxed text-base">
                                                                                    {faq.answer}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-16 bg-white rounded-3xl p-8 md:p-12 text-center border border-gray-200 shadow-sm"
                        >
                            <HelpCircle size={48} className="text-[#443C34] mx-auto mb-4" />
                            <h3 className="text-2xl md:text-3xl font-bold text-[#443C34] mb-3">
                                {t('faq.stillHaveQuestions') || 'Still have questions?'}
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                {t('faq.contactUsMessage') || "Can't find the answer you're looking for? Our team is here to help you."}
                            </p>
                            <button className="px-8 py-4 bg-gradient-to-r from-[#443C34] to-[#8B7355] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {t('faq.contactUs') || 'Contact Us'}
                            </button>
                        </motion.div>
                    </>
                )}
            </section>
        </div>
    );
}