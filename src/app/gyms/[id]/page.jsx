import React from "react";

import { Box, Button, CardMedia, Container, Rating, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Address, Comments, Description, GYMHeader, ImageSlider, Specifications } from "@/components/gym";

const GymPage = () => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        direction: "rtl",
        p: { xs: 0, md: 2 },
        bgcolor: "#f3f3f3",
        minHeight: "100vh",
        pb: 8,
      }}>
      <GYMHeader />
      <ImageSlider />
      <Specifications />
      <Description />
      <Address />
      <Comments />
    </Grid>
  );
};

export default GymPage;
