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
  const [showNoGymsModal, setShowNoGymsModal] = useState(false);

  // Preview
  const [gymPreview, setGymPreview] = useState<Gym | null>(null);

  const [showNearbyGyms, setShowNearbyGyms] = useState(false);

  const isDesktop = useMediaQuery("(min-width:900px)"); 
  
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const defaultLocations = {
    tehran: { lat: 35.727785, lon: 51.367974 },
  };
  const initializeMap = (userLat: number, userLon: number, default_loc: boolean) => {
    mapRef.current = new mapboxgl.Map({
      mapType: mapboxgl.Map.mapTypes.neshanVector,
      container: mapContainerRef.current!,
      mapTypeControllerOptions: {
        show: false,
      },
      zoom: 12,
      pitch: 0,
      poi: false,
      center: [userLon, userLat],
      minZoom: 2,
      maxZoom: 21,
      trackResize: true,
      mapKey: "web.371ed93a9e524959acafafcafdeb0783",
      traffic: true,
    }) as unknown as mapboxgl.Map;

    mapRef.current.on("load", () => {
      if (isDesktop) {
        setShowNearbyGyms(true); // Hide the nearby gyms when not on a desktop
      }

      createUserMarker(userLat, userLon);

      setLoading(false); // Hide loading when map loads

      fetchNearbyGyms(userLat, userLon)
        .then((data) => {
          if (Array.isArray(data)) {
            if (!isDesktop) {
              setShowNearbyGyms(false); // Hide the nearby gyms when not on a desktop
            }else{
              setShowNearbyGyms(true);
            }
            if (data.length === 0 && default_loc) {
              setShowNoGymsModal(true);
            }
            else{
              setGyms(data);
              addMarkersToMap(data);
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
      const defaultLat = 35.727785; // Tehran
      const defaultLon = 51.367974;
      

      // Initialize the map immediately with default coordinates
      // initializeMap(defaultLat, defaultLon);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            initializeMap(userLat, userLon,true);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationDenied(true); // Show the location denied box
            const defaultLat = 35.727785; // Tehran
            const defaultLon = 51.367974;
            initializeMap(defaultLat, defaultLon,false);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLocationDenied(true); // Show the location denied box

        initializeMap(defaultLat, defaultLon,true);
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
  
    if (map) {
      map.on("click", async (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
        const { lat, lng } = e.lngLat;
  
        const clickedElement = e.originalEvent.target as HTMLElement;
  
        // ❌ Ignore clicks on gym pins
        if (clickedElement.classList.contains("custom-marker")) return;
  
        createUserMarker(lat, lng);
  
       
        setSelectedLocation({ lat, lng });
  
        // Clear old gyms
        clearGymMarkers();
  
        // Load new gyms
        const nearbyGyms = await fetchNearbyGyms(lat, lng);
        if (Array.isArray(nearbyGyms)) {
          setGyms(nearbyGyms);
          addMarkersToMap(nearbyGyms);
          if (isDesktop) {
            setShowNearbyGyms(true);
          }
        } else {
          console.error("Invalid gym data format:", nearbyGyms);
        }
      });
    }
  };
  

  const createUserMarker = (lat: number, lon: number) => {
    // Remove old marker
    if (userMarkerRef.current) {
      console.log("Removing previous marker...");
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  
    const markerElement = document.createElement("div");
    markerElement.className = "marker";
    markerElement.style.backgroundImage = `url(/icons/mylocation.svg)`;
    markerElement.style.backgroundSize = "contain";
    markerElement.style.width = "50px";
    markerElement.style.height = "50px";
  
    const marker = new mapboxgl.Marker(markerElement)
      .setLngLat([lon, lat])
      .addTo(mapRef.current!);
  
    console.log("New marker added at:", lat, lon);
  
    userMarkerRef.current = marker;
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
      el.style.width = i === index ? "30px" : "32px";
      el.style.height = i === index ? "30px" : "32px";
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
    markerElement.style.width = "32px";
    markerElement.style.height = "32px";
    markerElement.style.cursor = "pointer";

    // ✅ Create text container (popup)
    const popupElement = document.createElement("div");
    popupElement.innerHTML = `<h3>${gym.name}</h3>`;
    popupElement.className = "gym-popup";

    // ✅ Style for popup

    popupElement.style.position = "absolute";
  

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
            top: 33,
            left: isMobile ? "auto" : "50%",
            right: isMobile ? 10 : "auto",
            transform: isMobile ? "none" : "translateX(-50%)",
            bgcolor: "#fff",
            borderRadius: "8px",
            p: 1,
            // border: "2px solid #ff9100", // ✅ Added border color
            zIndex: 200,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", // ✅ Soft shadow
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: "12px",
            maxWidth: isMobile ? "300px" : "620px", // ✅ Smaller on mobile, normal on desktop
            whiteSpace: "nowrap",
            overflow: "hidden",
            flexWrap: isMobile ? "wrap" : "nowrap", // Enable wrapping for mobile
          }}
        >
          <Typography variant="caption" sx={{ flexShrink: 0 }}>
            دسترسی به موقعیت‌یابی را از تنظیمات مرورگر خود فعال کنید
          </Typography>
          
          <Button
            variant="outlined" // Border added to the button
            onClick={() => setLocationDenied(false)}
            size="small"
            sx={{
              fontSize: "12px",
              p: "1px 4px",
              minWidth: "auto",
              width: isMobile ? "100%" : "auto", // Full width on mobile
              borderColor: "#ff9100", // Border color
              fontWeight: "bold", // Make the text bold
              color: "#000449", // Custom text color
            }}
          >
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
                bgcolor: "#000449", // Primary blue
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
        top: 30,
        position: "absolute",
        bgcolor: "#fff",
        zIndex: 1,
        border: "2px solid #ff9100;",
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
            sx={{ color: "#00044", borderColor: "#00044" }} // Custom color with sx
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

    <Box
      sx={{
        position: "fixed",
        bottom: isDesktop ? 80 : "unset",
        top: !isDesktop ? 80 : "unset",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        width: "230px", // Fixed width
        px: 0,
        py: 0,
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          bgcolor: "#000449",
          color: "white",
          px: 0.5,
          py: 1.0,
          textAlign: "center",
          fontSize: "13px", // Fixed font size
          boxShadow: 3,
          borderTopLeftRadius: isDesktop ? "300px" : 0,
          borderTopRightRadius: isDesktop ? "300px" : 0,
          borderBottomLeftRadius: isDesktop ? 0 : "300px",
          borderBottomRightRadius: isDesktop ? 0 : "300px",
          width: "100%",
        }}
      >
          نزدیک محل مورد نظرت کلیک کن
      </Box>
    </Box>






  
      <Fab
        sx={{
          position: "absolute",
          top: 40,
          left: 15, // Adjust position if needed
          display: { xs: "flex", md: "flex" },
          color: "#fff",
          bgcolor: "#000449!important",
          borderRadius: "50%", // Ensures a circular shape
          width: 48, // Standard FAB size
          height: 48, // Standard FAB size
          minWidth: 0, // Prevents unwanted stretching
        }}
        onClick={() => setOpen(true)}
      >
        <img src="/icons/credits.svg" alt="Credits" style={{ width: "60px", height: "60px" }} />
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


      {showNoGymsModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4">باشگاه‌ ورزشی پیدا نشد!</h2>
            <p className="mb-6">
              در موقعیت فعلی شما باشگاهی ثبت نشده است.
              <br />
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setTimeout(() => {
                    setShowNoGymsModal(false);
                  }, 1000); // 1000ms = 1 second
                  initializeMap(defaultLocations.tehran.lat, defaultLocations.tehran.lon, false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                مشاهده باشگاه‌های تهران
              </button>
            </div>
          </div>
        </div>
      )}
      {!showNearbyGyms && (
        <Fab
          sx={{
            position: 'fixed', // Stays visible when scrolling
            bottom: 70, // Position higher on page
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
              stroke="#000449"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 30L25 15L45 30"
              stroke="#000449"
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
        sx={{ width: "100%", height: "calc(100vh - 64px)" }} // Assuming your Search is ~64px tall
        ref={mapContainerRef}
      />
    </Box>
  );
};

export default Mapp;
