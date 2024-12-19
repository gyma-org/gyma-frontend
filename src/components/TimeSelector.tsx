import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
}

const TimeSelector = ({
  timeSlots,
  handleSetTime,
}: {
  timeSlots: TimeSlot[];
  handleSetTime: (selectedTime: { id: number; start_time: string; end_time: string }) => void;
}) => {
  const [selectedTimeID, setSelectedTimeID] = React.useState<number | null>(null);
  console.log();
  const selectedTime = timeSlots.find((time) => time.id === selectedTimeID);

  return (
    <Box
      sx={{
        width: "100%",
        pt: 2,
      }}>
      {/* <Typography
        variant="h6"
        sx={{
          textAlign: "right",
        }}>
        انتخاب زمان
      </Typography> */}

      {/* Render time slots */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pb: 2,
          borderBottom: "1px solid #f0f0f0",
        }}>
        {timeSlots.map((time) => (
          <Button
            key={time.id}
            variant="contained"
            sx={{
              bgcolor: selectedTimeID === time.id ? "#00215E" : "#f0f0f0",
              color: selectedTimeID === time.id ? "#fff" : "#000",
              boxShadow: "none",
              borderRadius: 3,
            }}
            onClick={() => setSelectedTimeID(time.id)}>
            {time.start_time} - {time.end_time}
          </Button>
        ))}
      </Box>
      <Button
        fullWidth
        variant="contained"
        sx={{ bgcolor: selectedTimeID ? "#f95a00" : "#9e9e9e", borderRadius: 3, mt: 1 }}
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
  );
};

export default TimeSelector;
