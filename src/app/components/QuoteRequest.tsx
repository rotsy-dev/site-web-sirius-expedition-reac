import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';

interface QuoteRequestProps {
  config: any;
  content?: {
    pageHeaders?: {
      quote?: {
        badge?: string;
        title?: string;
        subtitle?: string;
      };
    };
    tourSpecialties?: { id: number; title: string }[];
  };
}

interface QuoteFormData {
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  tourId: string;
  pax: string;
  startDate: string;
  endDate: string;
  message: string;
}

const COUNTRIES = [
  'Madagascar', 'France', 'United States', 'Canada', 'United Kingdom',
  'Germany', 'Italy', 'Spain', 'Belgium', 'Switzerland', 'Other'
];

const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_l1gjbfn',
  TEMPLATE_ID: 'template_3cd2i9j',
  PUBLIC_KEY: 'W0nk9SmEG3BmP8ztj',
};

const HERO_IMAGE = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1920&q=80";

export function QuoteRequest({ config, content = {} }: QuoteRequestProps) {
  const { t } = useTranslation();

  const { translatedContent: translatedQuoteHeader, isLoading: isTranslatingHeader } =
    useTranslatedContent(
      content.pageHeaders?.quote ?? null,
      ['badge', 'title', 'subtitle']
    );

  const header = (translatedQuoteHeader as { badge?: string; title?: string; subtitle?: string } | null)
    || content.pageHeaders?.quote
    || {};

  const tours = (content.tourSpecialties || []) as { id: number; title: string }[];

  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    whatsapp: '',
    country: '',
    tourId: '',
    pax: '',
    startDate: '',
    endDate: '',
    message: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Préchargement de l'image de fond
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeroImageLoaded(true);
    img.onerror = () => setHeroImageLoaded(true);
    img.src = HERO_IMAGE;
  }, []);

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!formData.name.trim()) errs.push(t('quote.errors.name'));
    if (!formData.email.trim()) errs.push(t('quote.errors.email'));
    if (!formData.country.trim()) errs.push(t('quote.errors.country'));
    if (!formData.tourId.trim()) errs.push(t('quote.errors.tour'));
    if (!formData.pax.trim()) errs.push(t('quote.errors.pax'));
    if (!formData.startDate.trim() || !formData.endDate.trim()) errs.push(t('quote.errors.datePeriod'));
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.length) setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    const v = validate();
    if (v.length) {
      setErrors(v);
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedTour = tours.find(t => String(t.id) === formData.tourId);
      const datePeriod = formData.startDate && formData.endDate
        ? `${formData.startDate} ~ ${formData.endDate}`
        : t('quote.notProvided');

      const templateParams = {
        to_email: config.contact.email,
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp || t('quote.notProvided'),
        country: formData.country,
        tour_name: selectedTour?.title || t('quote.notProvided'),
        tour_id: formData.tourId || t('quote.notProvided'),
        pax: formData.pax,
        date_period: datePeriod,
        message: formData.message || t('quote.notProvided'),
        time: new Date().toLocaleString(),
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        country: '',
        tourId: '',
        pax: '',
        startDate: '',
        endDate: '',
        message: '',
      });
    } catch (err) {
      console.error('Quote email error', err);
      setErrors([t('quote.sendError')]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Hero Section avec Background Image */}
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
                alt="Quote Request Sirius Expedition"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  heroImageLoaded ? 'opacity-100' : 'opacity-0'
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
              className="fill-[#F0E7D5] dark:fill-[#1a1410]"
            ></path>
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
              {isTranslatingHeader ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t('quote.badge')}
                </span>
              ) : (
                header.badge || t('quote.badge')
              )}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight"
          >
            {isTranslatingHeader ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('quote.title')}
              </span>
            ) : (
              header.title || t('quote.title')
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {isTranslatingHeader ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('quote.subtitle')}
              </span>
            ) : (
              header.subtitle || t('quote.subtitle')
            )}
          </motion.p>
        </div>
      </section>

      {/* Main Content Section - Thème Mocha & Vanilla comme Contact */}
      <section className="py-20 px-4 sm:px-10 lg:px-20 bg-[#F0E7D5]">
        <div className="max-w-4xl mx-auto">
          {/* Quote Form - Thème Mocha & Vanilla - Centré */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white p-8 md:p-10 rounded-3xl border-4 border-[#D4A574] shadow-2xl"
          >
            <h3 className="text-4xl font-bold mb-2 text-[#443C34]">{t('quote.title')}</h3>
            <p className="text-[#8B7355] mb-8 font-medium">
              {t('quote.subtitle')}
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-600 mb-1">{t('contact.validationErrors')}</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{t('quote.sent')}</span>
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-bold text-[#443C34]">
                      {t('quote.name')} <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder={t('quote.placeholders.name')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-bold text-[#443C34]">
                      {t('quote.email')} <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder={t('quote.placeholders.email')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="whatsapp" className="block mb-2 text-sm font-bold text-[#443C34]">
                      {t('quote.whatsapp')}
                    </label>
                    <input
                      type="text"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder={t('quote.placeholders.whatsapp')}
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block mb-2 text-sm font-bold text-[#443C34]">
                      {t('quote.country')} <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] cursor-pointer"
                    >
                      <option value="">{t('quote.placeholders.country')}</option>
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="tourId" className="block mb-2 text-sm font-bold text-[#443C34]">
                      {t('quote.tour')} <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="tourId"
                      name="tourId"
                      value={formData.tourId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] cursor-pointer"
                    >
                      <option value="">{t('quote.placeholders.tour')}</option>
                      {tours.map(tour => (
                        <option key={tour.id} value={tour.id}>{tour.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pax" className="block mb-2 text-sm font-bold text-[#443C34]">
                      {t('quote.pax')} <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      id="pax"
                      name="pax"
                      value={formData.pax}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder={t('quote.placeholders.pax')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-[#443C34]">
                    {t('quote.datePeriod')} <span className="text-red-600">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34]"
                      />
                    </div>
                    <div className="flex items-center justify-center text-[#8B7355] font-bold text-lg">~</div>
                    <div className="flex-1">
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-bold text-[#443C34]">
                    {t('quote.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all resize-none text-[#443C34] placeholder:text-[#8B7355]/50"
                    placeholder={t('quote.placeholders.message')}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: submitted || isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: submitted || isSubmitting ? 1 : 0.98 }}
                disabled={submitted || isSubmitting}
                className="cursor-pointer w-full bg-[#443C34] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-[#332C26] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-8 shadow-lg hover:shadow-2xl"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={20} />
                    {t('quote.sent')}
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('quote.sending')}
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    {t('quote.submit')}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
