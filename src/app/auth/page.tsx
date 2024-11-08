"use client";

import { FormEventHandler, useState } from "react";
import * as Yup from "yup";
import { Box, InputBase, styled, useTheme, useMediaQuery } from "@mui/material";
import { Button as MuiButton, Container as MuiContainer } from "@mui/material";
import { ErrorMessage, Field, Formik, FormikHelpers } from "formik";
import ForgotPassword from "@/components/Authorization/ForgotPassword";
import Verification from "@/components/Authorization/Verification";

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
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface SignInValues {
  email: string;
  password: string;
}

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required("نام کاربری ضروری است."),
  name: Yup.string().required("نام ضروری است."),
  email: Yup.string().email("ایمیل معتبر نیست.").required("ایمیل ضروری است."),
  phone: Yup.string().required("شماره تلفن ضرروی است."),
  password: Yup.string().min(6, "حداقل ۶ کاراکتر.").required("کلمه عبور ضروری است."),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref("password"), null], "کلمات عبور باید مطابقت داشته باشند.")
    .required("تکرار کلمه عبور ضروری است."),
});

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("ایمیل معتبر نیست.").required("ایمیل ضروری است."),
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [signIn, toggle] = useState(true);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);

  const handleLogin = async (values: SignInValues, { resetForm }: FormikHelpers<SignInValues>) => {};

  const handleRegister = async (values: SignUpValues, { resetForm }: FormikHelpers<SignUpValues>) => {
    setShowCodeVerification(true);
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
              name: "",
              username: "",
              email: "",
              phone: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignUpSchema}
            onSubmit={handleRegister}>
            {({ handleSubmit }: { handleSubmit: FormEventHandler<HTMLFormElement> | undefined }) => (
              <Form onSubmit={handleSubmit}>
                <Title>{"ساخت حساب کاربری"}</Title>
                <Field
                  as={Input}
                  name="username"
                  type="text"
                  placeholder="نام کاربری"
                />
                <ErrorMessage
                  name="username"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>
                <Field
                  as={Input}
                  name="name"
                  type="text"
                  placeholder="نام"
                />
                <ErrorMessage
                  name="name"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>

                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder="ایمیل"
                />
                <ErrorMessage
                  name="email"
                  component="div">
                  {(msg: string) => <span style={{ color: "red", fontSize: 10 }}>{msg}</span>}
                </ErrorMessage>

                <Field
                  as={Input}
                  name="phone"
                  type="text"
                  placeholder="شماره تلفن"
                />
                <ErrorMessage
                  name="phone"
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

                <Button
                  fullWidth
                  type="submit">
                  {"ساخت حساب"}
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
              email: "",
              password: "",
            }}
            validationSchema={SignInSchema}
            onSubmit={handleLogin}>
            {({ handleSubmit }: { handleSubmit: FormEventHandler<HTMLFormElement> | undefined }) => (
              <Form onSubmit={handleSubmit}>
                <Title>{"ورود"}</Title>
                <Field
                  as={Input}
                  name="email"
                  type="email"
                  placeholder="ایمیل"
                />
                <ErrorMessage
                  name="email"
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
                <Button
                  fullWidth
                  type="submit">
                  {"ورود"}
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
              type="email"
              placeholder="ایمیل"
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
      <Verification
        open={showCodeVerification}
        onClose={() => setShowCodeVerification(false)}
      />
      <ForgotPassword
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </MuiContainer>
  );
};

export default LoginSignup;
