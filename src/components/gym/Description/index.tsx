import React from "react";

import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const Description = ({ text }: { text: string | null }) => {
  return (
    <Grid
      size={12}
      sx={{
        p: 2,
      }}>
      <Typography
        textAlign="justify"
        sx={{
          fontSize: { xs: 16, md: 24 },
        }}>
        {text}
      </Typography>
    </Grid>
  );
};

export default Description;
