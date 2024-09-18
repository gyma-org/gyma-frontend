import dynamic from "next/dynamic";
import "../../src/app/globals.css";
import React from 'react';

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

// Sample data for gyms
const gyms = [
  {
    id: 1,
    name: 'Fitness Club A',
    address: '123 Main St, Cityville',
    price: '$30/month',
    rating: 4.5,
    image: '/images/gym1.webp' // Ensure to put your images in the public/images directory
  },
  {
    id: 2,
    name: 'Powerhouse Gym',
    address: '456 Elm St, Townsville',
    price: '$25/month',
    rating: 4.2,
    image: '/images/gym1.webp'
  },
  {
    id: 3,
    name: 'Wellness Center',
    address: '789 Oak St, Villagetown',
    price: '$35/month',
    rating: 4.8,
    image: '/images/gym1.webp'
  }
];

const FavoritePage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Favorite Gyms</h1>

      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        {gyms.map(gym => (
          <div
            key={gym.id}
            className="flex flex-col sm:flex-row items-start border rounded-lg overflow-hidden shadow-lg bg-white p-4"
          >
            {/* Gym image */}
            <img
              src={gym.image}
              alt={gym.name}
              className="w-full h-48 sm:w-32 sm:h-32 object-cover rounded-md"
            />

            {/* Gym details */}
            <div className="mt-4 sm:mt-0 sm:ml-4 flex-grow">
              <h2 className="text-lg sm:text-xl font-semibold mb-1">{gym.name}</h2>
              <p className="text-sm sm:text-gray-600 mb-2">{gym.address}</p>
              <p className="text-base sm:text-lg font-medium mb-2">{gym.price}</p>

              {/* Gym rating - 5 stars */}
              <div className="flex items-center text-sm">
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={`text-yellow-500 ${
                      gym.rating >= index + 1 ? "fas" : "far"
                    } fa-star`}
                  />
                ))}
                <span className="ml-2">{gym.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute z-50 bottom-0 left-0 right-0">
        <Footer />
      </div>
    </div>
  );
};

export default FavoritePage;
