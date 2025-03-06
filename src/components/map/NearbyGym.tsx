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
  onClose={() => setShowNearbyGyms(false)}
  onOpen={() => setShowNearbyGyms(true)}
  sx={{
    transform: "translateZ(0)", 
    WebkitTransform: "translateZ(0)", // Safari fix
  }}
  disableBackdropTransition={isDesktop} // Disable transition effect for backdrop
  ModalProps={{
    BackdropProps: {
      style: {
        backgroundColor: isDesktop ? "transparent" : "rgba(0, 0, 0, 0.5)", // No darkening on desktop
      },
    },
  }}
>
  <Box
    sx={{
      display: { xs: "block", md: "none" },
      p: 2,
      textAlign: "center",
      boxSizing: "border-box", // Ensure proper box sizing
    }}
  >
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
        display: 'flex',
        justifyContent: 'space-between', // Align the buttons to the sides
        alignItems: 'center',
        px: 2,
      }}
    >
      <Box sx={{ opacity: 0 }}>بستن</Box>
      <Typography sx={{ flexGrow: 1, textAlign: 'center' }}>
        باشگاه های نزدیک
      </Typography>
      <Box
        sx={{ cursor: 'pointer', textAlign: 'right' }}
        onClick={() => setShowNearbyGyms(false)}
      >
        بستن <KeyboardDoubleArrowDown />
      </Box>
    </Box>
    ) : null}

    <Box sx={{
      overflowY: "auto", 
      maxHeight: "75vh", 
      pb: 8, 
      WebkitOverflowScrolling: "touch",
      boxSizing: "border-box",
    }}>
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
            width="100%"  // Ensure proper sizing
            rate={gym.rate}
          />
        ))
      )}
    </Box>
  </Box>
</SwipeableDrawer>

  );
}
