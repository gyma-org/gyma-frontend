import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { Marker } from "mapbox-gl";
import { Box, Button, Fab, Typography } from "@mui/material";
import "./index.css";
import myLocationIcon from "@/assets/mylocation.svg";
import React, { useEffect, useRef, useState } from "react";
import { fetchNearbyGyms, Gym } from "../../api/gymMap";
import FloatCard from "../FloatCard";
import NearbyGyms from "./NearbyGym";
import GymPreview from "../GymPreview";
import { FitnessCenter, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp } from "@mui/icons-material";
import { set } from "date-fns";

const Mapp = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [userMarker, setUserMarker] = useState<Marker | null>(null); // State to store user marker
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null); // Store clicked location
  const [gymMarkers, setGymMarkers] = useState<{ marker: Marker; popupElement: HTMLDivElement }[]>([]);
  const [locationDenied, setLocationDenied] = useState(false);

  // Preview
  const [gymPreview, setGymPreview] = useState<Gym | null>(null);

  const [showNearbyGyms, setShowNearbyGyms] = useState(false);

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

        const clickedElement = e.originalEvent.target as HTMLElement;

        // ❌ Ignore clicks on gym pins
        if (clickedElement.classList.contains("custom-marker")) return;

        // Remove previous user marker if it exists
        if (newMarker) {
          newMarker.remove();
        }

        const markerElement = document.createElement("div");
        markerElement.className = "marker";
        markerElement.style.backgroundImage = `url(/icons/mylocation.svg)`; // Use the SVG as the background image
        markerElement.style.backgroundSize = "contain"; // Ensure the image is fully contained
        markerElement.style.width = "50px"; // Set width of the marker
        markerElement.style.height = "50px"; // Set height of the marker

        // Add new user marker
        newMarker = new mapboxgl.Marker(markerElement).setLngLat([lng, lat]).addTo(map);

        // Update marker and selected location state
        // setUserMarker(newMarker);
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

  let newGymMarkers: { marker: Marker; popupElement: HTMLDivElement }[] = [];
  let selectedMarkerIndex: number | null = null;

  // ✅ Clears all gym markers
  const clearGymMarkers = () => {
    newGymMarkers.forEach(({ marker, popupElement }) => {
      marker.remove();
      popupElement.remove();
    });
    newGymMarkers = [];
    setGymMarkers([]);
    selectedMarkerIndex = null;
  };

  // ✅ Handles marker selection & updates styles
  const selectGymMarker = (index: number) => {
    selectedMarkerIndex = index;

    newGymMarkers.forEach(({ marker }, i) => {
      const el = marker.getElement();
      el.style.backgroundImage = i === index ? `url(/icons/selectedgyms.svg)` : `url(/icons/gyms.svg)`;
      el.style.width = i === index ? "60px" : "50px";
      el.style.height = i === index ? "60px" : "50px";
    });
  };

  // ✅ Flies to the selected gym
  const flyToGym = (map: mapboxgl.Map, lat: number, lon: number) => {
    map.flyTo({
      center: [lon, lat - 0.004],
      zoom: 15,
      essential: true,
    });
  };

  // ✅ Creates a gym marker and handles clicks
  const createGymMarker = (map: mapboxgl.Map, gym: Gym, index: number) => {
    const markerElement = document.createElement("div");
    markerElement.className = "custom-marker";
    markerElement.style.backgroundImage = `url(/icons/gyms.svg)`;
    markerElement.style.width = "50px";
    markerElement.style.height = "50px";
    markerElement.style.cursor = "pointer";

    // ✅ Create text container (popup)
    const popupElement = document.createElement("div");
    popupElement.innerHTML = `<h3>${gym.name}</h3>`;
    popupElement.className = "gym-popup";

    // ✅ Style for popup

    popupElement.style.position = "absolute";
    popupElement.style.padding = "5px 8px";
    popupElement.style.whiteSpace = "nowrap";
    // popupElement.style.fontSize = "14px";
    popupElement.style.backgroundColor = "transparent";
    popupElement.style.borderRadius = "5px";
    // popupElement.style.boxShadow = "0px 2px 5px rgba(0,0,0,0.2)";

    const marker = new mapboxgl.Marker(markerElement).setLngLat([gym.lon, gym.lat]).addTo(map);

    map.getCanvas().parentNode?.appendChild(popupElement);

    const updatePopupPosition = () => {
      const pos = map.project([gym.lon, gym.lat]);
      const zoom = map.getZoom();

      const fontSize = Math.max(10, zoom * 1.2); // Prevents text from getting too small
      popupElement.style.fontSize = `${fontSize}px`;

      const leftOffset = zoom * 2; // Distance from pin
      const topOffset = -10;

      const screenWidth = map.getCanvas().width;
      const isLeftSide = pos.x < screenWidth / 2; // Check if marker is on left or right side

      popupElement.style.left = isLeftSide ? `${pos.x + leftOffset}px` : `${pos.x - leftOffset}px`;
      popupElement.style.top = `${pos.y + topOffset}px`;
    };

    map.on("move", updatePopupPosition);
    map.on("moveend", updatePopupPosition);
    map.on("zoom", updatePopupPosition);
    updatePopupPosition();

    // ✅ Handle click event for selecting gym
    markerElement.addEventListener("click", (event) => {
      event.stopPropagation();
      selectGymMarker(index);
      flyToGym(map, gym.lat, gym.lon);
      setShowNearbyGyms(true);
      setGymPreview(gym);
    });

    return { marker, popupElement };
  };

  // ✅ Main function to add markers
  const addMarkersToMap = (gyms: Gym[]) => {
    const map = mapRef.current;
    if (!map) return;

    clearGymMarkers(); // ✅ Remove existing markers

    newGymMarkers = gyms.map((gym, index) => createGymMarker(map, gym, index));

    setGymMarkers(newGymMarkers);
  };

  const handleGymClick = (gym: Gym) => {
    setGymPreview(gym);
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
          }}>
          <Typography
            variant="body1"
            sx={{ mb: 2 }}>
            سرویس موقعیت یابی توسط شما غیر فعال شده است.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRequestLocation}
            sx={{ mr: 1 }}>
            فعال سازی سرویس موقعیت یابی
          </Button>
          <Button
            variant="text"
            color="secondary"
            onClick={() => setLocationDenied(false)}>
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
        {gymPreview ? (
          <GymPreview
            handleBack={() => setGymPreview(null)}
            gym={gymPreview}
            maxWidth={400}
          />
        ) : (
          <>
            {showNearbyGyms && <Typography align="center">{"باشگاه های نزدیک"}</Typography>}
            {showNearbyGyms &&
              gyms.map((gym) => (
                <FloatCard
                  key={gym.gym_code}
                  name={gym.name}
                  address={gym.address}
                  city={gym.city}
                  profile={gym.profile}
                  price={gym.price}
                  gymId={gym.id}
                  onClick={() => handleGymClick(gym)}
                  maxWidth={400}
                  rate={gym.rate}
                />
              ))}
            <Button
              variant="outlined"
              onClick={() => setShowNearbyGyms(!showNearbyGyms)}
              color="primary">
              {showNearbyGyms ? (
                <>
                  عدم نمایش
                  <KeyboardDoubleArrowUp />
                </>
              ) : (
                <>
                  نمایش باشگاه های نزدیک
                  <KeyboardDoubleArrowDown />
                </>
              )}
            </Button>
          </>
        )}
      </Box>
      <NearbyGyms
        gyms={gyms}
        gymPreview={gymPreview}
        handleBack={() => setGymPreview(null)}
        handleGymClick={handleGymClick}
        showNearbyGyms={showNearbyGyms}
        setShowNearbyGyms={setShowNearbyGyms}
      />
      {!showNearbyGyms && (
        <Fab
          sx={{
            position: "absolute",
            bottom: 10,
            right: -5,
            gap: 1,
            display: { xs: "flex", md: "none" },
            borderRadius: "16px 0 0 16px",
            color: "#fff",
            bgcolor: "#FF9100 !important",
          }}
          onClick={() => setShowNearbyGyms(true)}
          variant="extended">
          <FitnessCenter />
          نمایش باشگاه های نزدیک
        </Fab>
      )}
      <Box
        sx={{ width: "100%", height: "78vh" }}
        ref={mapContainerRef}
      />
    </Box>
  );
};

export default Mapp;
