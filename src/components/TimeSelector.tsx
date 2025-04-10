import React from "react";
import styles from "./PersianCalendar.module.css";
import { Box, Button, Typography } from "@mui/material";
import jMoment from "jalali-moment"; // Import jalali-moment for date conversion
import jalaali from 'jalaali-js';
import { isPast } from "../../node_modules/date-fns/isPast";
// Define the type for a single time slot
interface TimeSlot {
  id: number;
  date: string; // Assuming date is in 'YYYY-MM-DD' format
  start_time: string;
  end_time: string;
  price: number;
}

// Props for TimeSelector component
interface TimeSelectorProps {
  timeSlots: TimeSlot[];
  handleSetTime: (selectedTime: TimeSlot) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ timeSlots, handleSetTime }) => {
  const [selectedTimeID, setSelectedTimeID] = React.useState<number | null>(null);
  const selectedTime = timeSlots.find((time) => time.id === selectedTimeID);

  // Get the current time in Tehran timezone
  const nowInTehran = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" })
  );

  return (
    <Box
      sx={{
        minWidth: { xs: "300px", md: "400px" },
        p: 2,
      }}
    >
      {/* Time slot list */}
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
          // Convert Jalali date (YYYY/MM/DD) to Gregorian date (YYYY-MM-DD)
          const session_day = time.date.replace(/\//g, "-");
          console.log(session_day) //1404-01-21
          const todayJalali = jalaali.toJalaali(new Date());
          const todayDate = `${todayJalali.jy}-${todayJalali.jm.toString().padStart(2, '0')}-${todayJalali.jd.toString().padStart(2, '0')}`;

          console.log('Today\'s Jalali Date:', todayDate); // Example output: 1404-01-21
          let isPast = false
          // Compare with the endTime
          if (todayDate.toString() === session_day.toString()) {
            const tehranTime = new Date().toLocaleString('en-US', {
              timeZone: 'Asia/Tehran',
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
            
            // Now, parse the endTime and tehranTime into comparable time values
            const [endHour, endMinute, endSecond] = time.end_time.toString().split(':').map(Number);
            const [currentHour, currentMinute, currentSecond] = tehranTime.split(':').map(Number);
            console.log(`${currentHour}curr`)
            console.log(`${endHour}end`)

            // Compare the times
            isPast = currentHour > endHour || (currentHour === endHour && currentMinute > endMinute) || (currentHour === endHour && currentMinute === endMinute && currentSecond > endSecond);

            
              console.log("equal");
              console.log(time.end_time)
          } else {
              console.log("not equal");
          }


          

          // const isPast = endTimeUTC < nowInTehran; // Check if the time slot is in the past
         
          return (
            <Button
              key={time.id}
              variant="contained"
              disabled={isPast}
              sx={{
                bgcolor: isPast
                  ? "#ccc"
                  : selectedTimeID === time.id
                  ? "#00215E"
                  : "#f0f0f0",
                color: isPast
                  ? "#888"
                  : selectedTimeID === time.id
                  ? "#fff"
                  : "#000",
                boxShadow: "none",
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                opacity: isPast ? 0.5 : 1,
              }}
              onClick={() => !isPast && setSelectedTimeID(time.id)}
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
           
                </svg>
              </Box>
              <Typography sx={{ direction: "ltr" }}>
                {time.start_time} - {time.end_time}
              </Typography>
            </Button>
          );
        })}
      </Box>

      {/* Confirm/Reserve Button */}
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
