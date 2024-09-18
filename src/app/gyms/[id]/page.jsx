import React from "react";

import { Box, Button, CardMedia, Container, Rating, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Address, Comments, Description, GYMHeader, ImageSlider, Specifications } from "@/components/gym";

const GymPage = () => {
  return (
    <Box sx={{ bgcolor: "#f3f3f3", minHeight: "100vh", pb: 8 }}>
      <Container
        sx={{
          p: { xs: 0, md: 2 },
        }}>
        <Grid
          container
          spacing={2}
          sx={{
            direction: "rtl",
          }}>
          {/* Header */}
          <GYMHeader />

          {/* Image Slider */}
          <ImageSlider />

          {/* Specifications */}
          <Specifications />

          {/* Description */}
          <Description />

          {/* Address */}
          <Address />

          {/* Comments */}
          <Comments />
        </Grid>
      </Container>
    </Box>
  );
};

export default GymPage;
