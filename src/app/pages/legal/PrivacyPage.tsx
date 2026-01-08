import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { motion } from 'framer-motion';
import { FileLock, ChevronRight } from 'lucide-react';

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
      <header className="bg-[#FAF7F2] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex p-3 bg-white rounded-2xl shadow-sm text-blue-600 mb-6">
            <FileLock size={32} />
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-bold text-[#443C34] mb-4">
            {data.title}
          </motion.h1>
          <p className="text-[#443C34]/60 text-lg">Last updated: {data.lastUpdated}</p>
        </div>
      </header>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {data.sections?.map((section: any) => (
            <motion.section 
              key={section.id} 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <h2 className="text-xl font-bold text-[#443C34] flex items-center gap-3 mb-4 group-hover:text-blue-600 transition-colors">
                <ChevronRight size={20} className="text-blue-600" />
                {section.title}
              </h2>
              <div 
                className="text-[#443C34]/70 leading-relaxed pl-8 prose prose-blue"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.section>
          ))}
        </div>

        {/* Note Finale */}
        <div className="mt-20 p-10 bg-blue-50 rounded-[2rem] border border-blue-100 text-center">
          <h3 className="font-bold text-blue-900 mb-2">Security & Protection</h3>
          <p className="text-blue-800/70 text-sm">
            We use industry-standard encryption to protect your data. For any GDPR request, contact us.
          </p>
        </div>
      </div>
    </div>
  );
}