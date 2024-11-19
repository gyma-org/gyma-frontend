import React, { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import moment from "jalali-moment";
import PersianCalendar from "./PersianCalendar";
import TimeSelector from "./TimeSelector";
import { bookGymSession } from "../api/Booking"
import { useAuth } from "@/context/AuthContext";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  gymId: string;
  gymSex: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ open, onClose, gymId, gymSex }) => {
  const API_BASE_URL = "http://127.0.0.1:8000/";
  
  const fetchGymSessions = async (gymId: string, gymSex: string, date: string): Promise<any[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}schedules/get_schedule_for_next_60_days/?gym=${gymId}&date=${date}&sex=${gymSex}`
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeID, setSelectedTimeID] = useState<number | null>(null);
  const [state, setState] = useState<"selectDate" | "selectTime">("selectDate");
  const { authTokens } = useAuth();

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

  const handleSetDate = ({ date, startTime, endTime }: { date: string; startTime: string; endTime: string }) => {
    // Save the selected date and time details in the state or pass them to TimeSelector
    console.log("Selected Date:", date);
    console.log("Session Start Time:", startTime);
    console.log("Session End Time:", endTime);
    setSelectedDate(date);
    console.log("Date selected:", date); // Debug selected date
    setState("selectTime");
  };

  const handleSetTime = async (selectedTime: { id: number; start_time: string; end_time: string }) => {
    if (!authTokens) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      // Call bookGymSession to get the HTML form
      const htmlForm = await bookGymSession(selectedTime.id, authTokens.access);

      // Create a new window to submit the form
      const newWindow = window.open();

      if (newWindow) {
        newWindow.document.write(htmlForm); // Write the form to the new window
        newWindow.document.close(); // Close the document to allow form submission

        // Cast to HTMLFormElement to access the submit method
        const formElement = newWindow.document.getElementById('id_form') as HTMLFormElement;
        formElement?.submit(); // Submit the form to the payment gateway
      }
    } catch (error) {
      console.error("Error booking gym session:", error);
    }
  };

  const availableTimeSlots = sessions
    .filter((session) => session.date === selectedDate)
    .map((session) => ({
      id: session.id,
      start_time: session.start_time,
      end_time: session.end_time,
    }));
    
  const handleBack = () => {
    setSelectedDate(null);
    setState("selectDate");
  };

  // const handleMonthChange = (newMonth: moment.Moment) => {
  //   setCurrentMonth(newMonth);
  //   setSelectedDate(null);
  // };

  return (
    <Dialog
      open={open}
      onClose={onClose}>
      {state === "selectDate" ? (
        <PersianCalendar
          handleSetDate={handleSetDate}
          sessions={sessions}
          currentMonth={currentMonth}
        />
      ) : (
        <TimeSelector
          timeSlots={availableTimeSlots}
          handleSetTime={handleSetTime}
          handleBack={handleBack}
        />
      )}
    </Dialog>
  );
};

export default ReservationModal;
