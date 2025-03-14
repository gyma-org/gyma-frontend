import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import Head from "next/head";

// Defining the props with parameters for booking_id and booking_confirmation_code
interface PaymentStatusPageProps {
  params: {
    booking_id: number;
    booking_confirmation_code: number;
  };
}

// Static paths generation for dynamic routes
export async function generateStaticParams() {
  // Sample data for static paths generation; replace this with actual data fetching logic
  const bookingData = [
    { booking_id: 123, booking_confirmation_code: 456 },
    { booking_id: 789, booking_confirmation_code: 101 },
    // Add more sample paths as needed
  ];

  return bookingData.map((item) => ({
    booking_id: item.booking_id.toString(),
    booking_confirmation_code: item.booking_confirmation_code.toString(),
  }));
}

const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({ params }) => {
  const { booking_id, booking_confirmation_code } = params;

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

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            شماره رزرو: {booking_id}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            کد تأییدیه: {booking_confirmation_code}
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
            بازگشت به برنامه در 50 ثانیه
          </Typography>

          <script
            dangerouslySetInnerHTML={{
              __html: `
                let countdown = 50;
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
            }}
          />
        </Paper>
      </Box>
    </>
  );
};

export default PaymentStatusPage;
