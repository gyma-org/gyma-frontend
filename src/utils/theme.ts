"use client";

import { createTheme } from "@mui/material/styles";

import localFont from "next/font/local";

const vazirmatn = localFont({
  src: [
    {
      path: "./fonts/Vazirmatn-FD-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-FD-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-FD-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-FD-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-FD-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-FD-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-FD-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-FD-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Vazirmatn-FD-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: vazirmatn.style.fontFamily,
  },
  palette: {
    primary: {
      light: "#8ECDDD",
      main: "#22668D",
      dark: "#252B48",
      contrastText: "#fff",
    },
    secondary: {
      light: "#FFFADD",
      main: "#FFCC70",
      contrastText: "#000",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FCFCFC",
    },
  },
});

export default theme;
