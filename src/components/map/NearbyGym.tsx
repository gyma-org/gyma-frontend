import React, { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import FloatCard from "../FloatCard";
import { Gym } from "@/api/gymMap";
import GymPreview from "../GymPreview";

export default function NearbyGyms({
  gyms,
  gymPreview,
  handleGymClick,
  handleBack,
}: {
  gyms: any[];
  gymPreview: Gym | null;
  handleGymClick: (gym: Gym) => void;
  handleBack: () => void;
}) {
  const [dialogHeight, setDialogHeight] = useState(14);
  const startY = useRef(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const touchMoveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = () => {
    setDialogHeight(14);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    startY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const currentY = event.touches[0].clientY;
    const diffY = startY.current - currentY;

    if (touchMoveTimeout.current) return;

    touchMoveTimeout.current = setTimeout(() => {
      if (diffY > 200 && !isFullScreen) {
        setDialogHeight(100);
        setIsFullScreen(true);
      } else if (diffY > 50 && !isFullScreen) {
        setDialogHeight(dialogHeight === 65 ? 100 : 65);
      } else if (diffY < -50) {
        if (dialogHeight === 100) {
          setDialogHeight(65);
          setIsFullScreen(false);
        } else {
          setDialogHeight(15);
        }
      }
      touchMoveTimeout.current = null;
    }, 100);
  };

  return (
    <>
      <Box
        sx={{
          zIndex: 1000,
          position: "fixed",
          bottom: 0,
          right: 0,
          left: 0,
          margin: 0,
          backgroundColor: "white",
          height: { xs: `${dialogHeight}vh`, md: 0 },
          borderTopLeftRadius: dialogHeight <= 65 ? 24 : 0,
          borderTopRightRadius: dialogHeight <= 65 ? 24 : 0,
          transition: "height 0.3s ease",
          boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
        }}>
        <div
          style={{
            cursor: "grab",
            touchAction: "none",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}>
          <Box
            sx={{
              height: 5,
              borderRadius: 5,
              mt: 1.5,
              mb: 1,
              width: 40,
              mx: "auto",
              bgcolor: "#88f",
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              gap: 1,
            }}
          />
          <Box px={2}>
            {gymPreview ? (
              <GymPreview
                handleBack={handleBack}
                gym={gymPreview}
                maxWidth={360}
              />
            ) : (
              <>
                <Typography align="center">{"باشگاه های نزدیک"}</Typography>
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
                  />
                ))}
              </>
            )}
          </Box>
        </div>
      </Box>
    </>
  );
}
