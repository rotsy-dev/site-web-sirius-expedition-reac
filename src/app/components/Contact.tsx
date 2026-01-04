import * as React from 'react';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Youtube, CheckCircle, AlertCircle, Calendar, Users, Briefcase, Clock, Building, Linkedin, CheckSquare, Check, Instagram, Twitter } from 'lucide-react';
import { motion } from "framer-motion";
import ScrollReveal from 'scrollreveal';
import emailjs from '@emailjs/browser';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface TourDate {
  id: string;
  date: string;
  time: string;
}

interface Tour {
  id: string;
  name: string;
  description: string;
  dates: TourDate[];
}

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
      instagram: string;
      twitter: string;
      linkedin: string;
      pinterest: string;
      tiktok: string;
    };
    services: {
      hosting: string[];
      domain: string;
      email: string;
    };
  };
  content?: {
    pageHeaders?: {
      contact?: {
        badge?: string;
        title?: string;
        subtitle?: string;
      };
    };
  };
}

interface ExtendedContactFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  interestedTour?: string;
  travelDate?: string;
  travelTime?: string;
  participants?: string;
  contactInfo?: string;
  physicalAddress?: string;
  alternatePhone?: string;
  professionalEmail?: string;
  preferredHours?: string;
}

const COUNTRIES = [
  'Madagascar', 'France', 'United States', 'Canada', 'United Kingdom',
  'Germany', 'Italy', 'Spain', 'Belgium', 'Switzerland', 'Other'
];

const HERO_IMAGE = "https://images.unsplash.com/photo-1763477080227-6e591f5017ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWRhZ2FzY2FyJTIwbGFuZHNjYXBlJTIwYWR2ZW50dXJlfGVufDF8fHx8MTc2NDU5MTg4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',
  TEMPLATE_ID: 'template_watmwp8',
  PUBLIC_KEY: 'zjVFV2WfPtjKiu0g-',
};

