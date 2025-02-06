import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Search from "../Search";
import FloatCard from "../FloatCard";
import { API_BASE_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { getSavedGyms } from "../../api/DisplaySavedGyms";
import { GymListResponse } from "../../types/gymList";
import { Loading } from "../Loading";
import { getGymDetails } from "../../api/gymDetails";
import { GymDetails } from "../../types/gymDetails";
import Cookies from "js-cookie";

const GALLERY_BASE_URL = `${API_BASE_URL}/medias/media/gallery/`;
const PROFILE_BASE_URL = `${API_BASE_URL}/medias/profile/`;

const Favorite = () => {
  const { authTokens, logoutUser } = useAuth();
  const [gyms, setGyms] = useState<GymListResponse[]>([]); // State to store the list of gyms
  const [gymDetails, setGymDetails] = useState<Map<string, GymDetails>>(new Map()); // Map for gym details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchGymsFromCookies = () => {
      const savedGymIds = Cookies.get("savedGymIds"); // Get saved gym IDs from cookies

      if (savedGymIds) {
        const gymIds = JSON.parse(savedGymIds);
        if (gymIds.length === 0) {
          setLoading(false); // No gyms in cookies, stop loading
          return;
        }
        // If gym IDs exist in cookies, use them directly
        // const gymIds = JSON.parse(savedGymIds);

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
      if (!authTokens || !authTokens.access) {
        logoutUser
        console.warn("No authentication token available");
        return;
      }
      try {
        const data = await getSavedGyms(authTokens.access, logoutUser); // Fetch saved gyms from API
        const gymIds = data.map((gym) => gym.gym_id.toString()); // Extract gym IDs

        // Save gym IDs to cookies
        Cookies.set("savedGymIds", JSON.stringify(gymIds), { expires: 7 }); // Set a 7-day expiration

        setGyms(data); // Update state with the fetched gyms

        if (data.length === 0) {
          setLoading(false); // No gyms fetched, stop loading
          return;
        }

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
  }, [authTokens, logoutUser]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  if (gyms.length === 0) {
    // Display this message if there are no gyms
    return (
      <Box
        mx="auto"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          {"شما هنوز هیچ باشگاهی به علاقه‌مندی‌های خود اضافه نکرده‌اید."}
        </Typography>
      </Box>
    );
  }

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
            price={details?.price || 0}
            profile={details?.profile ? `${details.profile}` : undefined}
            onClick={() => handleGymClick(gym.gym_id)}
            gymId={gym.gym_id}
            rate={details?.rate || null}
          />
          );
        })}
      </Grid>
    </Grid>
  );
};

export default Favorite;
