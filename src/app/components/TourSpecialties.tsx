import * as React from 'react'

interface TourSpecialty {
  id: number;
  icon: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface TourSpecialtiesProps {
  specialties: TourSpecialty[];
}

export function TourSpecialties({ specialties }: TourSpecialtiesProps) {
  return (
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header simple */}
        <div className="text-center mb-16 sm:mb-20">
          {/* Badge simple */}
          <div className="mb-6">
            <span className="text-xl text-[#443C34] dark:text-gray-400 font-semibold border-2 border-[#443C34] px-6 py-3 rounded-full">
              Specialized Tours
            </span>
          </div>

          {/* Titre principal */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#443C34] dark:text-white leading-tight">
            Unique Experiences
          </h2>

          {/* Sous-titre */}
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our curated selection of specialized tours designed for unforgettable adventures
          </p>
        </div>

        {/* Grid des spécialités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {specialties.map((specialty) => (
            <div
              key={specialty.id}
              className="bg-white rounded-3xl overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative h-64">
                <img
                  src={specialty.image}
                  alt={specialty.title}
                  className="w-full h-full object-cover"
                />

                {/* Icon Badge - Déborde en bas */}
                <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                  <div className="bg-white p-4 rounded-2xl shadow-xl">
                    <span className="text-4xl">{specialty.icon}</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="px-6 pt-10 pb-6">
                <h3 className="text-2xl font-bold text-[#443C34] group-hover:text-[#443C34] mb-3 transition-colors duration-300">
                  {specialty.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {specialty.description}
                </p>

                {/* Button */}
                <button className="inline-block bg-[#443C34] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md">
                  Discover More
                </button>
              </div>


              {/* Mets ici cette cards */}
            </div>
          ))}
        </div>

        {/* Custom Tour CTA Section */}
        <div className="mt-28">
          <div className="bg-[] rounded-3xl p-12 md:p-16 text-center border-4 border-white">
            {/* Logo Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-[#443C34] rounded-lg transform -rotate-12"></div>
                <div className="w-16 h-16 bg-[#D4C5B9] rounded-lg absolute top-0 left-4 transform rotate-12"></div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#443C34] mb-6">
              Dream It. We'll Create It.
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              Can't find your perfect adventure? Our expert team crafts bespoke journeys tailored to your wildest dreams and unique preferences.
            </p>

            {/* CTA Button */}
            <button className="inline-flex items-center gap-3 bg-[#443C34] hover:bg-[#5a4f45] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Request Custom Tour
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7v10"
                />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}