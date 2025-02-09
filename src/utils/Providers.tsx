import React from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { SnackbarProvider } from "notistack";

import theme from "./theme";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
