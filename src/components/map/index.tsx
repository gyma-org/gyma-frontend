import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { Marker } from "mapbox-gl";
import { Box, Container, Typography } from "@mui/material";
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
    if (typeof window !== "undefined" && mapContainerRef.current) {
      const initializeMap = (userLat: number, userLon: number) => {
        mapRef.current = new mapboxgl.Map({
          mapType: mapboxgl.Map.mapTypes.neshanVector,
          container: mapContainerRef.current!,
          zoom: 40,
          pitch: 0,
          center: [userLon, userLat],
          minZoom: 2,
          maxZoom: 50,
          trackResize: true,
          mapKey: "web.659fc6316bb54b98b27499e3972b294e",
          poi: false,
          traffic: false,
        }) as unknown as mapboxgl.Map;

        mapRef.current.on("load", () => {
          fetchNearbyGyms(userLat, userLon)
            .then((data) => {
              console.log("Fetched gym data:", data);
              if (Array.isArray(data)) {
                setGyms(data);
                addMarkersToMap(data);
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

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            initializeMap(userLat, userLon);
          },
          (error) => {
            console.error("Error getting location:", error);
            const defaultLat = 35.6892;
            const defaultLon = 51.389;
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
        newMarker = new mapboxgl.Marker({ color: "blue" }).setLngLat([lng, lat]).addTo(map);

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
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${gym.name}</h3><p>${gym.address}</p>`))
        .addTo(map);

      marker.togglePopup(); // Show the popup when the marker is added
      return marker;
    });
  };

  return (
    <Box sx={{ display: "flex", height: "100%", position: "relative" }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          borderRadius: "15px",
          gap: 1,
          p: 2,
          right: 10,
          top: 10,
          position: "absolute",
          bgcolor: "#fff",
          zIndex: 100,
          border: "2px solid #FF9100",
        }}>
        <Typography align="center">{"باشگاه های نزدیک"}</Typography>
        {gyms.map((gym) => (
          <FloatCard
            key={gym.gym_code}
            name={gym.name}
            address={gym.address}
            city={gym.city}
          />
        ))}
      </Box>
      <Box
        sx={{ width: "100%", height: "78vh" }}
        ref={mapContainerRef}
      />
    </Box>
  );
};

export default Mapp;
