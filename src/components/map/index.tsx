import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { Marker } from "mapbox-gl";
import { Box, Button, Typography } from "@mui/material";
import "./index.css";
import myLocationIcon from "@/assets/mylocation.svg";
import React, { useEffect, useRef, useState } from "react";
import { fetchNearbyGyms, Gym } from "../../api/gymMap";
import FloatCard from "../FloatCard";
import NearbyGyms from "./NearbyGym";

const Mapp = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [userMarker, setUserMarker] = useState<Marker | null>(null); // State to store user marker
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null); // Store clicked location
  const [gymMarkers, setGymMarkers] = useState<Marker[]>([]); // Track gym markers to remove them
  const [locationDenied, setLocationDenied] = useState(false);

  const initializeMap = (userLat: number, userLon: number) => {
    mapRef.current = new mapboxgl.Map({
      mapType: mapboxgl.Map.mapTypes.neshanVector,
      container: mapContainerRef.current!,
      mapTypeControllerOptions: {
        show: false,
      },
      zoom: 12,
      pitch: 0,
      center: [userLon, userLat],
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      mapKey: "web.659fc6316bb54b98b27499e3972b294e",
      poi: false,
      traffic: false,
    }) as unknown as mapboxgl.Map;

    mapRef.current.on("load", () => {
      fetchNearbyGyms(userLat, userLon)
        .then((data) => {
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

  useEffect(() => {
    if (typeof window !== "undefined" && mapContainerRef.current) {

      const defaultLat = 35.6892; // Tehran
      const defaultLon = 51.389;
      
      // Initialize the map immediately with default coordinates
      initializeMap(defaultLat, defaultLon);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            initializeMap(userLat, userLon);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationDenied(true); // Show the location denied box
            const defaultLat = 35.6892; // Tehran
            const defaultLon = 51.389;
            initializeMap(defaultLat, defaultLon);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLocationDenied(true); // Show the location denied box
        
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

        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.style.backgroundImage = `url(/icons/mylocation.svg)`; // Use the SVG as the background image
        markerElement.style.backgroundSize = 'contain'; // Ensure the image is fully contained
        markerElement.style.width = '50px'; // Set width of the marker
        markerElement.style.height = '50px'; // Set height of the marker

        // Add new user marker
        newMarker = new mapboxgl.Marker(markerElement).setLngLat([lng, lat]).addTo(map);

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

  const handleRequestLocation = () => {
    setLocationDenied(false); // Hide the box before re-requesting
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        initializeMap(userLat, userLon);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationDenied(true); // Show the box again if denied
      }
    );
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

  const handleGymClick = (id: string) => {
    // Navigate to the gym details page
    window.location.href = `/gyms/${id}`;
  };

  return (
    <Box sx={{ display: "flex", height: "100%", position: "relative" }}>
      {locationDenied && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: "#fff",
            borderRadius: "8px",
            p: 2,
            zIndex: 200,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>
            سرویس موقعیت یابی توسط شما غیر فعال شده است.
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleRequestLocation} sx={{ mr: 1 }}>
            فعال سازی سرویس موقعیت یابی
          </Button>
          <Button variant="text" color="secondary" onClick={() => setLocationDenied(false)}>
            بستن
          </Button>
        </Box>
      )}
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
          zIndex: 1,
          border: "2px solid #FF9100",
          width: "100%",
          maxWidth: 440,
        }}>
        <Typography align="center">{"باشگاه های نزدیک"}</Typography>
        {gyms.map((gym) => (
          <FloatCard
            key={gym.gym_code}
            name={gym.name}
            address={gym.address}
            city={gym.city}
            profile={gym.profile}
            price={gym.price}
            gymId={gym.id}
            onClick={() => handleGymClick(gym.id)} // Pass the click handler
            maxWidth={400}
            rate={gym.rate}
          />
        ))}
      </Box>
      <NearbyGyms
        gyms={gyms}
        handleGymClick={handleGymClick}
      />
      <Box
        sx={{ width: "100%", height: "78vh" }}
        ref={mapContainerRef}
      />
    </Box>
  );
};

export default Mapp;
