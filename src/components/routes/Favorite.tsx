import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import Search from "../Search";
import FloatCard from "../FloatCard";
import { API_BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { getSavedGyms } from "../../api/DisplaySavedGyms";
import { GymListResponse } from "../../types/gymList";
import { getGymDetails } from "../../api/gymDetails";
import { GymDetails } from "../../types/gymDetails";
import Cookies from "js-cookie";

const Favorite = () => {
  const { authTokens } = useAuth();
  const [gyms, setGyms] = useState<GymListResponse[]>([]); // State to store the list of gyms
  const [gymDetails, setGymDetails] = useState<Map<string, GymDetails>>(new Map()); // Map for gym details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchGymsFromCookies = () => {
      const savedGymIds = Cookies.get("savedGymIds"); // Get saved gym IDs from cookies

      if (savedGymIds) {
        // If gym IDs exist in cookies, use them directly
        const gymIds = JSON.parse(savedGymIds);
        const gymsFromCookie = gymIds.map((gym_id: string) => ({ gym_id })); // Create gym objects from IDs

        setGyms(gymsFromCookie); // Set gyms state with the IDs from cookies
        let fetchedDetailsCount = 0; // Track the number of gym details fetched

        // Fetch details for each gym ID
        gymIds.forEach((gym_id: string) => {
          getGymDetails(gym_id)
            .then((details) => {
              if (details) {
                setGymDetails((prev) => new Map(prev.set(gym_id, details))); // Save gym details
              }
              fetchedDetailsCount++;
              if (fetchedDetailsCount === gymIds.length) {
                setLoading(false); // All details are fetched, stop loading
              }
            })
            .catch((error) => {
              console.error(`Failed to fetch details for gym ID ${gym_id}:`, error);
              fetchedDetailsCount++;
              if (fetchedDetailsCount === gymIds.length) {
                setLoading(false); // All details are fetched (even if some failed)
              }
            });
        });
      } else {
        // If no gym IDs in cookies, fetch from the API
        fetchFavouriteGyms();
      }
    };

    const fetchFavouriteGyms = async () => {
      try {
        const data = await getSavedGyms(authTokens.access); // Fetch saved gyms from API
        const gymIds = data.map((gym) => gym.gym_id.toString()); // Extract gym IDs

        // Save gym IDs to cookies
        Cookies.set("savedGymIds", JSON.stringify(gymIds), { expires: 7 }); // Set a 7-day expiration

        setGyms(data); // Update state with the fetched gyms
        let fetchedDetailsCount = 0; // Track the number of gym details fetched

        // Fetch details for each gym
        gymIds.forEach((gym_id: string) => {
          getGymDetails(gym_id)
            .then((details) => {
              if (details) {
                setGymDetails((prev) => new Map(prev.set(gym_id, details))); // Save gym details
              }
              fetchedDetailsCount++;
              if (fetchedDetailsCount === gymIds.length) {
                setLoading(false); // All details are fetched, stop loading
              }
            })
            .catch((error) => {
              console.error(`Failed to fetch details for gym ID ${gym_id}:`, error);
              fetchedDetailsCount++;
              if (fetchedDetailsCount === gymIds.length) {
                setLoading(false); // All details are fetched (even if some failed)
              }
            });
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Handle error
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false); // Stop loading if there's an error or the data is fetched
      }
    };

    fetchGymsFromCookies(); // Check for gyms in cookies and fetch accordingly
  }, [authTokens.access]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleGymClick = (gym_id: string) => {
    window.location.href = `/gyms/${gym_id}`;
  };

  return (
    <Grid
      mx="auto"
      sx={{ p: 1, direction: "rtl" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 9,
          py: 2,
          px: { xs: 1, md: 10, lg: 15 },
          bgcolor: "#fff",
          justifyContent: "start",
          mx: "auto",
          boxShadow: "0px 0px 5px #00000040",
        }}>
        <Search />
      </Box>

      <Grid
        sx={{ maxWidth: 1050, mx: "auto", mt: { xs: 12, md: 16 }, justifyContent: "start" }}
        container
        spacing={3}>
        {gyms.map((gym) => {
          const details = gymDetails.get(gym.gym_id); // Get the gym details for each gym
          return (
            <FloatCard
            key={gym.gym_id} // Use gym.gym_id as the fallback key
            name={details?.name || "Unknown Gym"}
            address={details?.address || "Address not available"}
            city={details?.city || "City not specified"}
            profile={details?.profile ? `${details.profile}` : undefined}
            onClick={() => handleGymClick(gym.gym_id)}
          />
          );
        })}
      </Grid>
    </Grid>
  );
};

export default Favorite;
