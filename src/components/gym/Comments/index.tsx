"use client";

import React, { useEffect, useState } from "react";
import { getCommentsView } from "@/api/CommentView";
import { Typography, CircularProgress, Alert, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CommentView, CommentData } from "@/types/CommentView";
import Comment from "./Comment";

interface CommentProps {
  gymid: string;
}

const Comments: React.FC<CommentProps> = ({ gymid }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCommentsView(gymid);
        console.log(data?.comments);
        setComments(data?.comments || []);
      } catch (err) {
        setError("در حال حاضر کامنتی ثبت نشده است");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [gymid]);

  if (loading) {
    return (
      <Grid
        size={12}
        sx={{ p: 2 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid
        size={12}
        sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Grid>
    );
  }

  return (
    <Grid
      size={12}
      sx={{
        p: 2,
      }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        pb={3}>
        {"نظرات : "}
      </Typography>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.comment.id}>
            {/* Render the comment */}
            <Comment
              key={comment.comment.id}
              data={comment.comment}
              replies={comment.replies}
            />

            {/* Render replies
            {comment.replies && comment.replies.length > 0 && (
              <Box sx={{ mr: "20px" }}>
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    data={reply}
                  />
                ))}
              </Box>
            )} */}
          </div>
        ))
      ) : (
        <Typography variant="body1">هیج نظری تا حالا برای این باشگاه ثبت نشده است.</Typography>
      )}
    </Grid>
  );
};

export default Comments;
