import React from "react";
import { Grid, Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Head from 'next/head';

interface PaymentStatusPageProps {
  params: {
    tracking_code: string;
    payment_status: "success" | "failed" | "unknown";
  };
}

const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({ params }) => {
  const { tracking_code, payment_status } = params;

  return (
    <>
      <Head>
        <title>وضعیت پرداخت</title>
      </Head>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f3f3f3",
          direction: "rtl",
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 400,
            width: "100%",
            p: 3,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
            وضعیت پرداخت
          </Typography>

          {payment_status === "success" ? (
            <>
              <CheckCircleOutlineIcon sx={{ fontSize: 50, color: "green", mt: 1 }} />
              <Typography variant="h6" color="green" sx={{ mt: 1 }}>
                پرداخت با موفقیت انجام شد. از خرید شما سپاسگزاریم.
              </Typography>
            </>
          ) : payment_status === "failed" ? (
            <>
              <ErrorOutlineIcon sx={{ fontSize: 50, color: "red", mt: 1 }} />
              <Typography variant="h6" color="red" sx={{ mt: 1 }}>
                پرداخت با شکست مواجه شد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
              </Typography>
            </>
          ) : (
            <>
              <HelpOutlineIcon sx={{ fontSize: 50, color: "#555", mt: 1 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                وضعیت پرداخت نامشخص است. لطفاً جزئیات پرداخت خود را بررسی کنید.
              </Typography>
            </>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            شماره پیگیری: {tracking_code}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
              fontWeight: "bold",
              color: "#fff",
            }}
            href="/"
          >
            بازگشت به پروفایل
          </Button>

          <Typography variant="body2" sx={{ mt: 2, color: "#777" }} id="countdown">
            بازگشت به برنامه در 10 ثانیه
          </Typography>

          {/* Inline script for countdown without using React's client-side hooks */}
          <script dangerouslySetInnerHTML={{
            __html: `
              let countdown = 10;
              const countdownElement = document.getElementById("countdown");
              const interval = setInterval(() => {
                countdown--;
                countdownElement.textContent = "بازگشت به برنامه در " + countdown + " ثانیه";
                if (countdown <= 0) {
                  clearInterval(interval);
                  window.location.href = "/";
                }
              }, 1000);
            `,
          }} />
        </Paper>
      </Box>
    </>
  );
};

export default PaymentStatusPage;