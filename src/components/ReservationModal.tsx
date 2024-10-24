import React from "react";
import { Dialog } from "@mui/material";
import PersianCalendar from "./PersianCalendar";

interface PersianDatePickerModalProps {
  open: boolean;
  onClose: () => void;
}

const PersianDatePickerModal: React.FC<PersianDatePickerModalProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <PersianCalendar />
    </Dialog>
  );
};

export default PersianDatePickerModal;
