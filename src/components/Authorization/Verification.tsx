import styled from "@emotion/styled";
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Typography,
  Button as MuiButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import VerificationInput from "react-verification-input";

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { code: string }) => void;
  length?: number;
}

const Button = styled(MuiButton)({
  borderRadius: "10px",
  border: "1px solid #FF9100",
  fontSize: "13px",
  fontWeight: "normal",
  padding: "5px 25px",
  transition: "transform 80ms ease-in",
  "&:active": {
    transform: "scale(0.95)",
  },
  "&:focus": {
    outline: "none",
  },
});

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    maxWidth: "500px",
    borderRadius: "10px",
    overflow: "hidden",
  },
}));

const Header = styled("div")(() => ({
  height: "50px",
  borderRadius: "10px",
  margin: "5px",
  backgroundRepeat: "repeat, no-repeat",
  backgroundSize: "150%, cover",
  backgroundPosition: "0 0, 0 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Title = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.4rem",
});

const CodeSchema = Yup.object().shape({
  code: Yup.string().required("وارد کردن کد الزامی است.").min(6, "کد نباید کمتر از 6 رقم باشد."),
});

export default function Verification({ open, onClose, onSubmit, length = 6 }: ForgotPasswordProps) {
  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: CodeSchema,
    onSubmit: async (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  const handleClick = () => {
    formik.handleSubmit();
  };

  return (
    <StyledDialog
      sx={{ direction: "rtl" }}
      open={open}
      onClose={onClose}>
      <Header>
        <Title>تائید شماره تلفن</Title>
      </Header>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", direction: "ltr" }}>
        <DialogContentText sx={{ direction: "rtl" }}>
          لطفا کد ارسال شده به شماره تلفن خود را وارد کنید.
        </DialogContentText>
        <VerificationInput
          value={formik.values.code}
          onChange={(value) => formik.setValues({ code: value })}
          classNames={{
            container: "container",
            character: "character",
            characterInactive: "character--inactive",
            characterSelected: "character--selected",
            characterFilled: "character--filled",
          }}
          length={length}
          autoFocus
          placeholder="-"
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button
          onClick={handleClick}
          sx={{
            background: "#FF9100",
            mr: 1,
          }}
          variant="contained">
          تائید
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
