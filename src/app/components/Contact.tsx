import * as React from 'react';
import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Youtube, CheckCircle, AlertCircle } from 'lucide-react';
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
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header simple */}
        <div className="text-center mb-16 sm:mb-20 mt-20">
          {/* Badge simple */}
          <div className="mb-6">
            <span className="text-xl text-[#443C34] dark:text-gray-400 font-semibold border-2 border-[#443C34] px-6 py-3 rounded-full">
              Get In Touch
            </span>
          </div>

          {/* Titre principal */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#443C34] dark:text-white leading-tight">
            Contact Us
          </h2>

          {/* Sous-titre */}
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get in touch with us to plan your Madagascar adventure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form - Left Side */}
          <div className="bg-white p-8 md:p-10 rounded-3xl">
            <h3 className="text-4xl font-bold mb-2 text-[#443C34]">Send Us a Message</h3>
            <p className="text-gray-600 mb-8">
              We'll get back to you within 24 hours
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Affichage des erreurs globales */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-600 mb-1">Erreurs de validation :</p>
                    <ul className="text-sm text-red-500 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.some(e => e.toLowerCase().includes('nom'))}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#443C34] focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.some(e => e.toLowerCase().includes('email'))}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#443C34] focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#443C34] focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  placeholder="Subject"
                />
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={errors.some(e => e.toLowerCase().includes('message'))}
                  rows={6}
                  maxLength={140}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#443C34] focus:outline-none transition-all resize-none text-gray-800 placeholder:text-gray-400"
                  placeholder="Your Message"
                />
                <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                  {formData.message.length}/140
                </div>
              </div>

              <button
                type="submit"
                disabled={submitted || isSubmitting}
                aria-busy={isSubmitting}
                className="w-full bg-[#443C34] hover:bg-[#5a4f45] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitted ? (
                  <>
                    <CheckCircle size={20} />
                    {MESSAGES.SUCCESS.MESSAGE_SENT}
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer votre message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information - Right Side */}
          <div className="space-y-8">
            {/* Contacts Section */}
            <div>
              <h3 className="text-3xl font-bold mb-6 text-[#443C34]">Contacts</h3>
              <div className="space-y-4">
                <a
                  href={`tel:${config.contact.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#443C34] transition-colors"
                >
                  <Phone size={20} className="flex-shrink-0" />
                  <span className="text-lg">{config.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#443C34] transition-colors"
                >
                  <Mail size={20} className="flex-shrink-0" />
                  <span className="text-lg">{config.contact.email}</span>
                </a>
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-3xl font-bold mb-6 text-[#443C34]">Social Media</h3>
              <div className="flex gap-4">
                <a
                  href={config.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={config.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              </div>

              {/* Address */}
              <div className="mt-8 flex items-start gap-3 text-gray-700">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span className="text-lg">{config.contact.address}</span>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Professional Services Section */}
            <div className="bg-[#F5E6D3] p-6 rounded-2xl">
              <h4 className="font-bold text-lg mb-4 text-[#443C34]">
                Professional Services
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Hosting: {config.services.hosting.join(' & ')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Domain: {config.services.domain}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>Email: {config.services.email}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}