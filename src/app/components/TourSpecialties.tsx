import * as React from 'react';

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
    <section className="py-20 sm:py-24 md:py-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xl font-semibold border-2 border-[#443C34] px-6 py-3 rounded-full mb-6">
            Specialized Tours
          </span>

          <h2 className="text-5xl font-bold text-[#443C34] mb-6">
            Unique Experiences
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of specialized tours designed for unforgettable adventures
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((specialty) => (
            <div
              key={specialty.id}
              className="bg-white rounded-3xl overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={specialty.image}
                  alt={specialty.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-6 translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl">
                  <span className="text-4xl">{specialty.icon}</span>
                </div>
              </div>

              <div className="p-6 pt-10">
                <h3 className="text-2xl font-bold text-[#443C34] mb-3">
                  {specialty.title}
                </h3>

                <p className="text-gray-600 text-sm mb-6">
                  {specialty.description}
                </p>

                <button className="bg-[#443C34] text-white px-6 py-3 rounded-xl font-semibold">
                  Discover More
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
