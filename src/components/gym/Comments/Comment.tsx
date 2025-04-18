import React from "react";

import { Avatar, Box, Rating, Typography } from "@mui/material";
import moment from "jalali-moment";

interface CommentProps {
  data: {
    writer: string;
    created_at: string;
    content: string;
    avatar_url: string;
    rate: string;
    gym_name: string;
    writer_username: string;
  };
  replies?: CommentProps["data"][];
}

const Comment: React.FC<CommentProps> = ({ data, replies }) => {
  const { writer, created_at, content, avatar_url, rate, gym_name, writer_username } = data;

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        borderBottom: "1px solid #b3b3b3",
        pb: { xs: 1, md: 2 },
        mb: { xs: 1, md: 2 },
      }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center">
        <Box
          sx={{
            mx: { xs: 1, md: 3 },
          }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: 14, md: 20 },
            }}>{`${writer_username} در ${moment(created_at).format("jYYYY/jMM/jDD")} گفته : `}</Typography>
          <Rating
            sx={{
              direction: "ltr",
            }}
            value={parseFloat(rate)}
            precision={0.5}
            readOnly
          />
          <Typography
            variant="body2"
            sx={{
              mt: { xs: 1, md: 3 },
              fontWeight: 600,
              fontSize: { xs: 12, md: 18 },
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

      {replies && replies.length > 0 && (
        <Box
          mt={2}
          mr={4}
          pr={2}>
          {replies.map((reply) => {
            return (
              <Box
                key={reply.gym_name}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  bgcolor: "#ddd",
                  borderRadius: 2,
                  p: 1,
                  mb: { xs: 1, md: 2 },
                }}>
                <Box
                  sx={{
                    mx: { xs: 1, md: 3 },
                  }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: 14, md: 20 },
                      mb: { xs: 1, md: 2 },
                    }}>{`${reply.gym_name} در ${moment(reply.created_at).format(
                    "jYYYY/jMM/jDD"
                  )} در جواب گفته : `}</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: 12, md: 18 },
                      color: "#838383",
                    }}>
                    {reply.content}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Comment;