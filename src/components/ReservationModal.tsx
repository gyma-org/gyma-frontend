import React from "react";
import { Dialog } from "@mui/material";
import PersianCalendar from "./PersianCalendar";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}>
      <PersianCalendar />
    </Dialog>
  );
};

export default ReservationModal;
