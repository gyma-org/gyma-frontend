import React from "react";
import { Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Search from "../Search";
import FloatCard from "../FloatCard";

const Favorite = () => {
  return (
    <Grid mx="auto" sx={{ p: 1, direction: "rtl" }}>
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
        sx={{ maxWidth: 1050, mx: "auto", my: { xs: 13, md: 16 }, justifyContent: "start" }}
        container
        spacing={3}>
        <FloatCard />
        <FloatCard />
        <FloatCard />
        <FloatCard />
        <FloatCard />
        <FloatCard />
        <FloatCard />
        <FloatCard />
        <FloatCard />
        <FloatCard />
        <FloatCard />
      </Grid>
    </Grid>
  );
};

export default Favorite;
