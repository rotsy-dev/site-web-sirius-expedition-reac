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
            <header className="bg-[#FAF7F2] py-24 px-6 border-b border-gray-100 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#443C34] mb-6 tracking-tight">{data.title}</h1>
                    <p className="text-[#443C34]/60 text-lg mb-10 leading-relaxed">{data.heroSubtitle}</p>
                    <div className="flex flex-wrap justify-center gap-6 text-[#443C34]/40 text-xs font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2"><Clock size={14}/> Updated: {data.lastUpdated}</div>
                        <div className="flex items-center gap-2"><Scale size={14}/> Jurisdiction: {data.jurisdiction}</div>
                        <div className="flex items-center gap-2"><ShieldCheck size={14}/> Version: {data.version}</div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="space-y-16">
                    {data.sections?.map((section: any) => (
                        <div key={section.id} className="group">
                            {/* TITRE PERSONNALISÉ STYLE TRAVELIA/SIRIUS */}
                            {section.subtitle && (
                                <h2 className="text-3xl font-extrabold text-[#443C34] mb-6 flex items-center gap-4">
                                    <span className="h-px w-12 bg-[#443C34]/20 inline-block"></span>
                                    {section.subtitle}
                                </h2>
                            )}

                            {/* CONTENU SANS NUMÉRO */}
                            <div className="md:pl-16">
                                <div 
                                    className="prose prose-stone max-w-none 
                                    prose-p:text-[#443C34]/80 prose-p:leading-relaxed prose-p:text-lg
                                    prose-li:text-[#443C34]/80 prose-li:my-2
                                    prose-strong:text-[#443C34] prose-strong:font-bold"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}