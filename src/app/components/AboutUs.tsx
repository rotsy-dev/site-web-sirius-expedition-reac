import * as React from 'react'
import { Award, Users, Globe, Heart, Shield, Clock, Star, CheckCircle, Leaf, Target, TrendingUp, Headphones, DollarSign, UserCheck } from 'lucide-react';
import { motion } from "framer-motion"
import { SectionHeader } from '@/components/common/SectionHeader';

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

export function AboutUs({ config, content = {} }: AboutUsProps) {
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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <SectionHeader
          badge={content.pageHeaders?.about?.badge || 'About'}
          title={content.pageHeaders?.about?.title || 'About Sirius Expedition'}
          subtitle={content.pageHeaders?.about?.subtitle || 'Your trusted partner for unforgettable Madagascar adventures'}
        />

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24 lg:mb-48"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 lg:p-8 rounded-2xl text-center flex flex-col items-center justify-center ${index === 1 || index === 3 ? 'bg-[#4A3931] text-white' : 'bg-[#F7EBD5] text-[#443C34]'
                }`}
            >
              <div className="mb-4 opacity-90">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2">
                {stat.number}
              </h3>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Story with Video */}
        <div className="mb-24 lg:mb-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 lg:mb-20 ">
            {/* Left: Story Text (MAINTENANT DYNAMIQUE) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-5xl font-bold mb-6 text-[#443C34]">{story.title}</h3>
              {story.paragraphs.map((para, idx) => (
                <p key={idx} className="text-gray-600 mb-4 text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Right: YouTube Video */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
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
            </motion.div>
          </div>

          {/* Bottom Row: Photo left, Quote + Community card right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 lg:gap-14">
            {/* Left: Lemur Photo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop"
                alt="Madagascar lemur"
                className="rounded-2xl w-full object-cover h-auto max-h-[310px]"
                loading="lazy"
              />
            </motion.div>

            {/* Right: Quote + Community Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-100 border-l-4 border-l-[#443C34]">
                <p className="text-gray-600 italic text-base leading-relaxed">
                  "{story.paragraphs[story.paragraphs.length - 1]}" 
                </p>
              </div>

             <div className="bg-[#F5E6D3] rounded-[2rem] p-6 flex flex-col gap-3">
  
              <div className="bg-[#F5E6D3] rounded-2xl  flex flex-col gap-1">
  
              {/* LIGNE 1 : Hosting */}
              <div className="bg-[#443C34]/5 p-3 px-5 rounded-xl flex items-center justify-start gap-3 border border-[#443C34]/10">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#443C34]/60 w-20">
                  Hosted by :
                </span>
                <span className="font-bold text-[#443C34] text-xs">
                  {config.services.hosting.join(' & ')}
                </span>
              </div>

              {/* LIGNE 2 : Domaine */}
              <div className="bg-[#443C34]/5 p-3 px-5 rounded-xl flex items-center justify-start gap-3 border border-[#443C34]/10">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#443C34]/60 w-20">
                  Domaine :
                </span>
                <span className="font-bold text-[#443C34] text-xs flex-1">
                  {config.services.domain}
                </span>
              </div>

              {/* LIGNE 3 : Email */}
              <div className="bg-[#443C34]/5 p-3 px-5 rounded-xl flex items-center justify-start gap-3 border border-[#443C34]/10">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#443C34]/60 w-20">
                  Email by :
                </span>
                <span className="font-bold text-[#443C34] text-xs flex-1">
                  {config.services.email}
                </span>
              </div>

            </div>

            </div>
            </motion.div>
          </div>
        </div>

        {/* Values, Why Choose Us, Team, and Partnerships - Restent identiques à votre code original */}
        <div className="mb-24 lg:mb-48">
          <div className="text-center space-y-3 mb-12 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="group p-6 sm:p-8 rounded-3xl border border-gray-100 transition-all duration-500 ease-out transform hover:-rotate-1 hover:-translate-y-3 hover:border-[#443C34] hover:bg-white flex flex-col items-start text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 bg-white shadow-sm transition-all group-hover:bg-[#F5E6D3]">
                  <div className="text-[#443C34]">{value.icon}</div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 transition-colors group-hover:text-[#443C34]">{value.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-24 lg:mb-48">
          <div className="text-center space-y-3 mb-12 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Why Choose Sirius Expedition ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="group p-6 sm:p-8 rounded-3xl border border-gray-100 bg-gray-50 transition-all duration-500 ease-out transform hover:-rotate-1 hover:-translate-y-3 hover:border-[#443C34] hover:shadow-2xl hover:bg-white flex flex-col items-start text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 bg-white shadow-sm transition-all group-hover:bg-[#F5E6D3]">
                  <div className="text-[#443C34]">{item.icon}</div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 transition-colors group-hover:text-[#443C34]">{item.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}