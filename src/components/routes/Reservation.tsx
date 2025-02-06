import React, { useState, useEffect } from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAuth } from "@/context/AuthContext";
import { getBookingList } from "@/api/Booked";
import { booked } from "@/types/booked";
import Search from "../Search";
import ReservationCard from "../ReservationCard";
import { Loading } from "../Loading";

const Reservation = () => {
  const [showOutDate, setShowOutDate] = useState(false);
  const [currentBookings, setCurrentBookings] = useState<booked[]>([]);
  const [pastBookings, setPastBookings] = useState<booked[]>([]);
  const [loading, setLoading] = useState(true);
  const { authTokens, logoutUser } = useAuth();
  const [openFilter, setOpenFilter] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!authTokens) {
          console.error("Auth tokens are null. Cannot fetch bookings.");
          return;
        }

        setLoading(true);
        const data = await getBookingList(authTokens.access, logoutUser);

        const current = data.current_bookings.filter(booking => !booking.used);
        const past = [...data.past_bookings, ...data.current_bookings.filter(booking => booking.used)];

        setCurrentBookings(current);
        setPastBookings(past);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authTokens, logoutUser]);

  if (loading) return <Loading />;

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
          pt: 2,
          px: { xs: 1, md: 10, lg: 15 },
          bgcolor: "#fff",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          gap: 2,
          pb: 2,
          mx: "auto",
          boxShadow: "0px 0px 5px #00000040",
        }}>
        <Search />
        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            bgcolor: "#B9B9B952",
            boxShadow: "0px 0px 3px #00000040",
            my: 1,
            gap: 2,
          }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect
              x="3.33333"
              y="3.33331"
              width="5"
              height="5"
              rx="1"
              stroke="#33363F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect
              x="3.33333"
              y="11.6667"
              width="5"
              height="5"
              rx="1"
              stroke="#33363F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect
              x="11.6667"
              y="11.6667"
              width="5"
              height="5"
              rx="1"
              stroke="#33363F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <rect
              x="11.6667"
              y="3.33331"
              width="5"
              height="5"
              rx="1"
              stroke="#33363F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          <Typography sx={{ color: "#33363F" }}>{"فیلتر ها"}</Typography>
        </Button>
      </Box>
      <Box
        mt={16}
        display="flex"
        alignItems="center">
        <Checkbox
          value={showOutDate}
          onChange={(e) => setShowOutDate(e.target.checked)}
          sx={{
            color: "#F95A00",
            "&.Mui-checked": {
              color: "#F95A00",
            },
          }}
        />
        <Typography sx={{ fontWeight: 700 }}>{"نمایش رزرو های گذشته"}</Typography>
      </Box>
      <Typography
        variant="h6"
        mt={1}
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
          justifyContent: { xs: "center", md: "start" },
          gap: 3,
        }}>
        {/* Map through currentBookings and pass each booking to ReservationCard */}
        {currentBookings.map((booking) => (
          <ReservationCard
            key={booking.confirmation_code}
            booking={booking}
          />
        ))}
      </Grid>
      {showOutDate && (
        <>
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
            {/* Map through pastBookings and pass each booking to ReservationCard */}
            {pastBookings.map((booking) => (
              <ReservationCard
                key={booking.confirmation_code}
                booking={booking}
                outdate={true}
              />
            ))}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Reservation;
