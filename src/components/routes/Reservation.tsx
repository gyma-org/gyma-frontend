import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Search from "../Search";
import ReservationCard from "../ReservationCard";

const Reservation = () => {
  return (
    <Grid
      mx="auto"
      sx={{ p: 1, direction: "rtl" }}>
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
      <Typography
        variant="h6"
        mt={12}
        mb={2}
        sx={{
          mr: { xs: 0, md: 5 },
        }}>
        {"رزرو های فعال"}
      </Typography>
      <Grid
        container
        maxWidth={1400}
        sx={{
          mx: "auto",
          justifyContent: { xs: "center", md: "space-between" },
        }}>
        <ReservationCard />
      </Grid>
      <Typography
        variant="h6"
        mt={3}
        mb={1}
        sx={{
          mr: { xs: 0, md: 5 },
        }}>
        {"رزرو های گذشته"}
      </Typography>
      <Grid
        container
        maxWidth={1400}
        sx={{
          mb: 12,
          mx: "auto",
          justifyContent: { xs: "center", md: "space-between" },
        }}>
        <ReservationCard outdate={true} />
        <ReservationCard outdate={true} />
        <ReservationCard outdate={true} />
        <ReservationCard outdate={true} />
      </Grid>
    </Grid>
  );
};

export default Reservation;
