import React, { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FloatCard from "../FloatCard";
import { Gym } from "@/api/gymMap";
import GymPreview from "../GymPreview";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";

export default function NearbyGyms({
  gyms,
  gymPreview,
  handleGymClick,
  handleBack,
  showNearbyGyms,
  setShowNearbyGyms,
  onBack
}: {
  gyms: any[];
  gymPreview: Gym | null;
  handleGymClick: (gym: Gym) => void;
  handleBack: () => void;
  showNearbyGyms: boolean;
  setShowNearbyGyms: (value: boolean) => void;
  onBack: () => void;
}) {
  const [dialogHeight, setDialogHeight] = useState(0);
  const startY = useRef(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const touchMoveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = () => {
    setDialogHeight(0);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    startY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const currentY = event.touches[0].clientY;
    const diffY = startY.current - currentY;

    if (touchMoveTimeout.current) return;

    touchMoveTimeout.current = setTimeout(() => {
      const minHeight = window.innerHeight <= 720 ? 45 : 37; // Adjust for iPhone SE
      if (diffY > 200 && !isFullScreen) {
        setDialogHeight(100);
        setIsFullScreen(true);
      } else if (diffY > minHeight && !isFullScreen) {
        setDialogHeight(dialogHeight === minHeight ? 100 : minHeight);
      } else if (diffY < -minHeight) {
        if (dialogHeight === 100) {
          setDialogHeight(minHeight);
          setIsFullScreen(false);
        } else {
          setShowNearbyGyms(false);
        }
      }
      touchMoveTimeout.current = null;
    }, 100);
  };

  useEffect(() => {
    setDialogHeight(showNearbyGyms ? (window.innerHeight <= 720 ? 45 : 37) : 0);
  }, [showNearbyGyms]);

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
          height: { xs: `${dialogHeight}%`, md: 0 },
          borderTopLeftRadius: dialogHeight <= (window.innerHeight <= 720 ? 45 : 37) ? 24 : 0,
          borderTopRightRadius: dialogHeight <= (window.innerHeight <= 720 ? 45 : 37) ? 24 : 0,
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
          {!gymPreview ? (
            <Box
              display="flex"
              px={2}>
              <Box
                flexGrow={1}
                sx={{
                  opacity: 0,
                }}>
                بستن
                <KeyboardDoubleArrowDown />
              </Box>
              <Typography
                flexGrow={1}
                align="center">
                {"باشگاه های نزدیک"}
              </Typography>
              <Box
                flexGrow={1}
                onClick={() => setShowNearbyGyms(false)}
                style={{ cursor: "pointer", textAlign: "end" }}>
                بستن
                <KeyboardDoubleArrowDown />
              </Box>
            </Box>
          ) : null}
        </div>
        <Box
          sx={{
            overflowY: "auto",
            height: "calc(100% - 50px)",
            transition: "height 0.3s ease",
            pb: 8,
          }}>
          {gymPreview ? (
            <GymPreview
              handleBack={handleBack}
              gym={gymPreview}
              maxWidth={360}
              onBack={onBack}
            />
          ) : (
            <>
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
                  maxWidth={450}
                  rate={gym.rate}
                />
              ))}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
