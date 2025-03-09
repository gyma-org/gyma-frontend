import React from "react";
import { SwipeableDrawer, Box, Typography, useMediaQuery } from "@mui/material";
import FloatCard from "../FloatCard";
import GymPreview from "../GymPreview";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";
import { Gym } from "@/api/gymMap"; // Ensure this import exists

export default function NearbyGyms({
  gyms,
  gymPreview,
  handleGymClick,
  handleBack,
  showNearbyGyms,
  setShowNearbyGyms,
  onBack,
}: {
  gyms: Gym[]; // Explicitly type the gyms array
  gymPreview: Gym | null;
  handleGymClick: (gym: Gym) => void;
  handleBack: () => void;
  showNearbyGyms: boolean;
  setShowNearbyGyms: (value: boolean) => void;
  onBack: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width:900px)"); // Hide on desktop

  return (
    <SwipeableDrawer
  anchor="bottom"
  open={showNearbyGyms}
  onClose={() => setShowNearbyGyms(false)} // Close only via internal actions
  onOpen={() => setShowNearbyGyms(true)}
  sx={{
    transform: "translateZ(0)",
    WebkitTransform: "translateZ(0)", // Safari fix
  }}
  disableEscapeKeyDown // Prevent closing via ESC key
  disableBackdropTransition // Remove animation for smoother behavior
  ModalProps={{
    BackdropProps: {
      style: {
        backgroundColor: "transparent", // Keeps background visible
      },
    },
    sx: {
      pointerEvents: "none", // Allows background to be interactive
    },
  }}
  PaperProps={{
    sx: {
      // height: "50vh",
      maxHeight: "50vh",
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      display: "flex",
      flexDirection: "column",
      pointerEvents: "auto", // Ensures drawer itself is still interactive
    },
  }}
>
  <Box
    sx={{
      display: { xs: "block", md: "none" },
      p: 2,
      textAlign: "center",
      boxSizing: "border-box",
    }}
  >
    {/* Handle Bar */}
    <Box
      sx={{
        width: 40,
        height: 5,
        borderRadius: 5,
        bgcolor: "#aaa",
        mx: "auto",
        my: 1,
      }}
    />

    {!gymPreview ? (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box sx={{ opacity: 0 }}>بستن</Box>
        <Typography sx={{ flexGrow: 1, textAlign: "center" }}>
          باشگاه های نزدیک
        </Typography>
        <Box
          sx={{ cursor: "pointer", textAlign: "right" }}
          onClick={() => setShowNearbyGyms(false)}
        >
          بستن <KeyboardDoubleArrowDown />
        </Box>
      </Box>
    ) : null}

    {/* Scrollable Content */}
    <Box
      sx={{
        overflowY: "auto",
        flexGrow: 1,
        pb: 8,
        WebkitOverflowScrolling: "touch",
        boxSizing: "border-box",
      }}
    >
      {gymPreview ? (
        <GymPreview handleBack={handleBack} gym={gymPreview} onBack={onBack} />
      ) : (
        gyms.map((gym: Gym) => (
          <FloatCard
            key={gym.gym_code}
            name={gym.name}
            address={gym.address}
            city={gym.city}
            profile={gym.profile}
            price={gym.price}
            gymId={gym.id}
            onClick={() => handleGymClick(gym)}
            maxWidth={450}
            width="100%"
            rate={gym.rate}
            min_price={gym.min_price}
          />
        ))
      )}
    </Box>
  </Box>
</SwipeableDrawer>

  );
}
