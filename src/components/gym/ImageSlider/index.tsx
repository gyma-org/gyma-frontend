import React from "react";
import Grid from "@mui/material/Grid2";
import { CardMedia } from "@mui/material";

const ImageSlider = () => {
  return (
    <Grid
      size={{ xs: 12, md: 6 }}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        borderRadius: { xs: 0, md: 8 },
        overflow: "hidden",
      }}>
      <CardMedia
        component="img"
        sx={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
        image="https://placehold.co/600x400"
        title="place holder"
      />
    </Grid>
  );
};

export default ImageSlider;
