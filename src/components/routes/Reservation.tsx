import React, { useState, useEffect } from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAuth } from "@/context/AuthContext";
import { getBookingList } from "@/api/Booked";
import { booked } from "@/types/booked";
import Search from "../Search";
import ReservationCard from "../ReservationCard";

const Reservation = () => {
  const [showOutDate, setShowOutDate] = useState(false);
  const [currentBookings, setCurrentBookings] = useState<booked[]>([]);
  const [pastBookings, setPastBookings] = useState<booked[]>([]);
  const [loading, setLoading] = useState(true);
  const { authTokens, logoutUser } = useAuth();

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
        setCurrentBookings(data.current_bookings);
        setPastBookings(data.past_bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authTokens, logoutUser]);

  if (loading) return <Typography>Loading...</Typography>;

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
          justifyContent: "start",
          mx: "auto",
          boxShadow: "0px 0px 5px #00000040",
        }}>
        <Search />
        <Button
          variant="contained"
          sx={{
            border: "1px solid #B9B9B9",
            borderRadius: 4,
            bgcolor: "#B9B9B952",
            my: 1,
            height: 30,
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
          <Typography sx={{ color: "#33363F" }}>{"فیلتر"}</Typography>
        </Button>
        <Button
          variant="contained"
          sx={{
            border: "1px solid #B9B9B9",
            borderRadius: 4,
            bgcolor: "#B9B9B952",
            my: 1,
            height: 30,
            gap: 2,
          }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect
              x="3"
              y="6"
              width="18"
              height="15"
              rx="2"
              stroke="#222222"
            />
            <path
              d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10H3Z"
              fill="#222222"
            />
            <path
              d="M7 3L7 6"
              stroke="#222222"
              stroke-linecap="round"
            />
            <path
              d="M17 3L17 6"
              stroke="#222222"
              stroke-linecap="round"
            />
            <rect
              x="7"
              y="12"
              width="4"
              height="2"
              rx="0.5"
              fill="#222222"
            />
            <rect
              x="7"
              y="16"
              width="4"
              height="2"
              rx="0.5"
              fill="#222222"
            />
            <rect
              x="13"
              y="12"
              width="4"
              height="2"
              rx="0.5"
              fill="#222222"
            />
            <rect
              x="13"
              y="16"
              width="4"
              height="2"
              rx="0.5"
              fill="#222222"
            />
          </svg>

          <Typography sx={{ color: "#33363F" }}>{"فیلتر"}</Typography>
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
