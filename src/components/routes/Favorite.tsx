import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Search from "../Search";
import FloatCard from "../FloatCard";
import { API_BASE_URL } from "@/config";
import { listGyms } from "../../api/gymList";
import { GymListResponse } from "../../types/gymList";
import Link from "next/link";
import { Loading } from "../Loading";

const GALLERY_BASE_URL = `${API_BASE_URL}/medias/media/gallery/`;
const PROFILE_BASE_URL = `${API_BASE_URL}/medias/profile/`;

const Favorite = () => {
  const [gyms, setGyms] = useState<GymListResponse[]>([]); // State to store the list of gyms
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const data = await listGyms(); // Call the API function
        setGyms(data); // Update state with the fetched gyms
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Set the error message
        } else {
          setError("An unknown error occurred"); // Fallback for unknown errors
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchGyms(); // Fetch gyms on component mount
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  const handleGymClick = (gym_id: number) => {
    // Navigate to the gym details page
    window.location.href = `/gyms/${gym_id}`;
  };

  return (
    <Grid
      mx="auto"
      sx={{ p: 1, direction: "rtl" }}>
      {/* Search component */}
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
        {gyms.map((gym) => (
          <FloatCard
            key={gym.id}
            name={gym.name}
            address={gym.address}
            city={gym.city}
            profile={gym.profile ? `${gym.profile}` : undefined}
            onClick={() => handleGymClick(gym.id)}
          />
        ))}
      </Grid>
    </Grid>
  );
};

export default Favorite;
