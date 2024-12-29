import React from "react";

import { Avatar, Box, Typography } from "@mui/material";

interface CommentProps {
  data: {
    writer: string;
    created_at: string;
    content: string;
    avatar_url: string;
    replies?: CommentProps["data"][];
  };
}

const Comment: React.FC<CommentProps> = ({ data }) => {
  const { writer, created_at, content, avatar_url, replies } = data;

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        borderBottom: "1px solid #b3b3b3",
        pb: { xs: 1, md: 2 },
        mb: { xs: 1, md: 2 },
      }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          sx={{
            mx: { xs: 1, md: 3 },
          }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: 14, md: 20 },
              mb: { xs: 1, md: 4 },
            }}>{`${writer} در ${created_at} گفته : `}</Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: 10, md: 16 },
              color: "#838383",
            }}>
            {content}
          </Typography>
        </Box>
        <Avatar
          src={avatar_url}
          variant="rounded"
          sx={{
            height: { xs: 50, md: 120 },
            width: { xs: 50, md: 120 },
          }}
        />
      </Box>

      {/* Render Replies */}
      {replies && replies.length > 0 && (
        <Box mt={2} ml={4} pl={2} borderLeft="1px solid #ddd">
          {replies.map((reply) => (
            <Comment key={reply.writer + reply.created_at} data={reply} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Comment;

