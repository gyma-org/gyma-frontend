import React from "react";
import { Button, Dialog } from "@mui/material";
import PersianCalendar from "./PersianCalendar";
import TimeSelector from "./TimeSelector";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<number | null>(null);
  const [state, setState] = React.useState<"selectDate" | "selectTime">("selectDate");

  const handleSetDate = (date: string) => {
    setSelectedDate(date);
    setState("selectTime");
  };

  const handleSetTime = (timeID: number) => {
    setSelectedTime(timeID);
    // POST Request to reserve the gym
  };

  const handleBack = () => {
    setSelectedDate(null);
    setState("selectDate");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}>
      {state === "selectDate" ? (
        <PersianCalendar handleSetDate={handleSetDate} />
      ) : (
        <TimeSelector
          handleSetTime={handleSetTime}
          handleBack={handleBack}
        />
      )}
    </Dialog>
  );
};

export default ReservationModal;
