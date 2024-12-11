import Footer from '@/components/Footer';
import "../globals.css";
import React from 'react';

// Sample data for gyms
const gyms = [
  {
    id: 1,
    name: 'باشگاه خوبای شهر',
    address: 'شمرون جیهون تهرون اینجاست',
    price: '241000',
    rating: 4.5,
    image: '/images/gym1.webp'
  },
  {
    id: 2,
    name: 'باشگاه خوبای شهر',
    address: 'شمرون جیهون تهرون اینجاست',
    price: '241000',
    rating: 4.2,
    image: '/images/gym1.webp'
  },
  {
    id: 3,
    name: 'باشگاه خوبای شهر',
    address: 'شمرون جیهون تهرون اینجاست',
    price: '241000',
    rating: 4.8,
    image: '/images/gym1.webp'
  }
];

const FavoritePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <div className="p-4 sm:p-6 flex-grow">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">باشگاه های مورد علاقه</h1>

        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 md:grid-cols-2">
          {gyms.map(gym => (
            <div
              key={gym.id}
              className="flex flex-col sm:flex-row-reverse items-start border rounded-lg overflow-hidden shadow-lg bg-white p-4"
            >
              {/* Gym image */}
              <img
                src={gym.image}
                alt={gym.name}
                className="w-full h-48 sm:w-32 sm:h-32 object-cover rounded-md"
              />

              {/* Gym details */}
              <div className="mt-4 sm:mt-5 sm:mr-10 flex-grow">
                <h2 className="text-lg sm:text-xl font-semibold mb-1">{gym.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{gym.address}</p>

                {/* Price on the left, Rating on the right */}
                <div className="flex items-center lg:gap-10 xl:gap-60 2xl:gap-80">
                  {/* Gym rating - bigger stars */}
                  <div className="flex items-center justify-end text-lg sm:text-xl">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={`text-yellow-500 ${gym.rating >= index + 1 ? "fas" : "far"} fa-star`}
                      />
                    ))}
                  </div>

                  <div className="text-right text-base sm:text-lg font-medium sm:ml-4">
                    {gym.price} تومان
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;
