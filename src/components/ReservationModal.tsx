import React, { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import moment from "jalali-moment";
import PersianCalendar from "./PersianCalendar";
import { API_BASE_URL } from "../config";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  gymId: string;
  gymSex: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  open,
  setSelectedDate,
  onClose,
  gymId,
  gymSex,
}) => {
  // const API_BASE_URL = "http://127.0.0.1:8000/";

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
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      // Convert Jalali month to Gregorian before sending the request
      const gregorianMonth = currentMonth.clone().locale("en").format("YYYY-MM-DD");
      fetchGymSessions(gymId, gymSex, gregorianMonth).then((responseSessions) => {
        // Convert response dates back to Jalali for display
        const jalaliSessions = responseSessions.map((session) => ({
          ...session,
          date: moment(session.date, "YYYY-MM-DD").locale("fa").format("jYYYY/jMM/jDD"),
        }));
        setSessions(jalaliSessions);
      });
    }
  }, [open, gymId, gymSex, currentMonth]);

  const handleSetDate = ({
    date,
    startTime,
    endTime,
  }: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    console.log("Selected Date:", date);
    console.log("Session Start Time:", startTime);
    console.log("Session End Time:", endTime);
    setSelectedDate(date);
    onClose();
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "92%",
          maxWidth: "400px",
          margin: "0 auto",
        },
      }}
      open={open}
      onClose={onClose}>
      {open && (
        <PersianCalendar
          handleSetDate={handleSetDate}
          sessions={sessions}
        />
      )}
    </Dialog>
  );
};

export default ReservationModal;
