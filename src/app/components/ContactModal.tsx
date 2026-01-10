import { Mail, Phone, X, CheckCircle, Clock, ShieldCheck, Facebook, Youtube, Linkedin, Instagram } from "lucide-react";
// Since we don't have a specific photo, we'll use the logo from config or a placeholder if needed,
// but the user asked to change profile to "le logo de cette site".
// We will receive config as prop.

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
)

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: any; // Using any for flexibility with the config structure
}

export const ContactModal = ({ isOpen, onClose, config }: ContactModalProps) => {
    if (!isOpen) return null;

    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: Phone,
            href: `https://wa.me/${config.contact?.whatsapp?.replace(/[^0-9]/g, '')}`,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            borderColor: 'border-green-200',
            shadowColor: 'shadow-green-200',
            subText: 'En ligne • Réponse immédiate'
        },
        {
            name: 'Email',
            icon: Mail,
            href: `mailto:${config.contact?.email}`,
            color: 'bg-indigo-600',
            textColor: 'text-indigo-600',
            borderColor: 'border-indigo-200',
            shadowColor: 'shadow-indigo-200',
            subText: 'Réponse sous 24h maximum'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: config.social?.facebook || '#',
            color: 'bg-blue-600',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-200',
            shadowColor: 'shadow-blue-200',
            subText: 'Suivez notre actualité'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            href: config.social?.instagram || '#',
            color: 'bg-pink-600',
            textColor: 'text-pink-600',
            borderColor: 'border-pink-200',
            shadowColor: 'shadow-pink-200',
            subText: 'Nos plus belles photos'
        },
        {
            name: 'TikTok',
            icon: TikTokIcon,
            href: config.social?.tiktok || '#',
            color: 'bg-black',
            textColor: 'text-black',
            borderColor: 'border-gray-200',
            shadowColor: 'shadow-gray-400',
            subText: 'Vidéos courtes & fun'
        },
        {
            name: 'YouTube',
            icon: Youtube,
            href: config.social?.youtube || '#',
            color: 'bg-red-600',
            textColor: 'text-red-600',
            borderColor: 'border-red-200',
            shadowColor: 'shadow-red-200',
            subText: 'Nos expéditions en vidéo'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: '#', // Pays to be consistent
            color: 'bg-blue-700',
            textColor: 'text-blue-700',
            borderColor: 'border-blue-200',
            shadowColor: 'shadow-blue-200',
            subText: 'Réseau professionnel'
        }
    ];

    return (
        <>
            <style>{`
                .contact-modal-content, .contact-modal-content * {
                    cursor: auto !important;
                }
                .contact-modal-content a, .contact-modal-content button {
                    cursor: pointer !important;
                }
            `}</style>

            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`
                fixed z-[70] bg-white text-black flex flex-col
                /* Mobile: Full Screen, but rounded top */
                inset-x-0 bottom-0 rounded-t-3xl h-[85vh]
                /* Desktop: Floating Bottom Right */
                lg:inset-auto lg:bottom-24 lg:right-8 lg:w-[400px] lg:h-[650px] lg:rounded-3xl lg:shadow-2xl
                transition-transform duration-300 ease-out
                contact-modal-content
            `}>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 pt-10 pb-28 scrollbar-hide">

                    {/* Header/Profile */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-5">
                            <div className="w-24 h-24 rounded-full p-1 border border-gray-100 shadow-sm bg-white overflow-hidden flex items-center justify-center site-logo-container">
                                {/* Logo placeholder or image if available */}
                                {config.logo ? (
                                    <img
                                        src={config.logo}
                                        alt={config.siteName}
                                        className="site-logo w-full h-full rounded-full object-cover"
                                        style={{
                                            backgroundColor: 'transparent',
                                            background: 'transparent',
                                            mixBlendMode: 'normal'
                                        } as React.CSSProperties}
                                        onLoad={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            img.style.backgroundColor = 'transparent';
                                            img.style.background = 'transparent';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-[#443C34] text-white flex items-center justify-center text-3xl font-bold">
                                        {config.siteName?.charAt(0) || 'S'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white animate-pulse"></div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">👋</span>
                            <h2 className="text-lg font-bold text-gray-900">Bienvenue chez {config.siteName}</h2>
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed mb-8 px-4">
                            Nous sommes là pour organiser votre voyage de rêve à Madagascar.
                        </p>
                    </div>

                    {/* Contact Options Box */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
                        <h3 className="text-center font-bold text-gray-900 mb-6 text-sm">
                            Une question ? <span className="text-[#A68966]">Nous vous répondons !</span>
                        </h3>

                        <div className="space-y-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-4 p-4 bg-white border ${link.borderColor} rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-gray-400 transition-all group`}
                                >
                                    <div className={`w-10 h-10 rounded-full ${link.color} text-white flex items-center justify-center shrink-0 shadow-lg ${link.shadowColor}`}>
                                        <link.icon size={20} className={link.name === 'TikTok' ? '' : 'fill-current'} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-bold text-gray-900">{link.name}</p>
                                        <p className="text-xs text-gray-500">{link.subText}</p>
                                    </div>
                                    <div className="text-gray-300 group-hover:translate-x-1 transition-transform">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Trust Points */}
                    <div className="space-y-2 px-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={16} className="text-green-500 shrink-0" />
                            <p className="text-[11px] text-gray-500">Expertise locale garantie</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock size={16} className="text-blue-500 shrink-0" />
                            <p className="text-[11px] text-gray-500">Support disponible 7j/7</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={16} className="text-purple-500 shrink-0" />
                            <p className="text-[11px] text-gray-500">Voyages sur mesure et sécurisés</p>
                        </div>
                    </div>

                </div>

                {/* Floating Footer Button */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
                    <button
                        onClick={onClose}
                        className="bg-[#443C34] hover:bg-[#2c2620] text-white px-6 py-2.5 rounded-lg shadow-lg shadow-black/30 flex items-center gap-2 text-sm font-medium transition-all active:scale-95 pointer-events-auto"
                    >
                        <X size={18} />
                        Fermer
                    </button>
                </div>

                {/* Gradient fade at bottom to blend content */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
            </div>
        </>
    );
};
