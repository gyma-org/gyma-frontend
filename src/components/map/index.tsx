"use client";

import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { Marker } from "mapbox-gl";
import { Box } from "@mui/material";
import "./index.css";
import React, { useEffect, useRef, useState } from "react";
import { fetchNearbyGyms, Gym } from "../../api/gymMap";
import FloatCard from "../FloatCard";

const Mapp = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [userMarker, setUserMarker] = useState<Marker | null>(null); // State to store user marker
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null); // Store clicked location
  const [gymMarkers, setGymMarkers] = useState<Marker[]>([]); // Track gym markers to remove them

  useEffect(() => {
    // Ensure this runs only on the client-side
    if (typeof window !== "undefined" && mapContainerRef.current) {
      const initializeMap = (userLat: number, userLon: number) => {
        // Initialize the map
        mapRef.current = new mapboxgl.Map({
          mapType: mapboxgl.Map.mapTypes.neshanVector,
          container: mapContainerRef.current!,
          zoom: 12,
          pitch: 0,
          center: [userLon, userLat], // Use user's location to center the map
          minZoom: 2,
          maxZoom: 21,
          trackResize: true,
          mapKey: "web.659fc6316bb54b98b27499e3972b294e",
          poi: false,
          traffic: false,
        }) as unknown as mapboxgl.Map;

        mapRef.current.on("load", () => {
          // Fetch gyms nearby based on user's location
          fetchNearbyGyms(userLat, userLon)
            .then((data) => {
              console.log("Fetched gym data:", data); // Log the fetched data

              // Check if the response is an array
              if (Array.isArray(data)) {
                setGyms(data); // Directly set the gyms array
                addMarkersToMap(data); // Pass the array to the marker function
              } else {
                console.error("Invalid gym data format:", data);
              }
            })
            .catch((error) => {
              console.error("Error fetching gyms:", error);
            });
        });

        handleClickOnMap();
      };

      // Check if geolocation is available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            initializeMap(userLat, userLon);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fallback to a default location if geolocation fails
            const defaultLat = 35.6892; // Example: Tehran's latitude
            const defaultLon = 51.389; // Example: Tehran's longitude
            initializeMap(defaultLat, defaultLon);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Fallback to a default location if geolocation is not supported
        const defaultLat = 35.6892; // Example: Tehran's latitude
        const defaultLon = 51.389; // Example: Tehran's longitude
        initializeMap(defaultLat, defaultLon);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOnMap = () => {
    const map = mapRef.current;
    let newMarker: Marker | null = null;

    if (map) {
      map.on("click", async (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        const { lat, lng } = e.lngLat;
        console.log(e.lngLat);

        // Remove previous user marker if it exists
        if (newMarker) {
          newMarker.remove();
        }

        // Add new user marker
        newMarker = new mapboxgl.Marker({ color: "blue" })
          .setLngLat([lng, lat])
          .addTo(map);

        // Update marker and selected location state
        setUserMarker(newMarker);
        setSelectedLocation({ lat, lng });

        // Remove previous gym markers
        clearGymMarkers();

        // Fetch gyms based on clicked location and add them to the map
        const nearbyGyms = await fetchNearbyGyms(lat, lng);
        if (Array.isArray(nearbyGyms)) {
          setGyms(nearbyGyms);
          addMarkersToMap(nearbyGyms);
        } else {
          console.error("Invalid gym data format:", nearbyGyms);
        }
      });
    }
  };

  const clearGymMarkers = () => {
    // Remove previous gym markers
    gymMarkers.forEach((marker) => marker.remove());
    setGymMarkers([]); // Clear the state
  };

  let newGymMarkers: Marker[] = [];
  let marker: Marker | null = null;

  const addMarkersToMap = (gyms: Gym[]) => {
    const map = mapRef.current;
    if (!map) return;

    // Check if there are existing markers, and remove them
    if (newGymMarkers.length > 0) {
      newGymMarkers.forEach((marker) => {
        marker.remove(); // Remove each marker from the map
      });
      newGymMarkers = []; // Clear the array
    }

    // Create new markers for the gyms
    newGymMarkers = gyms.map((gym) => {
      marker = new mapboxgl.Marker({ color: "purple" })
        .setLngLat([gym.lon, gym.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${gym.name}</h3><p>${gym.address}</p>`
          )
        )
        .addTo(map);

      marker.togglePopup(); // Show the popup when the marker is added
      return marker;
    });
  };

  return (
    <Box sx={{ display: "flex", height: "500px" }}>
      <div ref={mapContainerRef} style={{ width: "70%", height: "100%" }} />

      <Box
        sx={{
          width: "30%", // Set the width of the sidebar
          height: "100%",
          overflowY: "auto", // Enable vertical scrolling
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Optional: slight background to distinguish the sidebar
          padding: 2, // Optional: add some padding
          boxShadow: 2, // Optional: add some shadow for depth
        }}
      >
        {gyms.map((gym) => (
          <FloatCard key={gym.gym_code} name={gym.name} address={gym.address} city={gym.city} />
        ))}
      </Box>
    </Box>
  );
};

export default Mapp;
