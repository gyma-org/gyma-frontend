import React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Search from "../Search";
import dynamic from "next/dynamic";

const Mapp = dynamic(() => import("@/components/map/index"), { ssr: false });

const Map = () => {
  return (
    <Grid
      mx="auto"
      sx={{ p: 1, direction: "rtl", height: "100%" }}>
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

      <Grid mt={12} sx={{height: "100%" }} >
        <Mapp />
      </Grid>
    </Grid>
  );
};

export default Map;
