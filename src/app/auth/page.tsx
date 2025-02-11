"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { SnackbarProvider } from "notistack";
import { useSnackbar } from "notistack";

import {
  Box,
  InputBase,
  styled,
  useTheme,
  useMediaQuery,
  FormControl,
  FormHelperText,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from "@mui/material";
import { Button as MuiButton, Container as MuiContainer } from "@mui/material";
import { ErrorMessage, Field, Formik, FormikHelpers } from "formik";
import ForgotPassword from "@/components/Authorization/ForgotPassword";
import Verification from "@/components/Authorization/Verification";
import { useAuth } from "@/context/AuthContext";
import { RegisterValues } from "@/types/RegisterValues";
import { verifyOtp, VerificationData } from "../../api/Verification";

interface SignUpContainerProps {
  signingIn?: boolean;
}

interface SignInContainerProps {
  signingIn?: boolean;
}

interface OverlayContainerProps {
  signingIn?: boolean;
}

interface OverlayProps {
  signingIn?: boolean;
}

interface PanelProps {
  signingIn?: boolean;
}

interface SignUpValues {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  sex: string;
  password: string;
}

interface SignInValues {
  identifier: string;
  password: string;
}

const SignUpSchema = Yup.object().shape({
  // username: Yup.string().required("نام کاربری ضروری است."),
  first_name: Yup.string().required("نام ضروری است."),
  last_name: Yup.string().required("نام ضروری است."),
  // email: Yup.string().email("ایمیل معتبر نیست.").required("ایمیل ضروری است."),
  phone_number: Yup.string().required("شماره تلفن ضرروی است."),
  password: Yup.string().min(6, "حداقل ۶ کاراکتر.").required("کلمه عبور ضروری است."),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref("password"), null], "کلمات عبور باید مطابقت داشته باشند.")
    .required("تکرار کلمه عبور ضروری است."),
  sex: Yup.string().oneOf(["men", "women"], "لطفا جنسیت را انتخاب کنید.").required("جنسیت ضروری است."),
});

const SignInSchema = Yup.object().shape({
  identifier: Yup.string().required("نام کاربری ضروری است."),
  password: Yup.string().required("کلمه عبور ضروری است."),
});

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  border: "2px dashed #FF9100",
  borderRadius: "20px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  position: "relative",
  overflow: "hidden",
  maxWidth: "100%",
  minHeight: "550px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    minHeight: "600px",
  },
}));

const SignUpContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "signingIn",
})<SignUpContainerProps>(({ signingIn, theme }) => ({
  position: "absolute",
  top: 0,
  transition: "all 0.6s ease-in-out",
  left: 0,
  opacity: signingIn ? "0%" : "100%",
  zIndex: signingIn ? 1 : 5,
  transform: signingIn ? "none" : "translateX(100%)",
  width: "50%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    transform: "none",
  },
}));

const SignInContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "signingIn",
})<SignInContainerProps>(({ signingIn, theme }) => ({
  position: "absolute",
  top: 0,
  height: "100%",
  transition: "all 0.6s ease-in-out",
  left: 0,
  width: "50%",
  zIndex: 2,
  opacity: signingIn ? "100%" : "0%",
  transform: signingIn ? "none" : "translateX(100%)",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    transform: "none",
  },
}));

const Form = styled("form")({
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "0 50px",
  height: "100%",
  textAlign: "center",
});

const Title = styled("h1")({
  fontWeight: "bold",
  margin: 0,
});

const Input = styled(InputBase)({
  backgroundColor: "#eee",
  borderRadius: "15px",
  border: "none",
  padding: "5px 10px",
  marginTop: "10px",
  width: "100%",
});

const Button = styled(MuiButton)({
  borderRadius: "20px",
  border: "1px solid #FF9100",
  backgroundColor: "#FF9100",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "bold",
  padding: "12px 45px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  transition: "transform 80ms ease-in",
  marginTop: "10px",
  "&:active": {
    transform: "scale(0.95)",
  },
  "&:focus": {
    outline: "none",
  },
});

const GhostButton = styled(Button)({
  backgroundColor: "#ffffff",
  color: "#FF9100",
});

const Anchor = styled("a")({
  color: "#333",
  fontSize: "14px",
  textDecoration: "none",
  margin: "15px 0",
});

const OverlayContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "signingIn",
})<OverlayContainerProps>(({ signingIn, theme }) => ({
  position: "absolute",
  top: 10,
  left: "50%",
  borderRadius: "10px",
  width: "49%",
  height: "96%",
  overflow: "hidden",
  transition: "transform 0.6s ease-in-out",
  zIndex: 100,
  transform: signingIn ? "none" : "translateX(-100%)",
  [theme.breakpoints.down("sm")]: {
    left: "0",
    width: "100%",
    height: "30%",
    top: 0,
    transform: signingIn ? "translateY(0)" : "translateY(0)",
  },
}));

const Overlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== "signingIn",
})<OverlayProps>(({ signingIn, theme }) => ({
  background: "#FF9100",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "0 0, 0 0",
  color: "#ffffff",
  position: "relative",
  left: "-100%",
  height: "100%",
  width: "200%",
  transform: signingIn ? "none" : "translateX(50%)",
  transition: "transform 0.6s ease-in-out",
  [theme.breakpoints.down("sm")]: {
    height: "100%",
    transform: signingIn ? "translateY(0)" : "translateY(0)",
  },
}));

const OverlayPanel = styled(Box)({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "0 40px",
  textAlign: "center",
  top: 0,
  height: "100%",
  width: "50%",
  transform: "translateX(0)",
  transition: "transform 0.6s ease-in-out",
});

const LeftOverlayPanel = styled(OverlayPanel, {
  shouldForwardProp: (prop) => prop !== "signingIn",
})<PanelProps>(({ signingIn }) => ({
  transform: signingIn ? "translateX(-20%)" : "translateX(0)",
}));

const RightOverlayPanel = styled(OverlayPanel, {
  shouldForwardProp: (prop) => prop !== "signingIn",
})<PanelProps>(({ signingIn }) => ({
  right: 0,
  transform: signingIn ? "translateX(0)" : "translateX(20%)",
}));

// Paragraph component
const Paragraph = styled("p")({
  direction: "rtl",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "20px",
  letterSpacing: "0.5px",
  margin: "20px 0 30px",
});

