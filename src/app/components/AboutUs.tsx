import * as React from 'react'
import { Award, Users, Globe, Heart, Shield, Clock, Star, CheckCircle, Leaf, Target, TrendingUp, Headphones, DollarSign, UserCheck } from 'lucide-react';
import { motion } from "framer-motion"

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
   content?: any;
}

export function AboutUs({ config }: AboutUsProps) {
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

  const teamMembers = [
    { initials: 'RJ', name: 'Rakoto Jean', role: 'Founder & Lead Guide' },
    { initials: 'MR', name: 'Marie Rasolofo', role: 'Operations Manager' },
    { initials: 'DA', name: 'David Andriamanana', role: 'Wildlife Expert' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          {/* Badge simple */}
          <div className="mb-6 mt-10 md:mt-20">
            <span className="text-xl text-[#443C34] dark:text-gray-400 font-semibold border-2 border-[#443C34] px-6 py-3 rounded-full">
              About
            </span>
          </div>

          {/* Titre principal */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#443C34] dark:text-white leading-tight">
            About Sirius Expedition
          </h2>

          {/* Sous-titre */}
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your trusted partner for unforgettable Madagascar adventures
          </p>
        </motion.div>

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
              {/* Icon on top */}
              <div className="mb-4 opacity-90">
                {stat.icon}
              </div>
              {/* Number in middle */}
              <h3 className="text-4xl font-bold mb-2">
                {stat.number}
              </h3>
              {/* Label at bottom */}
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Story with Video */}
        <div className="mb-24 lg:mb-48">
          {/* Top Row: Text left, Video right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-12 lg:mb-20 ">
            {/* Left: Story Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-5xl font-bold mb-6 text-[#443C34]">Our Story</h3>
              <p className="text-gray-600 mb-4 text-base leading-relaxed">
                Sirius Expedition was founded with a simple mission: to share the incredible beauty and biodiversity of Madagascar with the world. Named after the brightest star in the night sky, we aim to be your guiding light in exploring this unique island nation.
              </p>
              <p className="text-gray-600 mb-4 text-base leading-relaxed">
                With years of experience and deep local knowledge, we specialize in creating customized tours that showcase Madagascar's endemic wildlife, stunning landscapes, and rich cultural heritage.
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                From the iconic Avenue of the Baobabs to the pristine beaches of Sainte Marie, from lemur encounters to birdwatching expeditions, we ensure every journey is memorable and authentic.
              </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
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
              {/* Testimonial Quote with brown left border */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 border-l-4 border-l-[#443C34]">
                <p className="text-gray-600 italic text-base leading-relaxed">
                  "From the iconic Avenue of the Baobabs to the pristine beaches of Sainte Marie, from lemur encounters to birdwatching expeditions, we ensure every journey is memorable and authentic."
                </p>
              </div>

              {/* Community Card with avatars */}
              <div className="bg-[#F5E6D3] rounded-2xl p-8 flex items-center gap-6">
                {/* Avatars stack */}
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      alt="Avatar 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
                      alt="Avatar 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie"
                      alt="Avatar 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text content */}
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#443C34]">
                      +10,000
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    Rejoins une communauté
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Our Core Values */}
        <div className="mb-24 lg:mb-48">
          {/* Titre */}
          <div className="text-center space-y-3 mb-12 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Our Core Values
            </h2>
          </div>
          {/* Cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="
                  group p-6 sm:p-8 rounded-3xl border border-gray-100 
                  transition-all duration-500 ease-out transform
                  hover:-rotate-1 hover:-translate-y-3 hover:border-[#443C34] hover:bg-white
                  flex flex-col items-start text-left
                "
              >
                {/* Icône */}
                <div
                  className="
                    w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5
                    bg-white shadow-sm transition-all group-hover:bg-[#F5E6D3]
                  "
                >
                  <div className="text-[#443C34]">
                    {value.icon}
                  </div>
                </div>

                {/* Titre */}
                <h3
                  className="
                    text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900
                    transition-colors group-hover:text-[#443C34]
                  "
                >
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24 lg:mb-48">
          {/* Titre */}
          <div className="text-center space-y-3 mb-12 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Why Choose Sirius Expedition ?
            </h2>
          </div>
          {/* Cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="
                  group p-6 sm:p-8 rounded-3xl border border-gray-100 bg-gray-50
                  transition-all duration-500 ease-out transform
                  hover:-rotate-1 hover:-translate-y-3 hover:border-[#443C34] hover:shadow-2xl hover:bg-white
                  flex flex-col items-start text-left
                "
              >
                {/* Icône */}
                <div
                  className="
                    w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5
                    bg-white shadow-sm transition-all group-hover:bg-[#F5E6D3]
                  "
                >
                  <div className="text-[#443C34]">
                    {item.icon}
                  </div>
                </div>

                {/* Titre */}
                <h3
                  className="
                    text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900
                    transition-colors group-hover:text-[#443C34]
                  "
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-semibold text-center mb-12 md:mb-24 text-[#443C34]">Meet Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className={`h-64 flex items-center justify-center text-white text-6xl font-bold ${index === 1 ? 'bg-[#443C34]' : 'bg-[#6D5D4F]'
                  }`}>
                  {member.initials}
                </div>
                <div className="p-6 text-center bg-[#F5E6D3]">
                  <h4 className="text-xl font-bold mb-2 text-[#443C34]">{member.name}</h4>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Partnerships */}
        <div className="mt-16 lg:mt-28">
          <div className=" rounded-3xl p-6 md:p-16 text-center border-4 border-[#443C34]">
            {/* Logo Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-[#443C34] rounded-lg transform -rotate-12"></div>
                <div className="w-16 h-16 bg-[#D4C5B9] rounded-lg absolute top-0 left-4 transform rotate-12"></div>
              </div>
            </div>
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#443C34] mb-6">
              Licensed & Certified
            </h2>
            {/* Description */}
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              {config.siteName} is officially registered with Madagascar Tourism Board and holds all necessary
              certifications for operating tours. We maintain partnerships with local conservation organizations
              and communities.
            </p>
            {/* Service Details */}
            <div className="flex flex-wrap justify-center gap-6 lg:gap-12 mt-12">
              <div className="text-center bg-white p-6 md:px-12 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">Hosted by</p>
                <p className="font-bold text-[#443C34]">{config.services.hosting.join(' & ')}</p>
              </div>
              <div className="text-center bg-white p-6 md:px-16  rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">Domain by</p>
                <p className="font-bold text-[#443C34]">{config.services.domain}</p>
              </div>
              <div className="text-center bg-white p-6 md:px-12 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">Email by</p>
                <p className="font-bold text-[#443C34]">{config.services.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}