export function Contact({ config, content = {} }: ContactProps) {
  const [formData, setFormData] = useState<ExtendedContactFormData>({
    name: '', email: '', phone: '', country: '', message: '',
    interestedTour: '', travelDate: '', travelTime: '', participants: '', contactInfo: '',
    physicalAddress: '', alternatePhone: '', professionalEmail: '', preferredHours: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [preferredHours, setPreferredHours] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<TourDate[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      try {
        const configDoc = doc(db, 'siteConfig', 'main');
        const docSnap = await getDoc(configDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.tours && Array.isArray(data.tours)) {
            setTours(data.tours);
          }
          if (data.preferredContactHours && Array.isArray(data.preferredContactHours)) {
            setPreferredHours(data.preferredContactHours);
          } else {
            setPreferredHours(['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00', 'Flexible']);
          }
        }
      } catch (err) {
        console.error('Erreur chargement configuration:', err);
        setPreferredHours(['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00', 'Flexible']);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    fetchConfig();

    if (typeof ScrollReveal !== 'undefined') {
      const sr = ScrollReveal({
        reset: false, distance: '40px', duration: 800, delay: 0,
        easing: 'cubic-bezier(0.5, 0, 0, 1)', mobile: true
      });
      sr.reveal('.reveal-left', { origin: 'left', distance: '60px', delay: 200 });
      sr.reveal('.reveal-right', { origin: 'right', distance: '60px', delay: 400 });
    }
  }, []);

  useEffect(() => {
    if (formData.interestedTour) {
      const selectedTour = tours.find(tour => tour.id === formData.interestedTour);
      if (selectedTour && selectedTour.dates) {
        const validDates = selectedTour.dates.filter(date =>
          date.date && date.time && date.date.trim() !== '' && date.time.trim() !== ''
        );
        setAvailableDates(validDates);
        setFormData(prev => ({ ...prev, travelDate: '', travelTime: '' }));
      } else {
        setAvailableDates([]);
      }
    } else {
      setAvailableDates([]);
    }
  }, [formData.interestedTour, tours]);

  const validateForm = (): string[] => {
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push('Full name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('Email is not valid');
    }
    if (!formData.phone.trim()) newErrors.push('Phone number is required');
    if (!formData.country) newErrors.push('Country is required');
    if (!formData.message.trim()) newErrors.push('Message is required');
    return newErrors;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedTour = tours.find(t => t.id === formData.interestedTour);
      const tourName = selectedTour ? selectedTour.name : 'Not specified';

      let travelDateTime = 'Not specified';
      if (formData.travelDate && formData.travelTime) {
        const selectedDate = availableDates.find(date =>
          date.id === `${formData.travelDate}_${formData.travelTime}`
        );
        if (selectedDate) {
          const dateFormatted = new Date(selectedDate.date).toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
          });
          travelDateTime = `${dateFormatted} at ${selectedDate.time}`;
        }
      }

      const templateParams = {
        to_email: config.contact.email,
        name: formData.name,
        reply_to: formData.email,
        phone: formData.phone,
        country: formData.country,
        message: formData.message,
        time: new Date().toLocaleString('fr-FR', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        interested_tour: tourName,
        tour_id: formData.interestedTour || 'Not specified',
        travel_date_time: travelDateTime,
        participants: formData.participants || 'Not specified',
        preferred_hours: formData.preferredHours || 'Not specified',
        physical_address: formData.physicalAddress || 'Not specified',
        alternate_phone: formData.alternatePhone || 'Not specified',
        professional_email: formData.professionalEmail || 'Not specified',
        additional_info: formData.contactInfo || 'None',
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('Email sent successfully!', response.status, response.text);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '', email: '', phone: '', country: '', message: '',
          interestedTour: '', travelDate: '', travelTime: '', participants: '', contactInfo: '',
          physicalAddress: '', alternatePhone: '', professionalEmail: '', preferredHours: ''
        });
        setShowOptionalFields(false);
      }, 3000);

    } catch (error: any) {
      console.error('Email sending failed:', error);
      setErrors(['Failed to send message. Please try again or contact us directly at ' + config.contact.email]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleDateSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      const [dateId, timeId] = value.split('_');
      const selectedDate = availableDates.find(date => date.id === `${dateId}_${timeId}`);
      if (selectedDate) {
        setFormData(prev => ({ ...prev, travelDate: dateId, travelTime: timeId }));
      }
    } else {
      setFormData(prev => ({ ...prev, travelDate: '', travelTime: '' }));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
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
            alt="Contact Sirius Expedition"
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
              {content?.pageHeaders?.contact?.badge || 'CONTACT US'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight"
          >
            {content?.pageHeaders?.contact?.title || 'Get In Touch'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {content?.pageHeaders?.contact?.subtitle || 'We are here to assist you with any inquiries or bookings'}
          </motion.p>
        </div>
      </section>

      {/* Main Content Section - Thème Mocha & Vanilla */}
      <section className="py-20 px-4 sm:px-10 lg:px-20 bg-[#F0E7D5]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Contact Form - Thème Mocha & Vanilla */}
          <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-3xl border-4 border-[#D4A574] shadow-2xl reveal-left">
            <h3 className="text-4xl font-bold mb-2 text-[#443C34]">Send Us a Message</h3>
            <p className="text-[#8B7355] mb-8 font-medium">
              We'll get back to you within 24 hours
            </p>

            <div className="space-y-6">
              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-600 mb-1">Validation errors:</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-bold text-[#443C34]">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-bold text-[#443C34]">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-bold text-[#443C34]">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder="+261 34 00 000 00"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block mb-2 text-sm font-bold text-[#443C34]">
                      Country <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34]"
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-bold text-[#443C34]">
                    Your Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all resize-none text-[#443C34] placeholder:text-[#8B7355]/50"
                    placeholder="Tell us about your dream Madagascar adventure..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="text-[#443C34] hover:text-[#8B7355] font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  {showOptionalFields ? '▼' : '▶'} Additional Information (optional)
                </button>
              </div>

              {showOptionalFields && (
                <div className="space-y-6 pt-4 border-t-2 border-[#D4A574]/20">
                  <h4 className="text-lg font-bold text-[#443C34] flex items-center gap-2">
                    <span className="bg-[#D4A574] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                    Additional Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="interestedTour" className="block mb-2 text-sm font-bold text-[#443C34] flex items-center gap-2">
                        <Briefcase size={16} className="text-[#D4A574]" />
                        Interested Tour
                      </label>
                      {isLoadingConfig ? (
                        <div className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 text-[#8B7355] flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin" />
                          Loading tours...
                        </div>
                      ) : tours.length === 0 ? (
                        <div className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 text-[#8B7355]">
                          No tours available at the moment.
                        </div>
                      ) : (
                        <select
                          id="interestedTour"
                          name="interestedTour"
                          value={formData.interestedTour}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34]"
                        >
                          <option value="">Select a tour</option>
                          {tours.map(tour => (
                            <option key={tour.id} value={tour.id}>
                              {tour.name}
                              {tour.dates && tour.dates.length > 0 && ` (${tour.dates.length} dates available)`}
                            </option>
                          ))}
                        </select>
                      )}
                      {formData.interestedTour && (
                        <p className="mt-2 text-xs text-[#8B7355]">
                          {tours.find(t => t.id === formData.interestedTour)?.description}
                        </p>
                      )}
                    </div>

                    {formData.interestedTour && (
                      <div>
                        <label htmlFor="travelDate" className="block mb-2 text-sm font-bold text-[#443C34] flex items-center gap-2">
                          <Calendar size={16} className="text-[#D4A574]" />
                          Preferred Travel Date & Time
                        </label>
                        {availableDates.length === 0 ? (
                          <div className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 text-[#8B7355]">
                            No dates available for this tour
                          </div>
                        ) : (
                          <select
                            id="travelDate"
                            value={formData.travelDate && formData.travelTime ? `${formData.travelDate}_${formData.travelTime}` : ''}
                            onChange={handleDateSelection}
                            className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34]"
                          >
                            <option value="">Select a date and time</option>
                            {availableDates
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              .map(dateObj => {
                                const displayDate = formatDate(dateObj.date);
                                return (
                                  <option key={dateObj.id} value={dateObj.id}>
                                    {displayDate} at {dateObj.time}
                                  </option>
                                );
                              })}
                          </select>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="participants" className="block mb-2 text-sm font-bold text-[#443C34] flex items-center gap-2">
                        <Users size={16} className="text-[#D4A574]" />
                        Number of Participants
                      </label>
                      <input
                        type="number"
                        id="participants"
                        name="participants"
                        value={formData.participants}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                        placeholder="2"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="physicalAddress" className="block mb-2 text-sm font-bold text-[#443C34] flex items-center gap-2">
                      <Building size={16} className="text-[#D4A574]" />
                      Physical Address
                    </label>
                    <input
                      type="text"
                      id="physicalAddress"
                      name="physicalAddress"
                      value={formData.physicalAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder="123 Example Street, Paris"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="alternatePhone" className="block mb-2 text-sm font-bold text-[#443C34] flex items-center gap-2">
                        <Phone size={16} className="text-[#D4A574]" />
                        Alternate Phone Number
                      </label>
                      <input
                        type="tel"
                        id="alternatePhone"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                        placeholder="+33 6 00 00 00 00"
                      />
                    </div>

                    <div>
                      <label htmlFor="professionalEmail" className="block mb-2 text-sm font-bold text-[#443C34] flex items-center gap-2">
                        <Mail size={16} className="text-[#D4A574]" />
                        Professional Email
                      </label>
                      <input
                        type="email"
                        id="professionalEmail"
                        name="professionalEmail"
                        value={formData.professionalEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all text-[#443C34] placeholder:text-[#8B7355]/50"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactInfo" className="block mb-2 text-sm font-bold text-[#443C34]">
                      Additional Contact Information
                    </label>
                    <textarea
                      id="contactInfo"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F5F0] border-2 border-[#D4A574]/30 focus:border-[#443C34] focus:outline-none transition-all resize-none text-[#443C34] placeholder:text-[#8B7355]/50"
                      placeholder="Any other useful information..."
                    />
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: submitted || isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: submitted || isSubmitting ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={submitted || isSubmitting}
                className="w-full bg-[#443C34] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-[#332C26] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-8 shadow-lg hover:shadow-2xl"
              >
                {submitted ? (
                  <>
                    <CheckCircle size={20} />
                    Message sent successfully!
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Your Message
                    <Send size={20} />
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Contact Information - Thème Mocha plus léger */}
          <div className="lg:col-span-2 reveal-right">
            {/* Contacts Section */}
            <div className="mb-10">
              <h3 className="text-3xl font-bold mb-6 text-[#443C34]">Contacts</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-[#443C34] rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:bg-[#8B7355] transition-all">
                    <Phone size={18} />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-[#443C34] font-medium text-base">
                    <a href={`tel:${config.contact.phone}`} className="hover:text-[#8B7355] transition-colors">
                      {config.contact.phone}
                    </a>
                    <span className="hidden sm:inline text-[#D4A574]">|</span>
                    <a href={`tel:${config.contact.phone}`} className="hover:text-[#8B7355] transition-colors">
                      {config.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-[#443C34] rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:bg-[#8B7355] transition-all">
                    <Mail size={18} />
                  </div>
                  <a href={`mailto:${config.contact.email}`} className="text-[#443C34] font-medium text-base hover:text-[#8B7355] transition-colors">
                    {config.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="mb-10">
              <h3 className="text-3xl font-bold mb-6 text-[#443C34]">Social Media</h3>

              <div className="flex gap-3 mb-6">
                <a href="#" className="w-10 h-10 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all">
                  <Phone size={18} />
                </a>
                <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all">
                  <Linkedin size={18} />
                </a>
                <a href={config.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all">
                  <Youtube size={18} />
                </a>
                {/* // Instagram */}
                <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all">
                  <Instagram size={18} />
                </a>
                {/* // Twitter */}
                {config.social.twitter && (
                  <a href={config.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all">
                    <Twitter size={18} />
                  </a>
                )}

                {/* Pinterest - SVG personnalisé */}
                {config.social.pinterest && (
                  <a href={config.social.pinterest} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}

                {/* TikTok - SVG personnalisé */}
                {config.social.tiktok && (
                  <a href={config.social.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                )}
              </div>

            </div>

            {/* Map Section */}
            <div className="mb-10">
              <h3 className="text-3xl font-bold mb-6 text-[#443C34]">Our Location</h3>
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4A574] shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.2158729582705!2d47.52166931490035!3d-18.91368598716587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07e3e7f4f5c5d%3A0x4e9d6b8f5a5c5c5c!2sAntananarivo%2C%20Madagascar!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <div className="w-6 h-6 border-2 border-[#443C34] rounded-full flex items-center justify-center text-[#443C34] flex-shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                <span className="text-[#443C34] font-medium text-base leading-relaxed">{config.contact.address}</span>
              </div>
            </div>

            {/* Professional Services Box - Plus léger */}
            <div className="bg-gradient-to-br from-[#F8F5F0] to-white rounded-2xl p-6 border-2 border-[#D4A574]/30 shadow-md">
              <h4 className="text-xl text-[#443C34] mb-4 font-bold">
                Professional Services
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="bg-[#D4A574] rounded-lg text-white p-1 shadow-sm">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[#443C34] font-medium text-sm">Hosting: {config.services.hosting.join(' & ')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#D4A574] rounded-lg text-white p-1 shadow-sm">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[#443C34] font-medium text-sm">Domain: {config.services.domain}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#D4A574] rounded-lg text-white p-1 shadow-sm">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[#443C34] font-medium text-sm">Email: {config.services.email}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}