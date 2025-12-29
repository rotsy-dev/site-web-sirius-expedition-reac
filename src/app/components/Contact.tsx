import * as React from 'react';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Youtube, CheckCircle, AlertCircle, Calendar, Users, Briefcase, Clock, Building } from 'lucide-react';
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface TourDate {
  id: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
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
    };
    services: {
      hosting: string[];
      domain: string;
      email: string;
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

// ⚠️ REMPLACEZ CES VALEURS PAR VOS VRAIES CLÉS EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',
  TEMPLATE_ID: 'template_watmwp8',
  PUBLIC_KEY: 'zjVFV2WfPtjKiu0g-',
};

export function Contact({ config }: ContactProps) {
  const [formData, setFormData] = useState<ExtendedContactFormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    interestedTour: '',
    travelDate: '',
    travelTime: '',
    participants: '',
    contactInfo: '',
    physicalAddress: '',
    alternatePhone: '',
    professionalEmail: '',
    preferredHours: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // États pour les données dynamiques depuis Firebase
  const [tours, setTours] = useState<Tour[]>([]);
  const [preferredHours, setPreferredHours] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<TourDate[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  // Charger les tours et préférences depuis Firebase (siteConfig)
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      try {
        const configDoc = doc(db, 'siteConfig', 'main');
        const docSnap = await getDoc(configDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Charger les tours
          if (data.tours && Array.isArray(data.tours)) {
            setTours(data.tours);
          }
          
          // Charger les heures de contact préférées (si configurées dans l'éditeur)
          // Si non définies, utiliser les valeurs par défaut
          if (data.preferredContactHours && Array.isArray(data.preferredContactHours)) {
            setPreferredHours(data.preferredContactHours);
          } else {
            // Valeurs par défaut si non configurées dans l'éditeur
            setPreferredHours([
              '08:00 - 10:00',
              '10:00 - 12:00',
              '14:00 - 16:00',
              '16:00 - 18:00',
              'Flexible'
            ]);
          }
        }
      } catch (err) {
        console.error('Erreur chargement configuration:', err);
        // Valeurs par défaut en cas d'erreur
        setPreferredHours([
          '08:00 - 10:00',
          '10:00 - 12:00',
          '14:00 - 16:00',
          '16:00 - 18:00',
          'Flexible'
        ]);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  // Mettre à jour les dates disponibles quand un tour est sélectionné
  useEffect(() => {
    if (formData.interestedTour) {
      const selectedTour = tours.find(tour => tour.id === formData.interestedTour);
      if (selectedTour && selectedTour.dates) {
        // Filtrer les dates valides (avec date et heure)
        const validDates = selectedTour.dates.filter(date => 
          date.date && date.time && date.date.trim() !== '' && date.time.trim() !== ''
        );
        setAvailableDates(validDates);
        // Réinitialiser la date et l'heure si le tour change
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
      // Récupérer le nom du tour sélectionné pour l'email
      const selectedTour = tours.find(t => t.id === formData.interestedTour);
      const tourName = selectedTour ? selectedTour.name : 'Not specified';
      
      // Récupérer la date et heure formatées
      let travelDateTime = 'Not specified';
      if (formData.travelDate && formData.travelTime) {
        const selectedDate = availableDates.find(date => 
          date.id === `${formData.travelDate}_${formData.travelTime}`
        );
        if (selectedDate) {
          const dateFormatted = new Date(selectedDate.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          travelDateTime = `${dateFormatted} at ${selectedDate.time}`;
        }
      }

      // Préparer les données pour EmailJS
      const templateParams = {
        to_email: config.contact.email,
        name: formData.name,
        reply_to: formData.email,
        phone: formData.phone,
        country: formData.country,
        message: formData.message,
        time: new Date().toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        // Champs optionnels
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

      // Envoyer l'email via EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('Email sent successfully!', response.status, response.text);

      setSubmitted(true);

      // Réinitialiser le formulaire après 3 secondes
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
      setErrors([
        'Failed to send message. Please try again or contact us directly at ' + config.contact.email
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
  };

  // Handler pour la sélection de date
  const handleDateSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      const [dateId, timeId] = value.split('_');
      const selectedDate = availableDates.find(date => date.id === `${dateId}_${timeId}`);
      
      if (selectedDate) {
        setFormData(prev => ({
          ...prev,
          travelDate: dateId,
          travelTime: timeId
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        travelDate: '',
        travelTime: ''
      }));
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
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
        {/* Contact Form - 3 colonnes */}
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

          <div className="space-y-6">
            {/* Affichage des erreurs */}
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive mb-1">Validation errors:</p>
                  <ul className="text-sm text-destructive/80 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Section Obligatoire */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-foreground">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="+261 34 00 000 00"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block mb-2 text-sm font-medium text-foreground">
                    Country <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all text-foreground"
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-foreground">
                  Your Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-primary focus:outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                  placeholder="Tell us about your dream Madagascar adventure..."
                />
              </div>
            </div>

            {/* Toggle pour champs optionnels */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2 transition-colors"
              >
                {showOptionalFields ? '▼' : '▶'} Additional Information (optional)
              </button>
            </div>

            {/* Section Optionnelle */}
            {showOptionalFields && (
              <div className="space-y-6 pt-4 border-t-2 border-muted">
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="bg-accent text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                  Additional Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="interestedTour" className="block mb-2 text-sm font-medium text-foreground flex items-center gap-2">
                      <Briefcase size={16} className="text-accent" />
                      Interested Tour
                    </label>
                    {isLoadingConfig ? (
                      <div className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent text-muted-foreground flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        Loading tours...
                      </div>
                    ) : tours.length === 0 ? (
                      <div className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent text-muted-foreground">
                        No tours available at the moment.
                      </div>
                    ) : (
                      <select
                        id="interestedTour"
                        name="interestedTour"
                        value={formData.interestedTour}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-accent focus:outline-none transition-all text-foreground"
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
                      <p className="mt-2 text-xs text-muted-foreground">
                        {tours.find(t => t.id === formData.interestedTour)?.description}
                      </p>
                    )}
                  </div>

                  {/* Sélection de la Date et Heure - Maintenant visible */}
                  {formData.interestedTour && (
                    <div>
                      <label htmlFor="travelDate" className="block mb-2 text-sm font-medium text-foreground flex items-center gap-2">
                        <Calendar size={16} className="text-accent" />
                        Preferred Travel Date & Time
                      </label>
                      {availableDates.length === 0 ? (
                        <div className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent text-muted-foreground">
                          No dates available for this tour
                        </div>
                      ) : (
                        <select
                          id="travelDate"
                          value={formData.travelDate && formData.travelTime ? `${formData.travelDate}_${formData.travelTime}` : ''}
                          onChange={handleDateSelection}
                          className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-accent focus:outline-none transition-all text-foreground"
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
                      <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} />
                        Select the departure date and time for your tour
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="participants" className="block mb-2 text-sm font-medium text-foreground flex items-center gap-2">
                      <Users size={16} className="text-accent" />
                      Number of Participants
                    </label>
                    <input
                      type="number"
                      id="participants"
                      name="participants"
                      value={formData.participants}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-accent focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="2"
                    />
                  </div>

                </div>

                <div>
                  <label htmlFor="physicalAddress" className="block mb-2 text-sm font-medium text-foreground flex items-center gap-2">
                    <Building size={16} className="text-accent" />
                    Physical Address
                  </label>
                  <input
                    type="text"
                    id="physicalAddress"
                    name="physicalAddress"
                    value={formData.physicalAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-accent focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    placeholder="123 Example Street, Paris"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="alternatePhone" className="block mb-2 text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone size={16} className="text-accent" />
                      Alternate Phone Number
                    </label>
                    <input
                      type="tel"
                      id="alternatePhone"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-accent focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="+33 6 00 00 00 00"
                    />
                  </div>

                  <div>
                    <label htmlFor="professionalEmail" className="block mb-2 text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail size={16} className="text-accent" />
                      Professional Email
                    </label>
                    <input
                      type="email"
                      id="professionalEmail"
                      name="professionalEmail"
                      value={formData.professionalEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-accent focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactInfo" className="block mb-2 text-sm font-medium text-foreground">
                    Additional Contact Information
                  </label>
                  <textarea
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-2 border-transparent focus:border-accent focus:outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
                    placeholder="Any other useful information..."
                  />
                </div>
              </div>
            )}

            {/* Bouton Submit */}
            <motion.button
              whileHover={{ scale: submitted || isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: submitted || isSubmitting ? 1 : 0.98 }}
              onClick={handleSubmit}
              disabled={submitted || isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitted ? (
                <>
                  <CheckCircle size={20} />
                  Message sent successfully!
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Contact Information - 2 colonnes */}
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
                <stepan className="text-sm font-medium">Facebook</stepan>
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