const LoginSignup: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [signIn, toggle] = useState(true);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [openVerification, setOpenVerification] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>(""); // Capture phone number here

  const [loading, setLoading] = useState(false);

  const { registerUser, loginUser } = useAuth();

  const handleLogin = async (values: { identifier: string; password: string }) => {
    setLoading(true); // Start loading
    try {
      const response = await loginUser(values);
      setLoading(false); // Stop loading
  
      if (response.status_code === 200) {
        enqueueSnackbar("ورود موفقیت آمیز!", { variant: "success" });
      } else if (response.status_code === 401) {
        enqueueSnackbar("نام کاربری و یا رمز عبور اشتباه است", { variant: "error" });
      } else {
        enqueueSnackbar("نام کاربری و یا رمز عبور اشتباه است", { variant: "error" });
      }
    } catch (error) {
      setLoading(false); // Stop loading
      enqueueSnackbar("نام کاربری و یا رمز عبور اشتباه است", { variant: "error" });
    }
  };

  // const handleRegister = async (values: SignUpValues, { resetForm }: FormikHelpers<SignUpValues>) => {
  //   setShowCodeVerification(true);
  // };

  const handleRegister = async (values: RegisterValues) => {
    console.log("Form values: ", values);

    const phoneNumber = values.phone_number;

    const response = await registerUser(values); // call registerUser from context
    if (response.success) {
      enqueueSnackbar("ثبت نام اولیه با موفقیت انجام شد.", { variant: "success" });
      setOpenVerification(true);
      setUserPhoneNumber(phoneNumber);
    } else {
      console.error("Registration error:", response.errors);
      enqueueSnackbar("مشکلی در ثبت نام پیش آمد، دوباره تلاش کنید.", { variant: "error" });
    }
  };

  const handleVerify = async ({ code }: { code: string }) => {
    const data: VerificationData = {
      user_phone_number: userPhoneNumber, // Use the captured phone number here
      otp: code,
    };

    const verificationResponse = await verifyOtp(data);

    if (verificationResponse.success) {
      setOpenVerification(false);
      setSnackbarMessage(verificationResponse.message);
      enqueueSnackbar(verificationResponse.message, { variant: "success" });
    } else {
      enqueueSnackbar(verificationResponse.message, { variant: "error" });
    }
  };

  return (
    <MuiContainer
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Container
        sx={{
          width: isMobile ? "100%" : 800,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}>
        <SignUpContainer
          sx={{
            height: "100%",
            direction: "rtl",
          }}
          signingIn={signIn}>
          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              phone_number: "",
              sex: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignUpSchema}
            onSubmit={handleRegister}>
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Title>{"ساخت حساب کاربری"}</Title>
                <Field
                  as={Input}
                  name="first_name"
                  type="text"
                  placeholder="نام"
                />
                <ErrorMessage
                  name="first_name"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>

                <Field
                  as={Input}
                  name="last_name"
                  type="text"
                  placeholder="نام خانوادگی"
                />
                <ErrorMessage
                  name="last_name"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>

                <Field
                  as={Input}
                  name="phone_number"
                  type="text"
                  placeholder="شماره تلفن"
                />
                <ErrorMessage
                  name="phone_number"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                    justifyContent: "space-between",
                    width: "80%",
                  }}>
                  <Field name="sex">
                    {({ field, form }: any) => (
                      <FormControl
                        fullWidth
                        error={form.touched.sex && Boolean(form.errors.sex)}>
                        <ToggleButtonGroup
                          sx={{
                            direction: "ltr",
                            borderRadius: 5,
                            height: 40,
                          }}
                          value={field.value || ""}
                          exclusive
                          onChange={(_, value) => {
                            form.setFieldValue(field.name, value);
                          }}>
                          <ToggleButton
                            sx={{
                              flexGrow: 1,
                              borderRadius: 5,
                              "&.Mui-selected": {
                                backgroundColor: "primary.main",
                                color: "white",
                                borderColor: "primary.main",
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "primary.dark",
                              },
                            }}
                            value="men"
                            aria-label="Men">
                            مرد
                          </ToggleButton>
                          <ToggleButton
                            sx={{
                              flexGrow: 1,
                              borderRadius: 5,
                              "&.Mui-selected": {
                                backgroundColor: "secondary.main",
                                color: "white",
                                borderColor: "secondary.main",
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "secondary.dark",
                              },
                            }}
                            value="women"
                            aria-label="Women">
                            زن
                          </ToggleButton>
                        </ToggleButtonGroup>
                        {form.touched.sex && form.errors.sex && (
                          <FormHelperText>{form.errors.sex}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  </Field>
                </Box>

                <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="کلمه عبور"
                />
                <ErrorMessage
                  name="password"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>

                <Field
                  as={Input}
                  name="confirmPassword"
                  type="password"
                  placeholder="تکرار کلمه عبور"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>

                {/* <Button
                  fullWidth
                  type="submit">
                  {"ساخت حساب"}
                </Button> */}
                <Button fullWidth type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : "ساخت حساب"}
                </Button>
              </Form>
            )}
          </Formik>
        </SignUpContainer>
        <SignInContainer
          signingIn={signIn}
          sx={{ direction: "rtl" }}>
          <Formik
            initialValues={{
              identifier: "",
              password: "",
            }}
            validationSchema={SignInSchema}
            onSubmit={handleLogin}>
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Title>{"ورود"}</Title>
                <Field
                  as={Input}
                  name="identifier"
                  type="text"
                  placeholder="شماره تلفن"
                />
                <ErrorMessage
                  name="identifier"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>
                <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="کلمه عبور"
                />
                <ErrorMessage
                  name="password"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>
                <Button fullWidth type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : "ورود"}
                </Button>
                <Anchor onClick={() => setShowForgotPassword(true)}>
                  {"کلمه عبور خود را فراموش کردید؟"}
                </Anchor>
              </Form>
            )}
          </Formik>
          <Form>
            <Title>{"ورود"}</Title>
            <Input
              type="text"
              placeholder="شماره تلفن"
            />
            <Input
              type="password"
              placeholder="کلمه عبور"
            />
            <Anchor href="#">{"کلمه عبور خود را فرامش کردید؟"}</Anchor>
            <Button sx={{ mt: 2 }}>{"ورود"}</Button>
          </Form>
        </SignInContainer>
        {isMobile && (
          <>
            <MuiButton
              onClick={() => toggle(!signIn)}
              sx={{
                mb: 2,
                alignSelf: "center",
                position: "absolute",
                zIndex: 1000,
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}>
              {signIn ? "حساب کاربری ندارید؟" : "حساب کاربری داری؟"}
            </MuiButton>
          </>
        )}
        {!isMobile && (
          <OverlayContainer signingIn={signIn}>
            <Overlay signingIn={signIn}>
              <LeftOverlayPanel signingIn={signIn}>
                <Title>{"ساخت حساب"}</Title>
                <Paragraph>{"برای ساخت حساب کابری شما به این اطلاعات نیاز داریم."}</Paragraph>
                <GhostButton onClick={() => toggle(true)}>{"رفتن به ورود"}</GhostButton>
              </LeftOverlayPanel>
              <RightOverlayPanel signingIn={signIn}>
                <Title>{"ورود به حساب"}</Title>
                <Paragraph>{"اطلاعات خود را وارد کنید."}</Paragraph>
                <GhostButton onClick={() => toggle(false)}>{"رفتن به ساخت حساب"}</GhostButton>
              </RightOverlayPanel>
            </Overlay>
          </OverlayContainer>
        )}
      </Container>
      <ForgotPassword
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      <Verification
        open={openVerification}
        onClose={() => setOpenVerification(false)}
        onSubmit={handleVerify}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Close after 6 seconds
        onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <SnackbarProvider />
    </MuiContainer>
  );
};

export default LoginSignup;
