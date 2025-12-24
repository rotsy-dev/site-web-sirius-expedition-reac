import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Phone, MapPin, Sparkles, Zap, Star, CheckCircle } from 'lucide-react';

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section className="py-28 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ultra-sophistiqué (Identique aux Tours) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

      {/* Grille animée */}
      <motion.div
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* Gradients flottants massifs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.2, 0.15], x: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header spectaculaire */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-8"
          >
            <div className="relative group/badge">
              <motion.div
                animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 bg-gradient-to-r from-accent via-primary to-accent rounded-full blur-2xl opacity-40"
              />
              <div className="relative bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 dark:from-purple-950 dark:via-blue-950 dark:to-purple-950 px-8 py-4 rounded-full border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl backdrop-blur-xl">
                <span className="relative text-purple-900 dark:text-purple-100 font-black text-sm tracking-widest uppercase flex items-center gap-3">
                  <Sparkles size={18} className="text-purple-600 fill-purple-600" />
                  Get In Touch
                  <Zap size={18} className="text-purple-600 fill-purple-600" />
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h2 className="text-5xl md:text-8xl mb-8 font-black leading-[0.9] tracking-tighter">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent block">PLAN YOUR</span>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent block">MASTERPIECE</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Infos de contact style "Cards" */}
          <div className="lg:col-span-4 space-y-6">
            {[
              { icon: <Mail />, label: "Email Us", val: "contact@luxurytours.mg" },
              { icon: <Phone />, label: "Call Us", val: "+261 34 00 000 00" },
              { icon: <MapPin />, label: "Visit Us", val: "Antananarivo, Madagascar" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-200/50 dark:border-gray-800/50 hover:border-primary/50 transition-all shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{item.val}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Le Formulaire (Style CTA de ta section Tours) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 relative group"
          >
            {/* Glow massif derrière le formulaire */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[3rem] border border-gray-200/50 dark:border-gray-800/50 shadow-2xl overflow-hidden p-8 md:p-12">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form 
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest ml-2">Your Name</label>
                        <input required className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-gray-800 rounded-2xl py-5 px-6 outline-none transition-all font-medium" placeholder="John Doe" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest ml-2">Your Email</label>
                        <input required type="email" className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-gray-800 rounded-2xl py-5 px-6 outline-none transition-all font-medium" placeholder="john@example.com" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest ml-2">Describe your dream journey</label>
                      <textarea required rows={4} className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-gray-800 rounded-[2rem] py-5 px-6 outline-none transition-all font-medium resize-none" placeholder="Tell us everything..." />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full group/btn relative py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-[0.4em] text-sm overflow-hidden shadow-2xl"
                    >
                      {/* Shine Effect */}
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 dark:via-black/5 to-transparent skew-x-12"
                      />
                      <span className="relative z-10 flex items-center justify-center gap-4">
                        {isSubmitting ? "Processing..." : "Commence the Journey"} 
                        {!isSubmitting && <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />}
                      </span>
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary to-accent rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-12">
                      <CheckCircle size={48} className="text-white" />
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter">MESSAGE RECEIVED</h3>
                    <p className="text-muted-foreground text-xl max-w-sm mx-auto">Our travel architects are already reviewing your request.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}