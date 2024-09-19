import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
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
          px: 1,
          bgcolor: "#fff",
          justifyContent: "start",
          maxWidth: 1000,
          mx: "auto",
          boxShadow: "0px 0px 5px #00000040",
        }}>
        <Search />
      </Box>
      <Grid
        sx={{
          mt: 12,
        }}>
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
