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
  InputBase,
} from "@mui/material";

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

const EmailSchema = Yup.object().shape({
  email: Yup.string().email("ایمیل معتبر نیست.").required("ایمیل ضروری است."),
});

export default function ForgotPassword({ open, onClose }: ForgotPasswordProps) {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: EmailSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
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
        <Title>بازیابی رمز عبور</Title>
      </Header>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <DialogContentText>
          آدرس ایمیل حساب کاربری خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود.
        </DialogContentText>
        <Input
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoFocus
          required
          id="email"
          name="email"
          placeholder="آدرس ایمیل"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}>
          {"لغو"}
        </Button>
        <Button
          onClick={handleClick}
          sx={{
            background: "#FF9100",
            mr: 1,
          }}
          variant="contained">
          ادامه
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
