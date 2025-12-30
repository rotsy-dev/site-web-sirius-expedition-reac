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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Délai entre chaque élément
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="text-center mb-16 sm:mb-20"
    >
      <motion.div variants={itemVariants} className="mb-4 mt-8 md:mb-6 md:mt-20">
        <span className={`inline-block text-sm sm:text-base md:text-xl font-semibold border px-4 py-2 md:border-2 md:px-6 md:py-3 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      </motion.div>
      <motion.h2
        variants={itemVariants}
        className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight ${titleColor}`}
      >
        {title}
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto ${subtitleColor}`}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
}