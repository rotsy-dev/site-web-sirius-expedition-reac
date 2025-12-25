import * as React from 'react';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Youtube, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from "framer-motion";
import { validateContactForm, type ContactFormData } from '../../utils/validation';
import { MESSAGES } from '../../constants';

interface ContactProps {
  config: {
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    social: {
      facebook: string;
      youtube: string;
      tripadvisor: string;
      google: string;
    };
    services: {
      hosting: string[];
      domain: string;
      email: string;
    };
  };
}

export function Contact({ config }: ContactProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    // Validation
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Simulation d'envoi (à remplacer par un vrai appel API)
    try {
      // Ici vous ajouteriez votre logique d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors([]);
      }, 3000);
    } catch (error) {
      setErrors([MESSAGES.ERROR.SAVE_FAILED]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Effacer les erreurs quand l'utilisateur tape
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
          💬 Get In Touch
        </span>
        <h2 className="text-4xl md:text-5xl mb-4 text-primary font-bold">
          Contact Us
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Get in touch with us to plan your Madagascar adventure
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3 bg-card p-8 md:p-10 rounded-3xl shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-2">Send Us a Message</h3>
          <p className="text-muted-foreground mb-8">
            We'll get back to you within 24 hours
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Affichage des erreurs globales */}
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive mb-1">Erreurs de validation :</p>
                  <ul className="text-sm text-destructive/80 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.some(e => e.toLowerCase().includes('nom'))}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-foreground">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.some(e => e.toLowerCase().includes('email'))}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-foreground">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                aria-invalid={errors.some(e => e.toLowerCase().includes('téléphone'))}
                className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                placeholder="+261 34 00 000 00"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-foreground">
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={errors.some(e => e.toLowerCase().includes('message'))}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                placeholder="Tell us about your dream Madagascar adventure..."
              />
            </div>

            <motion.button
              whileHover={{ scale: submitted || isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: submitted || isSubmitting ? 1 : 0.98 }}
              type="submit"
              disabled={submitted || isSubmitting}
              aria-busy={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitted ? (
                <>
                  <CheckCircle size={20} />
                  {MESSAGES.SUCCESS.MESSAGE_SENT}
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Contact Cards */}
          <div className="bg-card p-6 rounded-2xl shadow-lg">
            <h4 className="font-bold text-lg mb-4">Contact Information</h4>
            <div className="space-y-4">
              <motion.a
                href={`mailto:${config.contact.email}`}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground">{config.contact.email}</p>
                </div>
              </motion.a>

              <motion.a
                href={`tel:${config.contact.phone}`}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-primary-foreground transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium text-foreground">{config.contact.phone}</p>
                </div>
              </motion.a>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium text-foreground">{config.contact.address}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-2xl shadow-lg text-primary-foreground">
            <h4 className="font-bold text-lg mb-4">Follow Our Journey</h4>
            <div className="grid grid-cols-2 gap-3">
              <motion.a
                href={config.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <Facebook size={20} />
                <span className="text-sm font-medium">Facebook</span>
              </motion.a>

              <motion.a
                href={config.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <Youtube size={20} />
                <span className="text-sm font-medium">YouTube</span>
              </motion.a>

              <motion.a
                href={config.social.tripadvisor}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                  T
                </div>
                <span className="text-sm font-medium">TripAdvisor</span>
              </motion.a>

              <motion.a
                href={config.social.google}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                  G
                </div>
                <span className="text-sm font-medium">Google</span>
              </motion.a>
            </div>
          </div>

          {/* Services Info */}
          <div className="bg-muted/50 p-6 rounded-2xl border border-border">
            <h4 className="font-bold text-sm mb-3 text-muted-foreground">
              Professional Services
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Hosting: {config.services.hosting.join(' & ')}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Domain: {config.services.domain}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Email: {config.services.email}
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}