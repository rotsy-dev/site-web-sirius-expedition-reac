import * as React from 'react'
import { motion } from 'framer-motion'
import { Award, Users, Globe, Heart, Shield, Clock, Star, Leaf, Target, TrendingUp, Headphones, DollarSign, UserCheck, Loader2, ArrowRight } from 'lucide-react';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { useTranslation } from 'react-i18next';

interface AboutUsProps {
  config: {
    siteName: string;
    videos: {
      aboutUsVideoId: string;
    };
    services: {
      hosting: string[];
      domain: string;
      email: string;
    };
  };
  content?: {
    ourStory?: {
      title: string;
      paragraphs: string[];
    };
    pageHeaders?: {
      about?: {
        badge?: string;
        title?: string;
        subtitle?: string;
      };
    };
  };
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1598563352765-85f7971070a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW11ciUyME1hZGFnYXNjYXIlMjB3aWxkbGlmZXxlbnwxfHx8fDE3NjQ1OTE4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function AboutUs({ config, content = {} }: AboutUsProps) {
  const { t } = useTranslation();

  const { translatedContent: translatedStory, isLoading: isTranslatingStory } = useTranslatedContent(
    content?.ourStory ?? null,
    ['title', 'paragraphs']
  );

  const { translatedContent: translatedAboutHeader } = useTranslatedContent(
    content?.pageHeaders?.about ?? null,
    ['badge', 'title', 'subtitle']
  );

  const story = (translatedStory || content?.ourStory) as typeof content.ourStory;
  const header = (translatedAboutHeader as { badge?: string; title?: string; subtitle?: string } | null)
    || content?.pageHeaders?.about
    || {};

  const [heroImageLoaded, setHeroImageLoaded] = React.useState(false);

  React.useEffect(() => {
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

  const finalStory = story || {
    title: t('about.ourStory'),
    paragraphs: [
      t('about.paragraph1'),
      t('about.paragraph2'),
      t('about.paragraph3')
    ]
  };

  const stats = [
    { icon: <Users size={40} />, number: '500+', label: t('about.happyTravelers') },
    { icon: <Globe size={40} />, number: '50+', label: t('about.tourPackages') },
    { icon: <Clock size={40} />, number: '15+', label: t('about.yearsExperience') },
    { icon: <Star size={40} />, number: '4.9', label: t('about.averageRating') },
  ];

  const values = [
    {
      icon: <Award size={36} />,
      title: 'Excellence',
      description: 'We strive for the highest quality in every tour we offer',
    },
    {
      icon: <Leaf size={36} />,
      title: 'Sustainability',
      description: 'Committed to eco-friendly and responsible tourism',
    },
    {
      icon: <Target size={36} />,
      title: 'Authenticity',
      description: 'Genuine experiences that showcase real Madagascar',
    },
    {
      icon: <Heart size={36} />,
      title: 'Passion',
      description: 'We love what we do and it shows in every detail',
    },
  ];

  const whyChooseUs = [
    {
      icon: <Users size={28} />,
      title: 'Expert Local Guides',
      description: 'Our certified guides have extensive knowledge of Madagascar\'s ecosystems and culture',
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'Customized Itineraries',
      description: 'Every tour is tailored to your interests, budget, and schedule',
    },
    {
      icon: <UserCheck size={28} />,
      title: 'Small Group Sizes',
      description: 'Maximum 8 people per group for a personalized experience',
    },
    {
      icon: <Headphones size={28} />,
      title: '24/7 Support',
      description: 'We\'re always available to assist you before, during, and after your trip',
    },
    {
      icon: <DollarSign size={28} />,
      title: 'Best Price Guarantee',
      description: 'Competitive prices without compromising quality or safety',
    },
    {
      icon: <Shield size={28} />,
      title: 'Safety First',
      description: 'Comprehensive insurance and safety protocols for your peace of mind',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0a0806] overflow-hidden">
      {/* Hero */}
      <section className="relative h-screen flex items-end overflow-hidden bg-[#0a0806]">
        <div className="absolute inset-0">
          {HERO_IMAGE ? (
            <img
              src={HERO_IMAGE}
              alt="About Us"
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
                {header.badge || t('sections.aboutUs')}
              </span>
              <div className="h-px w-16 bg-[#F0E7D5]/30 mt-3" />
            </div>

            <h1 className="text-5xl lg:text-8xl xl:text-9xl font-light text-[#F0E7D5] mb-8 leading-[1.05] tracking-tight max-w-5xl">
              {header.title || t('about.title')}
            </h1>

            <p className="text-lg lg:text-xl text-[#F0E7D5]/70 max-w-2xl font-light leading-relaxed">
              {header.subtitle || t('about.subtitle')}
            </p>

            {isTranslatingStory && (
              <div className="flex items-center gap-2 mt-6 text-sm text-[#F0E7D5]/60 font-light">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="uppercase tracking-[0.15em] text-xs">{t('common.loading')}</span>
              </div>
            )}
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

      {/* Stats Section - DESIGN VISIBLE ET PREMIUM */}
      <section className="py-20 px-6 lg:px-12 bg-[#F0E7D5]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-8 lg:p-10 rounded-2xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 ${index % 2 === 0
                    ? 'bg-white border-2 border-[#D4A574]/30'
                    : 'bg-gradient-to-br from-[#443C34] to-[#5a4a44] text-white'
                  }`}
              >
                <div className={`mb-6 mx-auto w-fit ${index % 2 === 0 ? 'text-[#443C34]' : 'text-white'}`}>
                  {stat.icon}
                </div>
                <h3 className="text-5xl font-bold mb-3">
                  {stat.number}
                </h3>
                <p className={`text-sm font-medium uppercase tracking-wider ${index % 2 === 0 ? 'text-[#8B7355]' : 'text-white/80'}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Notre Histoire - LAYOUT VISIBLE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-32">
            <div className="bg-white rounded-2xl p-10 shadow-xl border-2 border-[#D4A574]/30">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#443C34] mb-8">
                {finalStory.title}
              </h2>

              {finalStory.paragraphs.map((para, idx) => (
                <p key={idx} className="text-[#443C34]/80 mb-6 font-medium text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <div className="relative aspect-video lg:aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${config.videos.aboutUsVideoId}`}
                title="Sirius Expedition"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Nos Valeurs - CARTES PREMIUM VISIBLES */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#443C34] mb-4">
                {t('about.values')}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#D4A574] to-[#443C34] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#D4A574]/30 hover:border-[#443C34] transition-all group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#443C34] to-[#5a4a44] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <div className="text-white">
                      {value.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#443C34] mb-4">
                    {value.title}
                  </h3>

                  <p className="text-[#443C34]/70 font-medium leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pourquoi nous choisir - DESIGN MODERNE */}
          <div>
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#443C34] mb-4">
                {t('about.whyChooseUs')}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#D4A574] to-[#443C34] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl p-8 shadow-xl border-2 border-[#D4A574]/30 hover:border-[#443C34] hover:shadow-2xl transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D4A574] to-[#c89963] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#443C34] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-[#443C34]/70 font-medium leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <motion.div
                    className="flex items-center gap-2 text-[#443C34] opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-bold uppercase tracking-wider">{t('common.learnMore')}</span>
                    <ArrowRight size={16} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Services Footer - CARTE PREMIUM */}
          <div className="mt-32 bg-gradient-to-br from-[#443C34] to-[#5a4a44] rounded-2xl p-10 shadow-2xl text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-xs text-white/70 uppercase tracking-widest mb-3 font-bold">{t('contact.hosting')}</p>
                <p className="text-xl font-bold">
                  {config.services.hosting.join(' & ')}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/70 uppercase tracking-widest mb-3 font-bold">{t('contact.domain')}</p>
                <p className="text-xl font-bold">
                  {config.services.domain}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/70 uppercase tracking-widest mb-3 font-bold">{t('contact.emailLabel')}</p>
                <p className="text-xl font-bold">
                  {config.services.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}