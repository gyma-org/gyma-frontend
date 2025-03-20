import mapboxgl from "@neshan-maps-platform/mapbox-gl";
import { Marker } from "mapbox-gl";
import { Box, Button, Fab, Typography,Modal } from "@mui/material";
import "./index.css";
import myLocationIcon from "@/assets/mylocation.svg";
import React, { useEffect, useRef, useState } from "react";
import { fetchNearbyGyms, Gym } from "../../api/gymMap";
import FloatCard from "../FloatCard";
import NearbyGyms from "./NearbyGym";
import GymPreview from "../GymPreview";
import { FitnessCenter, KeyboardDoubleArrowDown, KeyboardDoubleArrowUp,InfoOutlined } from "@mui/icons-material";
import { CircularProgress, LinearProgress, useMediaQuery  } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';


const Mapp = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [userMarker, setUserMarker] = useState<Marker | null>(null); // State to store user marker
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null); // Store clicked location
  const [gymMarkers, setGymMarkers] = useState<{ marker: Marker; popupElement: HTMLDivElement }[]>([]);
  const [locationDenied, setLocationDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [progress, setProgress] = useState(100);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = useState(false);

  // Preview
  const [gymPreview, setGymPreview] = useState<Gym | null>(null);

  const [showNearbyGyms, setShowNearbyGyms] = useState(false);

  const isDesktop = useMediaQuery("(min-width:900px)"); 
  
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
      mapKey: "web.371ed93a9e524959acafafcafdeb0783",
      poi: false,
      traffic: false,
    }) as unknown as mapboxgl.Map;

    mapRef.current.on("load", () => {
      if (isDesktop) {
        setShowNearbyGyms(true); // Hide the nearby gyms when not on a desktop
      }
      setLoading(false); // Hide loading when map loads
      fetchNearbyGyms(userLat, userLon)
        .then((data) => {
          if (Array.isArray(data)) {
            setGyms(data);
            console.log(gyms)
            addMarkersToMap(data);
            if (!isDesktop) {
              setShowNearbyGyms(false); // Hide the nearby gyms when not on a desktop
            }else{
              setShowNearbyGyms(true);
            }
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

  useEffect(() => {
    if (!locationDenied) return;

    setProgress(100); // Reset progress bar when opened

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 10 : 0)); // Continuous smooth transition
    }, 1000);

    const autoHide = setTimeout(() => setLocationDenied(false), 10000);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
      clearTimeout(autoHide);
    };
  }, [locationDenied]);

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
          console.log(nearbyGyms)
          setGyms(nearbyGyms);
          
          console.log(gyms)
          addMarkersToMap(nearbyGyms);
          if (isDesktop) {
            setShowNearbyGyms(true); // Hide the nearby gyms when not on a desktop
          }
        } else {
          console.error("Invalid gym data format:", nearbyGyms);
        }
      });
    }
  };

  const handleZoomOut = () => { // این فانکشن در دو بخش NearbyGym و GymPreview اضافه شده به
    if (mapRef.current) {
      const map = mapRef.current;
      const currentCenter = map.getCenter(); // Get current center

      map.flyTo({
        center: [currentCenter.lng, currentCenter.lat - 0.02], // Move slightly up
        zoom: 12, // Adjust zoom level
        essential: true,
      });
      setShowNearbyGyms(true);
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
      center: [lon, lat - 0.002],
      zoom: 15,
      essential: true,
    });
  };

  // ✅ Creates a gym marker and handles clicks
  const createGymMarker = (map: mapboxgl.Map, gym: Gym, index: number) => {
    const markerElement = document.createElement("div");
    markerElement.className = "custom-marker";
    markerElement.style.backgroundImage = `url(/icons/gyms.svg)`;
    markerElement.style.width = "40px";
    markerElement.style.height = "40px";
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

      if (zoom <= 11.5) {
        popupElement.style.transition = "opacity 0.3s ease-in-out"; // Add transition
        popupElement.style.opacity = "0"; // Fade out
        popupElement.style.pointerEvents = "none"; // Prevent interaction when hidden
      } else {
        popupElement.style.transition = "opacity 0.3s ease-in-out"; // Add transition
        popupElement.style.opacity = "1"; // Fade in
        popupElement.style.pointerEvents = "auto"; // Re-enable interaction
      }

      const fontSize = Math.max(10, zoom * 1.2); // Prevents text from getting too small
      popupElement.style.fontSize = `${fontSize}px`;

      const baseOffset = 15;

      const topOffset = -10;
      const leftOffset = baseOffset + (zoom * 0.5);

      popupElement.style.left = `${pos.x + leftOffset}px`;

      // popupElement.style.left = isLeftSide ? `${pos.x + leftOffset}px` : `${pos.x - leftOffset}px`;
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
    <Box sx={{ display: "flex",height: "100%",position: "relative" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(255,255,255,0.8)", // Semi-transparent background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}>
          <CircularProgress color="primary" />
        </Box>
      )}
      {locationDenied && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: isMobile ? "auto" : "50%",
            right: isMobile ? 10 : "auto",
            transform: isMobile ? "none" : "translateX(-50%)",
            bgcolor: "#fff",
            borderRadius: "8px",
            p: 1,
            zIndex: 200,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", // ✅ Soft shadow
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: "12px",
            maxWidth: isMobile ? "200px" : "320px", // ✅ Smaller on mobile, normal on desktop
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}>
          <Typography variant="caption" sx={{ flexShrink: 0 }}>
            موقعیت‌یابی غیرفعال
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleRequestLocation} size="small" sx={{ fontSize: "9px", p: "2px 4px", minWidth: "auto" }}>
            فعال‌سازی
          </Button>
          <Button variant="text" color="secondary" onClick={() => setLocationDenied(false)} size="small" sx={{ fontSize: "9px", p: "2px 4px", minWidth: "auto" }}>
            بستن
          </Button>

          {/* ✅ Modern, continuously moving progress bar at the bottom */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "3px",
              bgcolor: "rgba(33, 150, 243, 0.2)", // Light blue background
              "&::after": {
                content: '""',
                display: "block",
                height: "100%",
                width: `${progress}%`,
                bgcolor: "#2196F3", // Primary blue
                transition: "width 1s linear", // ✅ Smooth movement
                boxShadow: "0px 0px 6px rgba(33, 150, 243, 0.5)", // ✅ Glow effect
              },
            }}
          />
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
        maxWidth: 470,
      }}
    >
      {gymPreview ? (
        <GymPreview
          handleBack={() => setGymPreview(null)}
          gym={gymPreview}
          maxWidth={400}
          onBack={handleZoomOut}
        />
      ) : (
        <>
          {showNearbyGyms && (
            <Box
              sx={{
                maxHeight: "60vh", // Adjust this based on your design
                overflowY: "auto", // Enables scrolling
                pr: 1, // Optional: Prevents scrollbar from overlapping content
              }}
            >
              {gyms.map((gym) => (
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
                  min_price={gym.min_price}
                />
              ))}
            </Box>
          )}
          <Button
            variant="outlined"
            onClick={() => setShowNearbyGyms(!showNearbyGyms)}
            color="primary"
          >
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
      {!isDesktop && (
        <NearbyGyms
          gyms={gyms}
          gymPreview={gymPreview}
          handleBack={() => setGymPreview(null)}
          handleGymClick={handleGymClick}
          showNearbyGyms={showNearbyGyms}
          setShowNearbyGyms={setShowNearbyGyms}
          onBack={handleZoomOut}
        />
      )}
      {/* {!showNearbyGyms && (
        <Fab
          sx={{
            position: "absolute",
            bottom: "7%",
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
      )} */}

      <Fab
        sx={{
          position: "absolute",
          top: "1.5%",
          left: 10, // Adjust position if needed
          display: { xs: "flex", md: "flex" }, 
          color: "#fff",
          bgcolor: "#258cf3!important",
          borderRadius: "50%", // Ensures a circular shape
          width: 48, // Standard FAB size
          height: 48, // Standard FAB size
          minWidth: 0, // Prevents unwanted stretching
        }}
        onClick={() => setOpen(true)}
      >
        <InfoOutlined />
      </Fab>

      
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <a
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=588646&Code=OdOh07mDjGRVMXCamgrr8JOra7N8WdRL"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=588646&Code=OdOh07mDjGRVMXCamgrr8JOra7N8WdRL"
              alt="Enamad Trust Seal"
              style={{ cursor: "pointer", display: "block" }}
            />
          </a>
        </Box>
      </Modal>

      {!showNearbyGyms && (
        <Fab
          sx={{
            position: 'fixed', // Stays visible when scrolling
            bottom: '100px', // Position higher on page
            left: '50%', // Center horizontally
            transform: 'translateX(-50%)', // Perfect centering
            bgcolor: 'transparent', // Fully transparent background
            boxShadow: 'none', // Remove default MUI shadow
            width: 60, // Button size
            height: 60,
            transition: 'all 0.3s ease', // Smooth transitions
            '&:hover': {
              transform: 'translateX(-50%) translateY(-4px)', // Lift effect on hover
            },
          }}
          onClick={() => setShowNearbyGyms(true)}
        >
          {/* Custom Wide Double Arrow SVG */}
          <svg
            width="50"
            height="30"
            viewBox="0 0 50 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'float 2s infinite ease-in-out' }}
          >
            <path
              d="M5 20L25 5L45 20"
              stroke="gray"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 30L25 15L45 30"
              stroke="gray"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Fab>
      )}
     <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
      
      
      
      <Box
        sx={{ width: "100%", height: "78vh" }}
        ref={mapContainerRef}
      />
    </Box>
  );
};

export default Mapp;
