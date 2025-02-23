"use client";

import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Button, Rating, Typography, Snackbar, Alert, Tabs, Tab, Grid2, Divider } from "@mui/material";
import ReservationModal from "@/components/ReservationModal";
import TimeSelector from "@/components/TimeSelector";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config";
import { bookGymSession } from "@/api/Booking";
import moment from "jalali-moment";
import { EditCalendarRounded } from "@mui/icons-material";
import { useSnackbar } from "notistack";

interface WorkingHours {
  off_days: { open: string; close: string };
  odd: { open: string; close: string };
  even: { open: string; close: string };
  odd_even: string;
}

interface SpecificationsProps {
  gymName: string;
  location: string;
  // rating: number;
  // attributes: string[];
  working_hours_men: WorkingHours;
  working_hours_women: WorkingHours;
  // price: number;
  features: string[];
  gymId: string;
  // sex: string;
  gymSex: string;
  rate: string;
}

const Specifications: React.FC<SpecificationsProps> = ({
  gymName,
  location,
  // rating,
  // attributes,
  working_hours_men,
  working_hours_women,
  // price,
  features,
  gymId,
  // sex
  rate,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [showReservationModal, setShowReservationModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(moment().format("jYYYY/jMM/jDD"));
  const [sessions, setSessions] = useState<any[]>([]);
  const { authTokens, logoutUser } = useAuth();

  // State for the temporarely Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [showGender, setShowGender] = useState(0);

  const today = new Date();
  const isOddDay = today.getDate() % 2 !== 0;

  const getWorkingHours = (workingHours: WorkingHours) => {
    if (workingHours.odd_even === "both") {
      return workingHours.odd; // Show "odd" hours if gym works on both days
    } else if (workingHours.odd_even === "odd" && isOddDay) {
      return workingHours.odd;
    } else if (workingHours.odd_even === "even" && !isOddDay) {
      return workingHours.even;
    } else {
      return null; // No working hours for today
    }
  };

  const fetchGymSessions = async (gymId: string, gymSex: string, date: string): Promise<any[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/schedules/get_schedule_for_next_60_days/?gym=${gymId}&date=${date}&sex=${gymSex}`
      );
      if (!response.ok) throw new Error("Failed to fetch gym sessions");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const [currentMonth, setCurrentMonth] = useState(moment().locale("fa"));

  useEffect(() => {
    // Convert Jalali month to Gregorian before sending the request
    const gregorianMonth = currentMonth.clone().locale("en").format("YYYY-MM-DD");
    fetchGymSessions(gymId, "men", gregorianMonth).then((responseSessions) => {
      // Convert response dates back to Jalali for display
      const jalaliSessions = responseSessions.map((session) => ({
        ...session,
        date: moment(session.date, "YYYY-MM-DD").locale("fa").format("jYYYY/jMM/jDD"),
      }));
      setSessions(jalaliSessions);
    });
  }, [gymId, currentMonth]);

  const availableTimeSlots = sessions
    .filter((session) => session.date === selectedDate)
    .map((session) => ({
      id: session.id,
      start_time: session.start_time,
      end_time: session.end_time,
      price: session.price,
    }));

  const handleSetTime = async (selectedTime: {
    id: number;
    start_time: string;
    end_time: string;
    price: number;
  }) => {
    if (!authTokens) {
      console.error("User is not authenticated.");
      logoutUser();
      return;
    }

    try {
      const result = await bookGymSession(selectedTime.id, authTokens.access, logoutUser);

      if (typeof result === "object" && result.redirect_url) {
        // Redirect the user
        window.open(result.redirect_url, "_blank");

        // Display success message
        enqueueSnackbar("رزرو با موفقیت انجام شد!", { variant: "success" });
        // setSnackbarSeverity("success");
        // setSnackbarMessage("Session booked successfully!");
      } else {
        // Handle unexpected response
        enqueueSnackbar("رزرو انجام نشد، دوباره تلاش کنید!", { variant: "error" });
        // setSnackbarSeverity("error");
        // setSnackbarMessage("Unexpected response. Please try again.");
        console.error("Unexpected response from bookGymSession:", result);
      }
    } catch (error: unknown) {
      console.error("Error booking gym session:", error);

      let errorMessage = "Failed to book session. Please try again."; // Default message

      // Check if the error is an instance of Error
      if (error instanceof Error) {
        errorMessage = error.message; // The message from the error (e.g., API message)
      }

      enqueueSnackbar("رزرو انجام نشد، دوباره تلاش کنید!", { variant: "error" });
      // setSnackbarSeverity("error");
      // setSnackbarMessage(errorMessage); // Set the message to be displayed in the Snackbar
    } finally {
      console.log("");
      // setOpenSnackbar(true); // Show the Snackbar
    }
  };

  return (
    <>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
        sx={{
          px: { xs: 2, md: 5 },
        }}>
        {/* Name */}
        <Typography
          noWrap
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: {
              xs: 28,
              sm: 28,
              md: 28,
              lg: 32,
            },
          }}>
          {gymName}
        </Typography>

        {/* Location */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between">
          <Box
            display="flex"
            gap={1}
            px={1}
            mt={1}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.5 8.3C3.5 6.61984 3.5 5.77976 3.82698 5.13803C4.1146 4.57354 4.57354 4.1146 5.13803 3.82698C5.77976 3.5 6.61984 3.5 8.3 3.5H15.7C17.3802 3.5 18.2202 3.5 18.862 3.82698C19.4265 4.1146 19.8854 4.57354 20.173 5.13803C20.5 5.77976 20.5 6.61984 20.5 8.3V15.7C20.5 17.3802 20.5 18.2202 20.173 18.862C19.8854 19.4265 19.4265 19.8854 18.862 20.173C18.2202 20.5 17.3802 20.5 15.7 20.5H8.3C6.61984 20.5 5.77976 20.5 5.13803 20.173C4.57354 19.8854 4.1146 19.4265 3.82698 18.862C3.5 18.2202 3.5 17.3802 3.5 15.7V8.3Z"
                stroke="#33363F"
                strokeWidth="round"
              />
              <path
                d="M6.5 9.5H9C10.6569 9.5 12 10.8431 12 12.5V17M6.5 9.5L8 8M6.5 9.5L8 11"
                stroke="#33363F"
                strokeWidth="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 9.5H15C13.3431 9.5 12 10.8431 12 12.5V17M17.5 9.5L16 8M17.5 9.5L16 11"
                stroke="#33363F"
                strokeWidth="round"
                strokeLinejoin="round"
              />
            </svg>
            <Typography>{location}</Typography>
          </Box>
          {rate ? (
            <Rating
              size="small"
              value={parseFloat(rate)}
              readOnly
            />
          ) : (
            <Box
              sx={{
                display: "inline-block",
                backgroundColor: "#E0F7FA", // Light cyan for a fresh look
                color: "#00796B", // Teal for contrast
                fontWeight: "bold",
                fontSize: "1.25rem",
                padding: "2px 8px",
                borderRadius: "12px",
              }}>
              جدید
            </Box>
          )}
        </Box>
        {/* <Box>
          <Typography variant="subtitle2">{"نیاز به رزرو دارد؟"}</Typography>
        </Box> */}
        <Divider
          sx={{
            mb: 1,
            mt: 3,
          }}
        />
        {/* Structure */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mr={1}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.5 10.0003C9.5 9.20875 8.44722 8.99895 8.16791 9.73957C7.49228 11.5311 7 13.1337 7 14.0002C7 16.7616 9.23858 19.0002 12 19.0002C14.7614 19.0002 17 16.7616 17 14.0002C17 13.0693 16.4318 11.2887 15.6784 9.33698C14.7026 6.80879 14.2146 5.54469 13.6123 5.4766C13.4196 5.45482 13.2093 5.49399 13.0374 5.58371C12.5 5.86413 12.5 7.24285 12.5 10.0003C12.5 10.8287 11.8284 11.5003 11 11.5003C10.1716 11.5003 9.5 10.8287 9.5 10.0003Z"
                stroke="#33363F"
                strokeWidth="2"
              />
            </svg>
            <Typography
              variant="h6"
              fontWeight={600}>
              {"ساختار باشگاه :"}
            </Typography>
          </Box>
          <Box
            sx={{
              mr: { xs: 2, md: 8 },
            }}>
            {features.length > 0 ? (
              <Grid2
                container
                mt={1}
                spacing={1}>
                <Grid2
                  size={6}
                  display="flex"
                  gap={0.5}
                  alignItems="center">
                  <Typography
                    variant="body1"
                    fontWeight="bold">
                    {"مساحت باشگاه"}:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary">
                    {"300 "}
                    مترمربع
                  </Typography>
                </Grid2>
                <Grid2
                  size={6}
                  display="flex"
                  gap={0.5}
                  alignItems="center">
                  <Typography
                    variant="body1"
                    fontWeight="bold">
                    {"ارتفاع سقف"}:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary">
                    {"4 "}
                    متر
                  </Typography>
                </Grid2>
                <Grid2
                  size={6}
                  display="flex"
                  gap={0.5}
                  alignItems="center">
                  <Typography
                    variant="body1"
                    fontWeight="bold">
                    {"طبقه"}:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary">
                    {"2"}
                  </Typography>
                </Grid2>
                <Grid2
                  size={6}
                  display="flex"
                  gap={0.5}
                  alignItems="center">
                  <Typography
                    variant="body1"
                    fontWeight="bold">
                    {"پارکینگ"}:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary">
                    {"دارد"}
                  </Typography>
                </Grid2>
                <Grid2
                  size={6}
                  display="flex"
                  gap={0.5}
                  alignItems="center">
                  <Typography
                    variant="body1"
                    fontWeight="bold">
                    {"آسانسور"}:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary">
                    {"دارد"}
                  </Typography>
                </Grid2>
              </Grid2>
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="textSecondary">
                {"ویژگی موجود نیست"}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Attributes */}
        {/* <Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mt={2}
            mr={1}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.5 10.0003C9.5 9.20875 8.44722 8.99895 8.16791 9.73957C7.49228 11.5311 7 13.1337 7 14.0002C7 16.7616 9.23858 19.0002 12 19.0002C14.7614 19.0002 17 16.7616 17 14.0002C17 13.0693 16.4318 11.2887 15.6784 9.33698C14.7026 6.80879 14.2146 5.54469 13.6123 5.4766C13.4196 5.45482 13.2093 5.49399 13.0374 5.58371C12.5 5.86413 12.5 7.24285 12.5 10.0003C12.5 10.8287 11.8284 11.5003 11 11.5003C10.1716 11.5003 9.5 10.8287 9.5 10.0003Z"
                stroke="#33363F"
                strokeWidth="2"
              />
            </svg>
            <Typography
              variant="h6"
              fontWeight={600}>
              {"تجهیزات :"}
            </Typography>
          </Box>
          <Box mr={8}>
            {features.length > 0 ? (
              features.map((feature, index) => (
                <Typography
                  key={index}
                  variant="subtitle1"
                  fontWeight={500}>
                  {feature}
                </Typography>
              ))
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="textSecondary">
                {"ویژگی موجود نیست"}
              </Typography>
            )}
          </Box>
        </Box> */}

        <Divider
          sx={{
            my: 1,
          }}
        />
        {/* Time */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mt={1}
            mr={1}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="12"
                cy="12"
                r="7"
                stroke="#33363F"
                strokeWidth="2"
              />
              <path
                d="M5.96472 3.1363C5.2865 3.31803 4.66807 3.67508 4.17157 4.17157C3.67508 4.66807 3.31803 5.2865 3.1363 5.96472"
                stroke="#33363F"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18.0353 3.1363C18.7135 3.31803 19.3319 3.67508 19.8284 4.17157C20.3249 4.66807 20.682 5.2865 20.8637 5.96472"
                stroke="#33363F"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 8V11.75C12 11.8881 12.1119 12 12.25 12H15"
                stroke="#33363F"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <Typography
              variant="h6"
              fontWeight={600}>
              {"ساعت کاری :"}
            </Typography>
          </Box>
          <Box
            display="flex"
            mt={2}
            mr={3}>
            <Tabs
              orientation="vertical"
              variant="fullWidth"
              value={showGender}
              onChange={(_, value) => {
                setShowGender(value);

                // Check if the user is not logged in
                if (!authTokens) {
                  const gender = value === 0 ? "men" : "women";
                  localStorage.setItem("selectedGender", gender);
                }
              }}
            >
              <Tab
                label="آقایان"
                value={0}
                sx={{
                  bgcolor: showGender === 0 ? "#90D6FF30" : "#F5F5F5",
                }}
              />
              <Tab
                label="بانوان"
                value={1}
                sx={{
                  bgcolor: showGender === 1 ? "#FF69B430" : "#F5F5F5",
                }}
              />
            </Tabs>
            <Box
              sx={{
                minHeight: "100%",
                minWidth: { xs: "200px", sm: "300px" },
                borderRadius: "8px 0 0 8px",
                p: 1,
                bgcolor: showGender === 0 ? "#90D6FF30" : "#FF69B430",
              }}>
              {showGender === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: "12px", md: "16px" },
                    }}
                    fontWeight={500}>
                    {`روزهای فرد: ${working_hours_men?.odd?.open && working_hours_men?.odd?.close
                        ? `${working_hours_men.odd.open} الی ${working_hours_men.odd.close}`
                        : `تعطیل`
                      }`}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: "12px", md: "16px" },
                    }}
                    fontWeight={500}>
                    {`روزهای زوج: ${working_hours_men?.even?.open && working_hours_men?.even?.close
                        ? `${working_hours_men.even.open} الی ${working_hours_men.even.close}`
                        : `تعطیل`
                      }`}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: "12px", md: "16px" },
                    }}
                    fontWeight={500}>
                    {`روزهای تعطیل: ${working_hours_men?.off_days?.open && working_hours_men?.off_days?.close
                        ? `${working_hours_men.off_days.open} الی ${working_hours_men.off_days.close}`
                        : `موجود نیست`
                      }`}
                  </Typography>
                </Box>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: "12px", md: "16px" },
                    }}
                    fontWeight={500}>
                    {`روزهای فرد: ${working_hours_women?.odd?.open && working_hours_women?.odd?.close
                        ? `${working_hours_women.odd.open} الی ${working_hours_women.odd.close}`
                        : `تعطیل`
                      }`}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: "12px", md: "16px" },
                    }}
                    fontWeight={500}>
                    {`روزهای زوج: ${working_hours_women?.even?.open && working_hours_women?.even?.close
                        ? `${working_hours_women.even.open} الی ${working_hours_women.even.close}`
                        : `تعطیل`
                      }`}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: { xs: "12px", md: "16px" },
                    }}
                    fontWeight={500}>
                    {`روزهای تعطیل: ${working_hours_women?.off_days?.open && working_hours_women?.off_days?.close
                        ? `${working_hours_women.off_days.open} الی ${working_hours_women.off_days.close}`
                        : `موجود نیست`
                      }`}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Reservation button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#fff",
            borderRadius: 4,
            width: { xs: "350px", md: "500px" },
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            p: 2,
            mt: { xs: 3, md: 4 },
            mx: "auto",
          }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: selectedDate ? "1px solid #ccc" : "none",
              pb: selectedDate ? 1 : 0,
              pl: { xs: 1, md: 4 },
            }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}>
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="contained"
                  onClick={() =>
                    selectedDate !== moment().format("jYYYY/jMM/jDD")
                      ? setSelectedDate(moment().format("jYYYY/jMM/jDD"))
                      : ""
                  }
                  sx={{
                    borderRadius: "0 8px 8px 0",
                    bgcolor: selectedDate === moment().format("jYYYY/jMM/jDD") ? "#F95A00" : "#bbb",
                    px: { xs: 1, md: 3 },
                    py: { xs: 1, md: 1.5 },
                  }}>
                  <Typography
                    noWrap
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: 16, md: 24 },
                    }}>
                    {"امروز"}
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  onClick={() =>
                    selectedDate !== moment().add(1, "days").format("jYYYY/jMM/jDD")
                      ? setSelectedDate(moment().add(1, "days").format("jYYYY/jMM/jDD"))
                      : ""
                  }
                  sx={{
                    borderRadius: "8px 0 0 8px",
                    bgcolor:
                      selectedDate === moment().add(1, "days").format("jYYYY/jMM/jDD") ? "#F95A00" : "#ccc",
                    px: { xs: 1, md: 3 },
                    py: { xs: 1, md: 1.5 },
                  }}>
                  <Typography
                    noWrap
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: 16, md: 24 },
                    }}>
                    {"فردا"}
                  </Typography>
                </Button>
              </Box>
              <Button
                variant="contained"
                onClick={() => setShowReservationModal(true)}
                sx={{
                  borderRadius: "8px",
                  bgcolor: "#fff",
                  color: "#F95A00",
                  boxShadow: 0,
                  border: "1px solid #F95A00",
                  px: { xs: 1, md: 1 },
                  py: { xs: 0.55, md: 1.5 },
                }}>
                تقویم
                <EditCalendarRounded sx={{ mr: 0.5 }} />
              </Button>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column">
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: 12, md: 24 },
                }}>
                {moment(selectedDate!, "jYYYY/jMM/jDD").locale("fa").format("dddd")}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: 12, md: 24 },
                }}>
                {selectedDate}
              </Typography>
            </Box>
          </Box>
          {selectedDate && (
            <TimeSelector
              timeSlots={availableTimeSlots}
              handleSetTime={handleSetTime}
            />
          )}
        </Box>
      </Grid>
      <ReservationModal
        open={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        gymId={gymId}
        gymSex={localStorage.getItem("selectedGender") || "men"}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Close after 6 seconds
        onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Specifications;
