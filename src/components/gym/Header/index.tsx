"use client";

import { Box, Button, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { saveGym } from "@/api/SaveGym";
import { removeGym } from "@/api/RemoveGym";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  gymId: string;
}

const Header: React.FC<HeaderProps> = ({
  gymId
}) => {
  const { authTokens } = useAuth();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedGymIds = Cookies.get("savedGymIds");
    if (savedGymIds) {
      const gymIds: string[] = JSON.parse(savedGymIds);
      setIsSaved(gymIds.includes(gymId));
    }
  }, [gymId]);

  // Handle save/remove gym click
  const handleSaveClick = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    if (!authTokens || !authTokens.access) {
      console.warn("No authentication token available");
      return;
    }

    try {
      const savedGymIds = Cookies.get("savedGymIds") || "[]";
      let gymIds: string[] = JSON.parse(savedGymIds);

      if (isSaved) {
        // Remove gym
        await removeGym(gymId, authTokens.access);
        gymIds = gymIds.filter((id) => id !== gymId);
      } else {
        // Save gym
        await saveGym(gymId, authTokens.access);
        gymIds.push(gymId);
      }

      // Update cookies and state
      Cookies.set("savedGymIds", JSON.stringify(gymIds), { expires: 7 });
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving/removing gym:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    window.location.href = "/";
  };

  return (
    <>
      <Grid
        size={12}
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "flex-end",
          p: 4,
        }}
      >
        <Button
          variant="contained"
          sx={{ borderRadius: "16px", bgcolor: "#F95A00" }}
          dir="rtl"
          onClick={handleBackClick}  // onClick handler will work now
        >
          <Typography variant="h6">{"بازگشت"}</Typography>
          <svg width="32" height="32" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.5 22.5L6.08579 21.0858L4.67157 22.5L6.08579 23.9142L7.5 22.5ZM35.625 24.5C36.7296 24.5 37.625 23.6046 37.625 22.5C37.625 21.3954 36.7296 20.5 35.625 20.5V24.5ZM17.3358 9.83579L6.08579 21.0858L8.91421 23.9142L20.1642 12.6642L17.3358 9.83579ZM6.08579 23.9142L17.3358 35.1642L20.1642 32.3358L8.91421 21.0858L6.08579 23.9142ZM7.5 24.5H35.625V20.5H7.5V24.5Z"
              fill="white"
            />
          </svg>
        </Button>
      </Grid>
      <Box
        sx={{
          top: 15,
          right: 15,
          left: 15,
          zIndex: 5,
          position: "absolute",
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
        }}
      >
        {/* Save Button */}
        <IconButton
          sx={{ bgcolor: "#41414140" }}
          onClick={handleSaveClick}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill={isSaved ? "orange" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.33325 12C5.33325 8.22876 5.33325 6.34315 6.50483 5.17157C7.6764 4 9.56201 4 13.3333 4H18.6666C22.4378 4 24.3234 4 25.495 5.17157C26.6666 6.34315 26.6666 8.22876 26.6666 12V21.1035C26.6666 24.6812 26.6666 26.47 25.5409 27.0172C24.4151 27.5644 23.0086 26.4592 20.1953 24.2488L19.295 23.5413C17.7131 22.2985 16.9222 21.6771 15.9999 21.6771C15.0777 21.6771 14.2867 22.2985 12.7049 23.5413L11.8045 24.2488C8.99132 26.4592 7.58471 27.5644 6.45897 27.0172C5.33325 26.47 5.33325 24.6812 5.33325 21.1035V12Z"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </IconButton>
        <IconButton 
        sx={{ bgcolor: "#41414140" }}
        onClick={handleBackClick} 
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 8L8 24"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 8L24 24"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      </Box>
    </>
  );
};

export default Header;
