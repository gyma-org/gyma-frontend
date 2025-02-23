import React from "react";

import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ArrowBackIos } from "@mui/icons-material";

interface DescriptionProps {
  text: string | null;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
  return (
    <Grid
      size={12}
      sx={{
        px: 2,
      }}>
      <Typography
        variant="h6"
        fontWeight={600}>
        <ArrowBackIos sx={{ ml: 2 }} />
        {"توضیحات :"}
      </Typography>
      <Divider
        sx={{
          my: 1,
        }}
      />
      <Typography
        textAlign="justify"
        variant="subtitle2"
        sx={{
          fontSize: { xs: 12, md: 20 },
          pr: 4,
          color: "text.secondary",
        }}>
        {text}
      </Typography>
    </Grid>
  );
};

export default Description;