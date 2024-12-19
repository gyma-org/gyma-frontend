import React from "react";
import styles from "./PersianCalendar.module.css";
import { Box, Button, Typography } from "@mui/material";

interface TimeSlot {
  id: number;
  start_time: string; // Match the session keys
  end_time: string;
}

const TimeSelector = ({
  timeSlots,
  handleSetTime,
  handleBack,
}: {
  timeSlots: TimeSlot[]; // Accept dynamic session time slots
  handleSetTime: (selectedTime: { id: number; start_time: string; end_time: string }) => void;
  handleBack: () => void;
}) => {
  const [selectedTimeID, setSelectedTimeID] = React.useState<number | null>(null);
  console.log()
  const selectedTime = timeSlots.find((time) => time.id === selectedTimeID);

  return (
    <Box
      sx={{
        minWidth: { xs: "300px", md: "400px" },
        p: 2,
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          pb: 2,
        }}>
        <Box width="65px" />
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
          }}>
          انتخاب زمان
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#f95a00",
            color: "#fff",
          }}
          onClick={handleBack}>
          بازگشت
        </Button>
      </Box>

      {/* Render time slots */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pb: 2,
        }}>
        {timeSlots.map((time) => (
          <Button
            key={time.id}
            variant="contained"
            sx={{
              bgcolor: selectedTimeID === time.id ? "#f95a00" : "#f0f0f0",
              color: selectedTimeID === time.id ? "#fff" : "#000",
              boxShadow: "none",
            }}
            onClick={() => setSelectedTimeID(time.id)}>
            {time.start_time} - {time.end_time}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
        }}>
        <Button
  variant="contained"
  sx={{ bgcolor: selectedTimeID ? "#f95a00" : "#9e9e9e" }}
  onClick={() => {
    if (selectedTime) {
      console.log("Handle Set Time called with:", selectedTime);
      handleSetTime(selectedTime);
    }
  }}
  disabled={!selectedTimeID}>
  رزرو
</Button>
      </Box>
    </Box>
  );
};

export default TimeSelector;