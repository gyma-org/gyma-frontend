"use client"; // Ensure this is a client component
import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css"; // Important for correct rendering

// Dynamically import the map-related components with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
import L from "leaflet";

// Custom marker icon for the map
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

interface AddressProps {
  location: string;
  lat: number;
  lon: number;
}

const Address: React.FC<AddressProps> = ({ location, lat, lon }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensures the window object is only accessed on the client side
    setIsClient(true);
  }, []);

  // Function to open Google Maps
  const openMaps = () => {
    if (isClient) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
      window.open(url, "_blank");
    }
  };

  // Memoized map to prevent unnecessary re-renders
  const mapElement = useMemo(
    () => (
      <Box
        onClick={openMaps} // ✅ Clicking the map will open Google Maps
        sx={{
          cursor: "pointer", // Show pointer to indicate clickability
          height: "60vh",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <MapContainer
          center={[lat, lon]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lon]} icon={customIcon}>
            <Popup>{location}</Popup>
          </Marker>
        </MapContainer>
        {/* Clickable Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
        />
      </Box>
    ),
    [lat, lon, location, isClient]
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "800px",
        mx: "auto",
        mt: 3,
        p: 2,
        borderRadius: "12px",
        bgcolor: "white",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
        📍 {location}
      </Typography>
      {mapElement}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2, p: 1.5, fontSize: "16px", borderRadius: "8px" }}
        onClick={openMaps} // ✅ Clicking the button also opens navigation
      >
        بزن بریم! 🚗
      </Button>
    </Box>
  );
};

export default Address;
