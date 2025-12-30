import { motion } from 'framer-motion';

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  badgeColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

export function SectionHeader({ 
  badge, 
  title, 
  subtitle,
  badgeColor = 'text-[#443C34] border-[#443C34]',
  titleColor = 'text-[#443C34]',
  subtitleColor = 'text-gray-600'
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16 sm:mb-20"
    >
      <div className="mb-6 mt-10 md:mt-20">
        <span className={`text-xl font-semibold border-2 px-6 py-3 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${titleColor}`}>
        {title}
      </h2>
      <p className={`text-xl max-w-2xl mx-auto ${subtitleColor}`}>
        {subtitle}
      </p>
    </motion.div>
  );
}