import React from "react";

import { Avatar, Box, Typography } from "@mui/material";

const Comment = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        borderBottom: "1px solid #b3b3b3",
        pb: {
          xs: 1,
          md: 2,
        },
        mb: {
          xs: 1,
          md: 2,
        },
      }}>
      <Box
        sx={{
          mx: { xs: 1, md: 3 },
        }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: 14, md: 20 },
            mb: { xs: 1, md: 4 },
          }}>{`${"رضا"} در ${"1403/06/09"} گفته : `}</Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: 10, md: 16 },
            color: "#838383",
          }}>
          {
            "در کل باشگاه خوبی بود، محیط آروم و ساکتی داشت، ولی زمانی که من رفتم پارکینگ پر بود. دستگاه های مجهزی داشت که این برام خیلی مهم بود."
          }
        </Typography>
      </Box>
      <Avatar
        src="https://placehold.co/600x400"
        variant="rounded"
        sx={{
          height: { xs: 50, md: 120 },
          width: { xs: 50, md: 120 },
        }}
      />
    </Box>
  );
};

export default Comment;
