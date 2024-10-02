import React from "react";

import { Box, CardMedia, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

interface AddressProps {
  location: string;
}

const Address: React.FC<AddressProps> = ({location}) => {
  return (
    <Grid
      size={12}
      sx={{
        px: 2,
      }}>
      <Typography variant="h5" fontWeight="bold">
        {"آدرس : "}
      </Typography>
      <Typography sx={{ p: 2, fontSize: { xs: 16, md: 24 } }}>
        {location}
      </Typography>
      <Box
        sx={{
          aspectRatio: "2 / 1",
          width: "100%",
          overflow: "hidden",
          borderRadius: { xs: 4, md: 8 },
          bgcolor: "#555555",
          mx: "auto",
        }}>
        <CardMedia
          image="https://platform.neshan.org/wp-content/uploads/2023/05/vector1.png"
          component="img"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
    </Grid>
  );
};

export default Address;
