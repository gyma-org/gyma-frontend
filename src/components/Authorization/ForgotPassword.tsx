import styled from "@emotion/styled";
import * as Yup from "yup";
import { useFormik } from "formik";
import { sendOtp } from "@/api/OTPForgetPassword";
import { resetPassword } from "@/api/ResetPassword";

import {
  Typography,
  Button as MuiButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputBase,
} from "@mui/material";
import { useState } from "react";

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
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

const Input = styled(InputBase)({
  backgroundColor: "#eee",
  borderRadius: "15px",
  border: "none",
  padding: "5px 10px",
  marginTop: "10px",
  width: "100%",
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

const numberSchema = Yup.object().shape({
  number: Yup.string()
    .required("شماره ضروری است."), // Required validation
});

const resetPasswordSchema = Yup.object().shape({
  // user_phone_number: Yup.string().required("شماره ضروری است."),
  otp: Yup.string().required("کد تایید ضروری است."),
  new_password: Yup.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد.").required("رمز عبور ضروری است."),
  confirm_password: Yup.string()
  .oneOf([Yup.ref("new_password"), undefined], "رمز عبور و تایید آن یکسان نیستند.")
  .required("تایید رمز عبور ضروری است."),
});

export default function ForgotPassword({ open, onClose }: ForgotPasswordProps) {
  const [step, setStep] = useState(1); // Step 1: Enter phone number, Step 2: Enter OTP and passwords
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneSubmit = async (values: { number: string }) => {
    try {
      console.log(values.number)
      const response = await sendOtp(values.number);
      if (response.success) {
        setPhoneNumber(values.number);
        setStep(2);
      } else {
        alert(response.message || "ارسال کد ناموفق بود.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("خطایی رخ داده است.");
    }
  };

  const handleResetPassword = async (values: {
    otp: string;
    new_password: string;
    confirm_password: string;
  }) => {
    try {
      const response = await resetPassword({ user_phone_number: phoneNumber, ...values });
      if (response.success) {
        alert("رمز عبور با موفقیت تغییر یافت.");
        onClose();
      } else {
        alert(response.message || "تغییر رمز عبور ناموفق بود.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("خطایی رخ داده است.");
    }
  };

  const formikPhone = useFormik({
    initialValues: { number: "" },
    validationSchema: numberSchema,
    onSubmit: handlePhoneSubmit,
  });

  const formikReset = useFormik({
    initialValues: {
      otp: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: handleResetPassword,
  });

  return (
    <StyledDialog open={open} onClose={onClose} sx={{ direction: "rtl" }}>
      <Header>
        <Title>{step === 1 ? "بازیابی رمز عبور" : "وارد کردن کد تایید"}</Title>
      </Header>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        {step === 1 ? (
          <>
            <DialogContentText>برای بازیابی رمز عبور لطفا شماره تماس خود را وارد کنید.</DialogContentText>
            <Input
              value={formikPhone.values.number}
              onChange={formikPhone.handleChange}
              onBlur={formikPhone.handleBlur}
              autoFocus
              required
              id="number"
              name="number"
              placeholder="شماره تماس"
              type="text"
              fullWidth
            />
          </>
        ) : (
          <>
            <DialogContentText>اطلاعات زیر را برای بازنشانی رمز عبور وارد کنید.</DialogContentText>
            <Input
              value={formikReset.values.otp}
              onChange={formikReset.handleChange}
              onBlur={formikReset.handleBlur}
              required
              id="otp"
              name="otp"
              placeholder="کد تایید"
              type="text"
              fullWidth
            />
            <Input
              value={formikReset.values.new_password}
              onChange={formikReset.handleChange}
              onBlur={formikReset.handleBlur}
              required
              id="new_password"
              name="new_password"
              placeholder="رمز عبور جدید"
              type="password"
              fullWidth
            />
            <Input
              value={formikReset.values.confirm_password}
              onChange={formikReset.handleChange}
              onBlur={formikReset.handleBlur}
              required
              id="confirm_password"
              name="confirm_password"
              placeholder="تایید رمز عبور"
              type="password"
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          {"لغو"}
        </Button>
        <Button
          onClick={() => (step === 1 ? formikPhone.handleSubmit() : formikReset.handleSubmit())}
          sx={{ background: "#FF9100", mr: 1 }}
          variant="contained"
        >
          {step === 1 ? "ارسال کد" : "بازنشانی رمز عبور"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
