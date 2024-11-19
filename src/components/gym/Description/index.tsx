import React from "react";

import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

interface DescriptionProps {
  text: string | null;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
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
        {
          'باشگاه ورزشی "تندرست"، یک مرکز مجهز برای علاقه‌مندان به تناسب اندام و سلامتی است. این باشگاه با ارائه انواع برنامه‌های ورزشی از جمله بدنسازی، یوگا، و پیلاتس در محیطی مدرن و دوستانه، به تمامی ...'
        }
      </Typography>
    </Grid>
  );
};

export default Description;
