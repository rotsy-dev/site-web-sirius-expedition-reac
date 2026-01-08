import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Clock, Scale, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
    const { lang = 'en' } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const snap = await getDoc(doc(db, 'terms_conditions', lang));
            if (snap.exists()) setData(snap.data());
            setLoading(false);
            window.scrollTo(0, 0);
        };
        fetchData();
    }, [lang]);

    if (loading) return <div className="h-screen flex items-center justify-center">Chargement...</div>;
    if (!data) return <div className="h-screen flex items-center justify-center">Contenu non trouvé.</div>;

    return (
        <div className="bg-white min-h-screen">
            {/* Header Style Travelia */}
            <header className="bg-[#FAF7F2] py-24 px-6 border-b border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#443C34] mb-6">{data.title}</h1>
                    <p className="text-[#443C34]/60 text-lg max-w-2xl mx-auto mb-10">{data.heroSubtitle}</p>
                    
                    {/* Infos de version style Travelia */}
                    <div className="flex flex-wrap justify-center gap-6 text-[#443C34]/50 text-sm">
                        <div className="flex items-center gap-2"><Clock size={16}/> Updated: {data.lastUpdated}</div>
                        <div className="flex items-center gap-2"><Scale size={16}/> Jurisdiction: {data.jurisdiction}</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={16}/> Version: {data.version}</div>
                    </div>
                </div>
            </header>

            {/* Contenu Principal */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="space-y-20">
                    {data.sections?.map((section: any, index: number) => (
                        <div key={section.id} className="flex flex-col md:flex-row gap-6 md:gap-12 group">
                            {/* Le Numéro (Rond beige) */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-[#F5EFE6] text-[#443C34] flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-[#443C34] group-hover:text-white transition-all duration-300">
                                    {section.title || index + 1}
                                </div>
                            </div>

                            {/* Le Texte Rich Text */}
                            <div className="flex-1">
                                <div 
                                    className="prose prose-stone max-w-none 
                                    prose-h2:text-2xl prose-h2:font-bold prose-h2:text-[#443C34] prose-h2:mb-4 prose-h2:mt-0
                                    prose-h3:text-xl prose-h3:font-bold prose-h3:text-[#443C34]/90 prose-h3:mt-6
                                    prose-p:text-[#443C34]/75 prose-p:leading-relaxed prose-p:text-lg
                                    prose-li:text-[#443C34]/75 prose-li:my-1
                                    prose-strong:text-[#443C34] prose-strong:font-bold"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer de contact Légal */}
                {/* <div className="mt-32 p-12 bg-[#FAF7F2] rounded-[3rem] text-center border border-[#F5EFE6]">
                    <h3 className="text-2xl font-bold text-[#443C34] mb-4">Questions about our terms?</h3>
                    <p className="text-[#443C34]/60 mb-8">Contact our legal team for any clarification regarding your booking.</p>
                    <a href={`mailto:${data.contactEmail}`} className="inline-block px-8 py-4 bg-[#443C34] text-white rounded-2xl font-bold hover:bg-black transition-colors">
                        Contact Support
                    </a>
                </div> */}
            </main>
        </div>
    );
}