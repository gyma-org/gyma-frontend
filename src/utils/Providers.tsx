"use client"; // ✅ Ensure this file is a client component

import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { SnackbarProvider } from "notistack"; // ✅ Import SnackbarProvider

import theme from "./theme";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}
        style={{ zIndex: 9999 }}
        > {/* ✅ Wrap the children */}
          <CssBaseline />
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
