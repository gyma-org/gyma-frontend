"use client";

import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Button, Rating, Typography, Snackbar, Alert } from "@mui/material";
import ReservationModal from "@/components/ReservationModal";
import TimeSelector from "@/components/TimeSelector";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config";
import { bookGymSession } from "@/api/Booking";
import moment from "jalali-moment";
import { EditCalendarRounded } from "@mui/icons-material";

interface WorkingHours {
  off_days: { open: string; close: string };
  working_days: { open: string; close: string };
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
}) => {
  const [showReservationModal, setShowReservationModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(moment().format("jYYYY/jMM/jDD"));
  const [sessions, setSessions] = useState<any[]>([]);
  const { authTokens, logoutUser } = useAuth();

  // State for the temporarely Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

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

  const handleSetTime = async (selectedTime: { id: number; start_time: string; end_time: string; price:number; }) => {
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
        setSnackbarSeverity("success");
        setSnackbarMessage("Session booked successfully!");
      } else {
        // Handle unexpected response
        setSnackbarSeverity("error");
        setSnackbarMessage("Unexpected response. Please try again.");
        console.error("Unexpected response from bookGymSession:", result);
      }
    } catch (error: unknown) {
      console.error("Error booking gym session:", error);
    
      let errorMessage = "Failed to book session. Please try again."; // Default message
    
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        errorMessage = error.message; // The message from the error (e.g., API message)
      }
    
      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage); // Set the message to be displayed in the Snackbar
    } finally {
      setOpenSnackbar(true); // Show the Snackbar
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
          <Rating
            sx={{
              direction: "ltr",
            }}
            value={3.5}
            precision={0.5}
            readOnly
          />
        </Box>

        {/* Attributes */}
        <Box>
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
              {"ویژگی ها :"}
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
        </Box>

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
          <Box mr={8}>
          <Typography variant="subtitle1" fontWeight={500}>
          {/* Use optional chaining to avoid errors */}
          {`آقایان (روزهای کاری): ${working_hours_men.working_days.open} الی ${working_hours_men?.working_days?.close}`}
        </Typography>
        <Typography variant="subtitle1" fontWeight={500}>
          {`آقایان (روزهای تعطیل): ${working_hours_men?.off_days?.open} الی ${working_hours_men?.off_days?.close}`}
        </Typography>
        <Typography variant="subtitle1" fontWeight={500}>
          {`بانوان (روزهای کاری): ${working_hours_women?.working_days?.open} الی ${working_hours_women?.working_days?.close}`}
        </Typography>
        <Typography variant="subtitle1" fontWeight={500}>
          {`بانوان (روزهای تعطیل): ${working_hours_women?.off_days?.open} الی ${working_hours_women?.off_days?.close}`}
        </Typography>
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
            borderRadius: 5,
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
                    borderRadius: "0 16px 16px 0",
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
                    {/* {selectedDate === moment().format("jYYYY/jMM/jDD")
                      ? "امروز"
                      : selectedDate || "انتخاب تاریخ"} */}
                    {"امروز"}
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  // disabled={selectedDate === moment().add(1, "days").format("jYYYY/jMM/jDD")}
                  onClick={() =>
                    selectedDate !== moment().add(1, "days").format("jYYYY/jMM/jDD")
                      ? setSelectedDate(moment().add(1, "days").format("jYYYY/jMM/jDD"))
                      : ""
                  }
                  sx={{
                    borderRadius: "16px 0 0 16px",
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

              {/* {selectedDate === moment().format("jYYYY/jMM/jDD") && ( */}
              <Button
                variant="contained"
                onClick={() => setShowReservationModal(true)}
                sx={{
                  borderRadius: "16px",
                  bgcolor: "#fff",
                  color: "#F95A00",
                  boxShadow: 0,
                  border: "2px solid #F95A00",
                  px: { xs: 0, md: 1 },
                  py: { xs: 1, md: 1.5 },
                }}>
                <EditCalendarRounded fontSize="small" />
              </Button>
              {/* )} */}
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gap={1}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: 24, md: 34 },
                }}>
                {"۱۲۴۰۰۰"}
              </Typography>
              <svg
                width="22"
                height="24"
                viewBox="0 0 22 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4.78516 0.546875L6.01562 1.77734L4.78516 3.00098L3.56152 1.77734L4.78516 0.546875ZM4.87402 8.06641C5.53483 8.06641 6.05436 7.96159 6.43262 7.75195C6.81543 7.54232 7.08659 7.25749 7.24609 6.89746C7.4056 6.53743 7.48535 6.12728 7.48535 5.66699C7.48535 5.1748 7.4056 4.66895 7.24609 4.14941C7.09115 3.62988 6.91569 3.13086 6.71973 2.65234L8.54492 1.96875C8.80469 2.65234 8.98698 3.28353 9.0918 3.8623C9.19661 4.43652 9.24902 5.02214 9.24902 5.61914C9.24902 6.52604 9.08268 7.30762 8.75 7.96387C8.41732 8.62467 7.92513 9.13281 7.27344 9.48828C6.6263 9.84375 5.8265 10.0215 4.87402 10.0215C3.89421 10.0215 3.08529 9.83236 2.44727 9.4541C1.8138 9.0804 1.3444 8.56999 1.03906 7.92285C0.733724 7.28027 0.581055 6.55111 0.581055 5.73535C0.581055 5.19303 0.640299 4.63249 0.758789 4.05371C0.877279 3.47038 1.04818 2.8916 1.27148 2.31738L2.93262 2.95312C2.764 3.4362 2.62272 3.90788 2.50879 4.36816C2.39486 4.82845 2.33789 5.25911 2.33789 5.66016C2.33789 6.09766 2.41536 6.4987 2.57031 6.86328C2.72526 7.22786 2.9873 7.51953 3.35645 7.73828C3.72559 7.95703 4.23145 8.06641 4.87402 8.06641ZM0.916016 10.3477H2.78906V16.6641C2.78906 17.1517 2.85514 17.5003 2.9873 17.71C3.12402 17.9196 3.41569 18.0244 3.8623 18.0244H4.02637V20H3.8623C2.84147 20 2.09408 19.7357 1.62012 19.207C1.15072 18.6784 0.916016 17.8854 0.916016 16.8281V10.3477ZM8.2373 16.2881C8.0459 16.2881 7.875 16.3519 7.72461 16.4795C7.57422 16.6025 7.44206 16.7529 7.32812 16.9307C7.21875 17.1038 7.12533 17.2725 7.04785 17.4365C7.18001 17.555 7.30534 17.6576 7.42383 17.7441C7.54688 17.8307 7.66081 17.9036 7.76562 17.9629C7.92969 18.0586 8.0778 18.1247 8.20996 18.1611C8.34668 18.1976 8.46745 18.2158 8.57227 18.2158C8.81836 18.2158 8.99154 18.1292 9.0918 17.9561C9.19661 17.7829 9.24902 17.5824 9.24902 17.3545C9.24902 17.0628 9.15788 16.8122 8.97559 16.6025C8.79785 16.3929 8.55176 16.2881 8.2373 16.2881ZM8.56543 20.1572C8.25098 20.1572 7.9502 20.1094 7.66309 20.0137C7.37598 19.9225 7.09798 19.7972 6.8291 19.6377C6.56022 19.4782 6.29362 19.2982 6.0293 19.0977C5.86523 19.2663 5.69661 19.4189 5.52344 19.5557C5.35482 19.6878 5.1543 19.7949 4.92188 19.877C4.69401 19.959 4.4069 20 4.06055 20H3.77344V18.0244H4.02637C4.24967 18.0244 4.4502 17.9378 4.62793 17.7646C4.80566 17.5869 4.97884 17.3613 5.14746 17.0879C5.31608 16.8099 5.49154 16.5182 5.67383 16.2129C5.86068 15.9076 6.06803 15.6182 6.2959 15.3447C6.52376 15.0667 6.79036 14.8411 7.0957 14.668C7.4056 14.4948 7.76562 14.4082 8.17578 14.4082C8.75 14.4082 9.24674 14.5449 9.66602 14.8184C10.0853 15.0872 10.4089 15.445 10.6367 15.8916C10.8646 16.3337 10.9785 16.8167 10.9785 17.3408C10.9785 17.8786 10.8896 18.3594 10.7119 18.7832C10.5342 19.207 10.2653 19.542 9.90527 19.7881C9.5498 20.0342 9.10319 20.1572 8.56543 20.1572ZM14.6973 14.2168C15.1484 14.2168 15.5404 14.3216 15.873 14.5312C16.2103 14.7409 16.4928 15.028 16.7207 15.3926C16.9531 15.7526 17.1331 16.1605 17.2607 16.6162C17.3929 17.0674 17.4772 17.5368 17.5137 18.0244H18.0195V20H17.377C17.2038 20.6927 16.9189 21.2852 16.5225 21.7773C16.1305 22.2695 15.6201 22.6751 14.9912 22.9941C14.3623 23.3132 13.6081 23.557 12.7285 23.7256L12.0518 21.9004C12.626 21.7865 13.1569 21.6383 13.6445 21.4561C14.1367 21.2783 14.5514 21.0664 14.8887 20.8203C15.2305 20.5742 15.4583 20.3008 15.5723 20H14.9297C14.0137 20 13.3118 19.8086 12.8242 19.4258C12.3411 19.0384 12.0996 18.4141 12.0996 17.5527C12.0996 17.2109 12.152 16.8486 12.2568 16.4658C12.3617 16.0785 12.5189 15.7161 12.7285 15.3789C12.9427 15.0371 13.2139 14.7591 13.542 14.5449C13.8701 14.3262 14.2552 14.2168 14.6973 14.2168ZM14.9229 18.0244H15.7979C15.7796 17.8285 15.7454 17.6234 15.6953 17.4092C15.6452 17.195 15.5768 16.9945 15.4902 16.8076C15.4036 16.6208 15.2943 16.4681 15.1621 16.3496C15.0299 16.2266 14.8704 16.165 14.6836 16.165C14.4694 16.165 14.2985 16.2425 14.1709 16.3975C14.0479 16.5524 13.959 16.7324 13.9043 16.9375C13.8542 17.1426 13.8291 17.3226 13.8291 17.4775C13.8291 17.7191 13.9294 17.8717 14.1299 17.9355C14.335 17.9948 14.5993 18.0244 14.9229 18.0244ZM17.7598 18.0244H18.2451V20H17.7598V18.0244ZM20.7881 11.0244L21.957 12.1865L20.7881 13.3623L19.6191 12.1865L20.7881 11.0244ZM18.4775 11.0244L19.6533 12.1865L18.4775 13.3623L17.3154 12.1865L18.4775 11.0244ZM18.8262 20H18.0674V18.0244H18.8125C19.2135 18.0244 19.5189 17.9561 19.7285 17.8193C19.9382 17.6781 20.043 17.3955 20.043 16.9717C20.043 16.7165 20.0156 16.3883 19.9609 15.9873C19.9062 15.5817 19.8105 15.1169 19.6738 14.5928L21.4443 14.1143C21.5628 14.5837 21.6517 15.0348 21.7109 15.4678C21.7702 15.9007 21.7998 16.32 21.7998 16.7256C21.7998 17.3864 21.7041 17.9629 21.5127 18.4551C21.3213 18.9427 21.0091 19.3232 20.5762 19.5967C20.1432 19.8656 19.5599 20 18.8262 20Z"
                  fill="black"
                />
              </svg>
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
        gymSex="men"
      />

    <Snackbar
      open={openSnackbar}
      autoHideDuration={6000} // Close after 6 seconds
      onClose={() => setOpenSnackbar(false)}
      >
      <Alert
        onClose={() => setOpenSnackbar(false)}
        severity={snackbarSeverity}
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>
  );
};

export default Specifications;
