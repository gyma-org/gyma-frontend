import React from "react";
import styles from "./PersianCalendar.module.css";
import { Box, Button, Typography } from "@mui/material";

const times = [
  {
    startTime: "10:00",
    endTime: "13:00",
    id: 1,
  },
  {
    startTime: "14:00",
    endTime: "17:00",
    id: 2,
  },
  {
    startTime: "18:00",
    endTime: "21:00",
    id: 3,
  },
];

const TimeSelector = ({
  handleSetTime,
  handleBack,
}: {
  handleSetTime: (time: number) => void;
  handleBack: () => void;
}) => {
  const [selectedTimeID, setSelectedTimeID] = React.useState<number | null>(null);
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
      {/* render times */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          pb: 2,
        }}>
        {times.map((time) => (
          <Button
            key={time.id}
            variant="contained"
            sx={{
              bgcolor: selectedTimeID === time.id ? "#f95a00" : "#f0f0f0",
              color: selectedTimeID === time.id ? "#fff" : "#000",
              boxShadow: "none",
            }}
            onClick={() => setSelectedTimeID(time.id)}>
            {time.startTime} - {time.endTime}
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
          sx={{
            bgcolor: selectedTimeID ? "#f95a00" : "#9e9e9e",
          }}
          onClick={() => (selectedTimeID ? handleSetTime(selectedTimeID) : null)}
          disabled={!selectedTimeID}>
          رزرو
        </Button>
      </Box>
    </Box>
  );
};

export default TimeSelector;
