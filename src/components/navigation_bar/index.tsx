<<<<<<< HEAD
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SearchResult {
  title: string;
  address: string;
  type: string;
  location: {
    y: number;
    x: number;
  };
}

const NavBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMarkers, setSearchMarkers] = useState<L.Marker[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    const loadLeaflet = () => {
      const script = document.createElement('script');
      script.src = 'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js';
      script.async = true;
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css';
      document.head.appendChild(link);

    //   script.onload = () => {
    //     if (!map) {
    //       const myMap = (window as any).L.map('map').setView([35.699739, 51.338097], 14);
    //       (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '© OpenStreetMap contributors'
    //       }).addTo(myMap);

	// 	  // Hide the map container
	// 	  const mapContainer = document.getElementById('map');
	// 	  if (mapContainer) {
	// 		mapContainer.style.display = 'block'; // or 'visibility: hidden;' to keep space
	// 	  }

    //       setMap(myMap);
    //     }
    //   };
    };

    loadLeaflet();
  }, [map]);

  const search = async () => {
    // if (!map) return;

    // searchMarkers.forEach(marker => map.removeLayer(marker));
    setSearchMarkers([]);

    const url = `https://api.neshan.org/v1/search?term=${searchTerm}&lat=35.699739&lng=51.338097`;
    const params = {
      headers: {
        'Api-Key': 'service.f062e04d2ea646349820105dd9525687',
      },
    };

    try {
      const { data } = await axios.get(url, params);
      console.log(data);

      if (data.count > 0) {
        // map.flyTo([35.699739, 51.338097], 12);
        const newMarkers = data.items.map((item: SearchResult) => {
          const marker = (window as any).L.marker([item.location.y, item.location.x], {
            icon: (window as any).L.icon({
              iconUrl: 'icon/marker-icon-2x-green.png',
              shadowUrl: 'icon/shadow/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
            title: item.title,
          }).addTo(map);

          marker.bindPopup(`Title: ${item.title}<br>Address: ${item.address}<br>Type: ${item.type}`);
          return marker;
        });

        setSearchMarkers(newMarkers);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 flex flex-col items-center">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a location"
          className="p-2 w-64 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={search}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
      {/* <div id="map" className="w-full h-96 rounded-md shadow-md"></div> */}
    </div>
  );
};

export default NavBar;
=======
import React from "react";

const NavigationBar = () => {
	return <div className="absolute z-50">NavigationBar</div>;
};

export default NavigationBar;
>>>>>>> b0a01eb90408b4f555e3a74079add9668bf969a9
