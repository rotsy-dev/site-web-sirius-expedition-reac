import * as React from 'react'
import { Award, Users, Globe, Heart, Shield, Clock, Star, CheckCircle } from 'lucide-react';
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
}

export function AboutUs({ config }: AboutUsProps) {
  const values = [
    {
      icon: <Award size={40} />,
      title: 'Excellence',
      description: 'We provide top-quality tours with experienced guides and exceptional service',
    },
    {
      icon: <Users size={40} />,
      title: 'Local Expertise',
      description: 'Our team consists of passionate locals who know Madagascar inside out',
    },
    {
      icon: <Globe size={40} />,
      title: 'Sustainability',
      description: 'We practice responsible tourism that protects Madagascar\'s unique environment',
    },
    {
      icon: <Heart size={40} />,
      title: 'Passion',
      description: 'We love what we do and it shows in every tour we organize',
    },
  ];

  const stats = [
    { number: '500+', label: 'Happy Travelers', icon: <Users size={24} /> },
    { number: '50+', label: 'Tour Packages', icon: <Globe size={24} /> },
    { number: '15+', label: 'Years Experience', icon: <Clock size={24} /> },
    { number: '4.9', label: 'Average Rating', icon: <Star size={24} /> },
  ];

  const whyChooseUs = [
    {
      title: 'Expert Local Guides',
      description: 'All our guides are certified professionals with extensive knowledge of Madagascar\'s ecosystems and culture',
    },
    {
      title: 'Customized Itineraries',
      description: 'Every tour is tailored to your interests, budget, and schedule for a unique experience',
    },
    {
      title: 'Small Group Sizes',
      description: 'We keep groups small (max 8 people) for a more personalized and intimate experience',
    },
    {
      title: '24/7 Support',
      description: 'We\'re always available to assist you before, during, and after your trip',
    },
    {
      title: 'Best Price Guarantee',
      description: 'We offer competitive prices without compromising on quality or safety',
    },
    {
      title: 'Safety First',
      description: 'Your safety is our priority with comprehensive insurance and safety protocols',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
          🌟 About Us
        </span>
        <h2 className="text-4xl md:text-5xl mb-4 text-primary font-bold">
          About {config.siteName}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Your trusted partner for unforgettable Madagascar adventures
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-primary to-accent p-6 rounded-2xl text-center shadow-xl"
          >
            <div className="text-primary-foreground mb-2 flex justify-center">
              {stat.icon}
            </div>
            <h3 className="text-4xl font-bold text-primary-foreground mb-2">
              {stat.number}
            </h3>
            <p className="text-primary-foreground/90 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Our Story with Video */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {/* Video YouTube */}
          <div className="rounded-2xl overflow-hidden shadow-2xl mb-6">
            <div className="relative pb-[56.25%] h-0">
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
          <img
            src="https://images.unsplash.com/photo-1677667495307-10e01bd9530f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
            alt="Madagascar landscape"
            className="rounded-2xl shadow-xl w-full h-64 object-cover"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <h3 className="text-3xl font-bold mb-6 text-primary">Our Story</h3>
          <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
            {config.siteName} was founded with a simple mission: to share the incredible beauty and
            biodiversity of Madagascar with the world. Named after the brightest star in the night sky,
            we aim to be your guiding light in exploring this unique island nation.
          </p>
          <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
            With years of experience and deep local knowledge, we specialize in creating customized
            tours that showcase Madagascar's endemic wildlife, stunning landscapes, and rich cultural heritage.
          </p>
          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
            From the iconic Avenue of the Baobabs to the pristine beaches of Sainte Marie, from lemur
            encounters to birdwatching expeditions, we ensure every journey is memorable and authentic.
          </p>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl border-l-4 border-primary">
            <p className="text-lg font-medium text-foreground italic">
              "We believe in sustainable tourism that benefits local communities while preserving
              Madagascar's extraordinary natural heritage for future generations."
            </p>
          </div>
        </motion.div>
      </div>

      {/* Our Values */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="text-3xl font-bold text-center mb-12 text-primary">Our Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-border"
            >
              <div className="inline-block text-primary mb-4 p-4 bg-primary/10 rounded-xl">
                {value.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{value.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-muted/30 p-8 md:p-12 rounded-3xl mb-20"
      >
        <h3 className="text-3xl font-bold mb-8 text-center text-primary">Why Choose {config.siteName}?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex gap-4 bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex-shrink-0">
                <CheckCircle className="text-accent" size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-2 text-foreground">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="text-3xl font-bold text-center mb-12 text-primary">Meet Our Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Rakoto Jean', role: 'Founder & Lead Guide', avatar: 'https://ui-avatars.com/api/?name=Rakoto+Jean&background=6D4C41&color=fff&size=200' },
            { name: 'Marie Rasolofo', role: 'Operations Manager', avatar: 'https://ui-avatars.com/api/?name=Marie+Rasolofo&background=6D4C41&color=fff&size=200' },
            { name: 'David Andriamanana', role: 'Wildlife Expert', avatar: 'https://ui-avatars.com/api/?name=David+Andriamanana&background=6D4C41&color=fff&size=200' },
          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-6 text-center">
                <h4 className="text-xl font-bold mb-2">{member.name}</h4>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Certifications & Partnerships */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary to-accent p-8 md:p-12 rounded-3xl text-center text-primary-foreground"
      >
        <Shield className="mx-auto mb-6" size={64} />
        <h3 className="text-3xl font-bold mb-4">Licensed & Certified</h3>
        <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
          {config.siteName} is officially registered with Madagascar Tourism Board and holds all necessary
          certifications for operating tours. We maintain partnerships with local conservation organizations
          and communities.
        </p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <div className="text-center">
            <p className="text-sm opacity-80">Hosted by</p>
            <p className="font-bold">{config.services.hosting.join(' & ')}</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80">Domain by</p>
            <p className="font-bold">{config.services.domain}</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80">Email by</p>
            <p className="font-bold">{config.services.email}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}