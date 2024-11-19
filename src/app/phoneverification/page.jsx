"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button, Snackbar, Alert, Box, Container, Typography } from "@mui/material";
import { sendOtp, verifyOtp } from "../../api/VerificationAgain";
import { useRouter } from "next/navigation";

const PhoneVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  // Timer effect to decrease cooldownTime every second
  useEffect(() => {
    let timer;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Function to handle the request to send OTP
  const handleSendOtp = async () => {
    if (cooldownTime > 0) return;

    try {
      const response = await sendOtp(phoneNumber);

      if (response.success) {
        setIsOtpSent(true);
        setSnackbarMessage("OTP sent successfully.");
        setSnackbarSeverity("success");
      } else if (response.remaining_time) {
        setCooldownTime(Math.ceil(response.remaining_time)); // Set the cooldown period
        setSnackbarMessage(`Please wait ${Math.ceil(response.remaining_time)} seconds before retrying.`);
        setSnackbarSeverity("warning");
      } else {
        setSnackbarMessage("Failed to send OTP. Please try again.");
        setSnackbarSeverity("error");
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Function to handle OTP verification
  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp({
        user_phone_number: phoneNumber,
        otp: otpCode,
      });

      if (response.success) {
        setSnackbarMessage("Phone verified successfully.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        router.push("/auth");
      } else {
        setSnackbarMessage("OTP verification failed. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Phone Number"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button
          onClick={handleSendOtp}
          variant="contained"
          color="primary"
          fullWidth
          disabled={cooldownTime > 0}
          sx={{ marginTop: 2 }}
        >
          {cooldownTime > 0 ? `Resend OTP in ${cooldownTime}s` : "Send OTP"}
        </Button>

        {isOtpSent && (
          <>
            <TextField
              label="OTP Code"
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{ marginTop: 2 }}
            />
            <Button
              onClick={handleVerifyOtp}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Verify OTP
            </Button>
          </>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default PhoneVerification;
