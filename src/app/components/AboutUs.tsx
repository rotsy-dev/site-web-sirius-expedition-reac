import * as React from 'react'
import { motion } from 'framer-motion'
import { Award, Users, Globe, Heart, Shield, Clock, Star, CheckCircle, Leaf, Target, TrendingUp, Headphones, DollarSign, UserCheck } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import ScrollReveal from 'scrollreveal'

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

const HERO_IMAGE = "https://images.unsplash.com/photo-1598563352765-85f7971070a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW11ciUyME1hZGFnYXNjYXIlMjB3aWxkbGlmZXxlbnwxfHx8fDE3NjQ1OTE4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function AboutUs({ config, content = {} }: AboutUsProps) {
  React.useEffect(() => {
    if (typeof ScrollReveal !== 'undefined') {
      const sr = ScrollReveal({
        reset: false,
        distance: '40px',
        duration: 800,
        delay: 0,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        mobile: true
      })

      sr.reveal('.reveal-stats', { origin: 'bottom', interval: 100 })
      sr.reveal('.reveal-left', { origin: 'left', distance: '60px' })
      sr.reveal('.reveal-right', { origin: 'right', distance: '60px' })
      sr.reveal('.reveal-bottom', { origin: 'bottom', distance: '60px' })
      sr.reveal('.reveal-values', { origin: 'bottom', interval: 100 })
      sr.reveal('.reveal-why', { origin: 'bottom', interval: 100 })
    }
  }, [])

  // Récupération des données dynamiques de l'histoire
  const story = content?.ourStory || {
    title: 'Our Story',
    paragraphs: [
      "Sirius Expedition was founded with a simple mission: to share the incredible beauty and biodiversity of Madagascar with the world...",
      "With years of experience and deep local knowledge, we specialize in creating customized tours...",
      "From the iconic Avenue of the Baobabs to the pristine beaches of Sainte Marie..."
    ]
  };

  const stats = [
    { icon: <Users size={40} />, number: '500+', label: 'Happy Travelers' },
    { icon: <Globe size={40} />, number: '50+', label: 'Tour Packages' },
    { icon: <Clock size={40} />, number: '15+', label: 'Years Experience' },
    { icon: <Star size={40} />, number: '4.9', label: 'Average Rating' },
  ];

  const values = [
    {
      icon: <Award size={32} />,
      title: 'Excellence',
      description: 'We strive for the highest quality in every tour we offer',
    },
    {
      icon: <Leaf size={32} />,
      title: 'Sustainability',
      description: 'Committed to eco-friendly and responsible tourism',
    },
    {
      icon: <Target size={32} />,
      title: 'Authenticity',
      description: 'Genuine experiences that showcase real Madagascar',
    },
    {
      icon: <Heart size={32} />,
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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Hero Section avec Background Image */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={HERO_IMAGE}
            alt="About Sirius Expedition"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-block px-5 py-1.5 bg-[#D4A574] text-white rounded-full text-xs md:text-sm font-bold tracking-wider">
              {content?.pageHeaders?.about?.badge || 'ABOUT US'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight"
          >
            {content?.pageHeaders?.about?.title || 'About Sirius Expedition'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {content?.pageHeaders?.about?.subtitle || 'Your trusted partner for unforgettable Madagascar adventures'}
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Stats Section - Thème Mocha & Vanilla */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24 lg:mb-48">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`reveal-stats p-6 lg:p-8 rounded-2xl text-center flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 ${
                index === 1 || index === 3 
                  ? 'bg-[#443C34] text-white hover:bg-[#332C26]' 
                  : 'bg-[#F0E7D5] text-[#443C34] hover:bg-[#D4A574] hover:text-white'
              }`}
            >
              <div className="mb-4 opacity-90">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2">
                {stat.number}
              </h3>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Our Story with Video */}
        <div className="mb-24 lg:mb-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 lg:mb-20 ">
            {/* Left: Story Text (MAINTENANT DYNAMIQUE) */}
            <div
              className="flex flex-col justify-center reveal-left"
            >
              <h3 className="text-5xl font-bold mb-6 text-[#443C34]">{story.title}</h3>
              {story.paragraphs.map((para, idx) => (
                <p key={idx} className="text-gray-600 mb-4 text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Right: YouTube Video */}
            <div className="reveal-right">
              <div className="rounded-2xl overflow-hidden ">
                <div className="relative pb-[56.25%] h-0 bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${config.videos.aboutUsVideoId}`}
                    title="Sirius Expedition - Discover Madagascar"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Photo left, Quote + Community card right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 lg:gap-14">
            {/* Left: Lemur Photo */}
            <div className="reveal-bottom">
              <img
                src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop"
                alt="Madagascar lemur"
                className="rounded-2xl w-full object-cover h-auto max-h-[310px]"
                loading="lazy"
              />
            </div>

            {/* Right: Quote + Community Card - Thème Mocha & Vanilla */}
            <div className="flex flex-col gap-6 reveal-bottom">
              <div className="bg-white rounded-2xl p-6 border-2 border-[#D4A574]/30 border-l-4 border-l-[#443C34] shadow-md hover:shadow-xl transition-all duration-300">
                <p className="text-gray-600 italic text-base leading-relaxed">
                  "{story.paragraphs[story.paragraphs.length - 1]}"
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#F0E7D5] to-[#F8F5F0] rounded-[2rem] p-6 flex flex-col gap-3 border-2 border-[#D4A574]/20 shadow-md">

                <div className="rounded-2xl flex flex-col gap-1">

                  {/* LIGNE 1 : Hosting */}
                  <div className="bg-white/80 p-3 px-5 rounded-xl flex items-center justify-start gap-3 border-2 border-[#443C34]/10 hover:border-[#D4A574]/50 transition-all duration-300">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8B7355] w-20">
                      Hosted by :
                    </span>
                    <span className="font-bold text-[#443C34] text-xs">
                      {config.services.hosting.join(' & ')}
                    </span>
                  </div>

                  {/* LIGNE 2 : Domaine */}
                  <div className="bg-white/80 p-3 px-5 rounded-xl flex items-center justify-start gap-3 border-2 border-[#443C34]/10 hover:border-[#D4A574]/50 transition-all duration-300">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8B7355] w-20">
                      Domaine :
                    </span>
                    <span className="font-bold text-[#443C34] text-xs flex-1">
                      {config.services.domain}
                    </span>
                  </div>

                  {/* LIGNE 3 : Email */}
                  <div className="bg-white/80 p-3 px-5 rounded-xl flex items-center justify-start gap-3 border-2 border-[#443C34]/10 hover:border-[#D4A574]/50 transition-all duration-300">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#8B7355] w-20">
                      Email by :
                    </span>
                    <span className="font-bold text-[#443C34] text-xs flex-1">
                      {config.services.email}
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Values - Thème Mocha & Vanilla */}
        <div className="mb-24 lg:mb-48">
          <div className="text-center space-y-3 mb-12 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#443C34]">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index}
                className="reveal-values group p-6 sm:p-8 rounded-3xl border-2 border-[#D4A574]/20 bg-white hover:bg-gradient-to-br hover:from-[#F0E7D5] hover:to-white transition-all duration-500 ease-out transform hover:-rotate-1 hover:-translate-y-3 hover:border-[#443C34] hover:shadow-2xl flex flex-col items-start text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 bg-[#F0E7D5] shadow-sm transition-all group-hover:bg-[#443C34]">
                  <div className="text-[#443C34] group-hover:text-white transition-colors">{value.icon}</div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#443C34] transition-colors group-hover:text-[#8B7355]">{value.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us - Thème Mocha & Vanilla */}
        <div className="mb-24 lg:mb-48">
          <div className="text-center space-y-3 mb-12 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#443C34]">Why Choose Sirius Expedition ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index}
                className="reveal-why group p-6 sm:p-8 rounded-3xl border-2 border-[#D4A574]/20 bg-gradient-to-br from-[#F8F5F0] to-white hover:from-white hover:to-[#F0E7D5] transition-all duration-500 ease-out transform hover:-rotate-1 hover:-translate-y-3 hover:border-[#443C34] hover:shadow-2xl flex flex-col items-start text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 bg-white shadow-md transition-all group-hover:bg-[#443C34] border-2 border-[#D4A574]/20">
                  <div className="text-[#443C34] group-hover:text-white transition-colors">{item.icon}</div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#443C34] transition-colors group-hover:text-[#8B7355]">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}