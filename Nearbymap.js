import { useEffect, useRef } from "react";
import mapboxgl, { Marker } from "mapbox-gl";

interface Gym {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      // Initialize Mapbox map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        zoom: 12,
        center: [51.392173, 35.730954],
        accessToken: "your-mapbox-access-token",
      });

      mapRef.current.on("load", () => {
        // Locate the user and fetch nearby gyms when the map is loaded
        locateUser();
      });
    }
  }, []);

  // Get user location
  const locateUser = () => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        // Set the map center to the user's location
        mapRef.current?.setCenter([longitude, latitude]);

        // Fetch nearby gyms based on user's location
        fetchGymsNearby(longitude, latitude);
      },
      (error: GeolocationPositionError) => console.error("Error getting user location: ", error)
    );
  };

  // Fetch nearby gyms from the backend
  const fetchGymsNearby = (longitude: number, latitude: number) => {
    fetch(`/api/gyms?lon=${longitude}&lat=${latitude}&radius=5`)
      .then((response) => response.json())
      .then((gyms: Gym[]) => {
        // Add gyms as markers on the map
        displayGymsOnMap(gyms);
      })
      .catch((error) => console.error("Error fetching gyms:", error));
  };

  // Display gyms on the map as markers
  const displayGymsOnMap = (gyms: Gym[]) => {
    gyms.forEach((gym) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([gym.longitude, gym.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(`<h3>${gym.name}</h3><p>${gym.address}</p>`)
        ) // Add popup to show gym info
        .addTo(mapRef.current!);
    });
  };

  return <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />;
};

export default Map;
