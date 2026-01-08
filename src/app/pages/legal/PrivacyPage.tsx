import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { motion } from 'framer-motion';
import { FileLock } from 'lucide-react';

export default function PrivacyPage() {
  const { lang = 'en' } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, 'privacy_policies', lang));
      if (snap.exists()) setData(snap.data());
      setLoading(false);
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [lang]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="h-screen flex items-center justify-center">Privacy Policy not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Header Style Travelia */}
      <header className="bg-[#FAF7F2] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex p-4 bg-white rounded-2xl shadow-sm text-blue-600 mb-8">
            <FileLock size={32} />
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-extrabold text-[#443C34] mb-6">
            {data.title}
          </motion.h1>
          <p className="text-[#443C34]/60 text-lg">Last updated: {data.lastUpdated}</p>
        </div>
      </header>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-20">
          {data.sections?.map((section: any) => (
            <motion.section 
              key={section.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              {/* NOUVEAU TITRE PERSONNALISÉ (Remplace l'ancien titre bleu) */}
              {section.subtitle && (
                <h2 className="text-3xl font-bold text-[#443C34] mb-8 flex items-center gap-4">
                  {/* <span className="h-1 w-8 bg-blue-600 rounded-full"></span> */}
                  {section.subtitle}
                </h2>
              )}

              {/* Contenu de l'article */}
              <div 
                className="text-[#443C34]/80 leading-relaxed md:pl-12 prose prose-stone max-w-none
                prose-p:mb-4 prose-strong:text-[#443C34] prose-strong:font-bold"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.section>
          ))}
        </div>

        {/* Note Finale / Contact */}
        {/* <div className="mt-32 p-10 bg-[#FAF7F2] rounded-[2.5rem] border border-gray-100 text-center">
           <h3 className="text-xl font-bold text-[#443C34] mb-4">Questions about your privacy?</h3>
           <p className="text-[#443C34]/60 mb-8">Contact our data protection officer at privacy@traveliasafari.com</p>
           <button className="px-8 py-3 bg-[#443C34] text-white rounded-xl font-bold hover:bg-black transition-colors">
              Contact Support
           </button>
        </div> */}
      </div>
    </div>
  );
}