import React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Search from "../Search";
import dynamic from "next/dynamic";

const Mapp = dynamic(() => import("@/components/map/index"), { ssr: false });

const Map = () => {
  const searchBarHeight = 64;

  return (
    <Box
      sx={{
        height: "100vh",
        direction: "rtl",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Search */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          py: 2,
          px: { xs: 1, md: 10, lg: 15 },
          bgcolor: "#fff",
          boxShadow: "0px 0px 5px #00000040",
        }}
      >
        <Search />
      </Box>

      {/* Map Wrapper */}
      <Box
        sx={{
          mt: `${searchBarHeight}px`,
          height: `calc(100vh - ${searchBarHeight}px)`,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Mapp />
      </Box>
    </Box>
  );
};

export default Map;
