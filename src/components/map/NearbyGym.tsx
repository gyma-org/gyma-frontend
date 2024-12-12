import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { NearMe } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

export default function NearbyGyms() {
  const [open, setOpen] = useState(false);
  const [dialogHeight, setDialogHeight] = useState("50vh");
  const startY = useRef(0);
  const isFullScreen = dialogHeight === "100vh";

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDialogHeight("50vh");
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    startY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const currentY = event.touches[0].clientY;
    const diffY = startY.current - currentY;

    if (diffY > 50 && !isFullScreen) {
      setDialogHeight("100vh");
    } else if (diffY < -50 && isFullScreen) {
      setDialogHeight("50vh");
    } else if (diffY < -100 && !isFullScreen) {
      handleClose();
    }
  };

  return (
    <div>
      <IconButton
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          bottom: 100,
          right: 16,
          zIndex: 9,
          bgcolor: "#fff",
          boxShadow: "0px 0px 5px #00000040",
        }}
        color="primary"
        onClick={handleClickOpen}>
        <Typography>{"باشگاه های اطراف"}</Typography>
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        PaperProps={{
          sx: {
            position: "fixed",
            bottom: 0,
            margin: 0,
            width: "100%",
            maxWidth: "100%",
            height: dialogHeight,
            borderTopLeftRadius: dialogHeight === "50vh" ? 24 : 0,
            borderTopRightRadius: dialogHeight === "50vh" ? 24 : 0,
            transition: "height 0.3s ease",
          },
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
              width: 40,
              mx: "auto",
              bgcolor: "#88f",
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
            }}
          />
        </div>
      </Dialog>
    </div>
  );
}
