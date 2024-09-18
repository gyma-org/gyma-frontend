
import dynamic from "next/dynamic";
import "../globals.css";
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Favorite Gyms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gyms.map(gym => (
          <div key={gym.id} className="border rounded-lg overflow-hidden shadow-lg">
            <img src={gym.image} alt={gym.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{gym.name}</h2>
              <p className="text-gray-600 mb-2">{gym.address}</p>
              <p className="text-lg font-medium mb-2">{gym.price}</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{gym.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
