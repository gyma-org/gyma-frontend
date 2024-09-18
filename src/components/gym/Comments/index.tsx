import React from "react";

import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Comment from "./Comment";

const Comments = () => {
  return (
    <Grid
      size={12}
      sx={{
        p: 2,
      }}>
      <Typography variant="h5" fontWeight="bold" pb={3}>
        {"نظرات : "}
      </Typography>
      {/* Comment */}
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </Grid>
  );
};

export default Comments;
