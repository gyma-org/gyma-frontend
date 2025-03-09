import React from "react";
import styles from "./PersianCalendar.module.css";
import { Box, Button, Typography } from "@mui/material";

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  price: number;
}

const TimeSelector = ({
  timeSlots,
  handleSetTime,
}: {
  timeSlots: TimeSlot[];
  handleSetTime: (selectedTime: {
    id: number;
    start_time: string;
    end_time: string;
    price: number;
  }) => void;
}) => {
  const [selectedTimeID, setSelectedTimeID] = React.useState<number | null>(null);
  const selectedTime = timeSlots.find((time) => time.id === selectedTimeID);

  // Get current time in Iran Standard Time (UTC+3:30)
  const now = new Date();
  const nowInTehran = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tehran" }));

  const array = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00"];

  return (
    <Box
      sx={{
        minWidth: { xs: "300px", md: "400px" },
        p: 2,
      }}
    >
      {/* Render time slots */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pb: 2,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Typography align="center">{"انتخاب سانس"}</Typography>
        {timeSlots.map((time) => {
          // Convert end_time to Iran timezone
          const endTimeDate = new Date(now.toDateString() + " " + time.end_time);
          const isPast = endTimeDate < nowInTehran;

          return (
            <Button
              key={time.id}
              variant="contained"
              disabled={isPast} // Disable if the time slot has ended
              sx={{
                bgcolor: isPast
                  ? "#ccc" // Gray out past times
                  : selectedTimeID === time.id
                  ? "#00215E"
                  : "#f0f0f0",
                color: isPast
                  ? "#888" // Make text lighter for past times
                  : selectedTimeID === time.id
                  ? "#fff"
                  : "#000",
                boxShadow: "none",
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                opacity: isPast ? 0.5 : 1, // Reduce opacity for past times
              }}
              onClick={() => !isPast && setSelectedTimeID(time.id)} // Prevent clicking past slots
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: 12, md: 14 },
                  }}
                >
                  {Number(time.price).toLocaleString()} تومان
                </Typography>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 22 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d=" 20Z" fill={selectedTimeID === time.id ? "white" : "black"} />
                </svg>
              </Box>
              <Typography sx={{ direction: "ltr" }}>
                {time.start_time} - {time.end_time}
              </Typography>
            </Button>
          );
        })}
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: selectedTimeID ? "#f95a00" : "#9e9e9e",
          borderRadius: 3,
          mt: 1,
        }}
        onClick={() => {
          if (selectedTime) {
            console.log("Handle Set Time called with:", selectedTime);
            handleSetTime(selectedTime);
          }
        }}
        disabled={!selectedTimeID}
      >
        رزرو
      </Button>
    </Box>
  );
};

export default TimeSelector;
