import React, { useState } from "react";
import { API_BASE_URL } from "@/config";
import {
  Box,
  Typography,
  CardMedia,
  TextField,
  Button,
  Modal,
  Rating,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { booked } from "../../types/booked";
import { CommentAdd } from "../../types/CommentAdd";
import { addComment } from "../../api/CommentAdd";
import styles from "./Card.module.css";
import moment from "jalali-moment";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";
import CircularProgress from '@mui/material/CircularProgress';


interface ReservationCardIFace {
  outdate?: boolean;
  // used?: boolean;
  booking: booked;
}

const ReservationCard = ({ booking, outdate = false }: ReservationCardIFace) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authTokens, logoutUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  const convertToJalali = (gregorianDate: string | Date): string => {
    return moment(gregorianDate, "YYYY-MM-DD").locale("fa").format("YYYY/MM/DD");
  };

  const persianDate = convertToJalali(booking.gym_session_date);

  const handleOpenCommentModal = () => {
    setOpenCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setOpenCommentModal(false);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    const newComment: CommentAdd = {
      gym_id: booking.gym_id,
      id: booking.id,
      content: comment,
      rate: rate ?? 0,
    };

    try {
      if (!authTokens) {
        console.error("Auth tokens are null. Cannot fetch bookings.");
        return;
      }
  
      const response = await addComment(newComment, authTokens.access, logoutUser);
  
      if (response.status_code === 200) {
        enqueueSnackbar("نظر شما ثبت شد!", { variant: "success" });
      } else if (response.status_code === 404) {
        enqueueSnackbar("باشگاه پیدا نشد!", { variant: "error" });
      } else if (response.status_code === 400) {
        enqueueSnackbar("باشگاه پیدا نشد!", { variant: "error" });
      } else if (response.status_code === 201) {
        enqueueSnackbar("نظر شما ثبت شد!", { variant: "success" });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      enqueueSnackbar("خطا در ثبت نظر، دوباره تلاش کنید!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  console.log(persianDate);
  return (
    <Grid
      display="flex"
      justifyContent="center"
      my={1}>
      <div className={`${styles.ticket}`}>
        <Box
          sx={{
            position: "relative",
            bgcolor: "#fff",
            pt: 1,
            borderRadius: "10px 10px 0px 0px",
          }}>
          <Box p={1}>
            <Box sx={{ color: "#adb3bc", display: "flex", justifyContent: "space-between" }}>
              <Typography fontSize="12px">{"ساعت"}</Typography>
              <Typography fontSize="12px">{"تاریخ"}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "12px",
                }}>{`${booking.start_time} تا ${booking.end_time}`}</Typography>
              <Typography sx={{ color: "#4785ff", fontWeight: 500, fontSize: "12px" }}>
                {`${persianDate}`}
              </Typography>
            </Box>
          </Box>
          {/* <Link href={`/gym/${booking.gym_id}`}> */}
          <Link href={`/gyms/${booking.gym_id}`}>
            <Box
              sx={{
                display: "flex",
                bgcolor: "#f6f9ff",
                my: 1,
                px: 1,
                gap: 1,
              }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  sx={{
                    mt: "5px",
                    fontSize: 13,
                    fontWeight: 700,
                  }}>
                  {booking.gym_name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 500,
                  }}>
                  {booking.gym_address}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="end"
                  mt={1}
                  gap={0.5}>
                  <Typography
                    variant="h6"
                    fontSize={18}
                    fontWeight="bold"
                    color="black">
                    {booking.final_price.toLocaleString()}
                  </Typography>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 22 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4.78516 0.546875L6.01562 1.77734L4.78516 3.00098L3.56152 1.77734L4.78516 0.546875ZM4.87402 8.06641C5.53483 8.06641 6.05436 7.96159 6.43262 7.75195C6.81543 7.54232 7.08659 7.25749 7.24609 6.89746C7.4056 6.53743 7.48535 6.12728 7.48535 5.66699C7.48535 5.1748 7.4056 4.66895 7.24609 4.14941C7.09115 3.62988 6.91569 3.13086 6.71973 2.65234L8.54492 1.96875C8.80469 2.65234 8.98698 3.28353 9.0918 3.8623C9.19661 4.43652 9.24902 5.02214 9.24902 5.61914C9.24902 6.52604 9.08268 7.30762 8.75 7.96387C8.41732 8.62467 7.92513 9.13281 7.27344 9.48828C6.6263 9.84375 5.8265 10.0215 4.87402 10.0215C3.89421 10.0215 3.08529 9.83236 2.44727 9.4541C1.8138 9.0804 1.3444 8.56999 1.03906 7.92285C0.733724 7.28027 0.581055 6.55111 0.581055 5.73535C0.581055 5.19303 0.640299 4.63249 0.758789 4.05371C0.877279 3.47038 1.04818 2.8916 1.27148 2.31738L2.93262 2.95312C2.764 3.4362 2.62272 3.90788 2.50879 4.36816C2.39486 4.82845 2.33789 5.25911 2.33789 5.66016C2.33789 6.09766 2.41536 6.4987 2.57031 6.86328C2.72526 7.22786 2.9873 7.51953 3.35645 7.73828C3.72559 7.95703 4.23145 8.06641 4.87402 8.06641ZM0.916016 10.3477H2.78906V16.6641C2.78906 17.1517 2.85514 17.5003 2.9873 17.71C3.12402 17.9196 3.41569 18.0244 3.8623 18.0244H4.02637V20H3.8623C2.84147 20 2.09408 19.7357 1.62012 19.207C1.15072 18.6784 0.916016 17.8854 0.916016 16.8281V10.3477ZM8.2373 16.2881C8.0459 16.2881 7.875 16.3519 7.72461 16.4795C7.57422 16.6025 7.44206 16.7529 7.32812 16.9307C7.21875 17.1038 7.12533 17.2725 7.04785 17.4365C7.18001 17.555 7.30534 17.6576 7.42383 17.7441C7.54688 17.8307 7.66081 17.9036 7.76562 17.9629C7.92969 18.0586 8.0778 18.1247 8.20996 18.1611C8.34668 18.1976 8.46745 18.2158 8.57227 18.2158C8.81836 18.2158 8.99154 18.1292 9.0918 17.9561C9.19661 17.7829 9.24902 17.5824 9.24902 17.3545C9.24902 17.0628 9.15788 16.8122 8.97559 16.6025C8.79785 16.3929 8.55176 16.2881 8.2373 16.2881ZM8.56543 20.1572C8.25098 20.1572 7.9502 20.1094 7.66309 20.0137C7.37598 19.9225 7.09798 19.7972 6.8291 19.6377C6.56022 19.4782 6.29362 19.2982 6.0293 19.0977C5.86523 19.2663 5.69661 19.4189 5.52344 19.5557C5.35482 19.6878 5.1543 19.7949 4.92188 19.877C4.69401 19.959 4.4069 20 4.06055 20H3.77344V18.0244H4.02637C4.24967 18.0244 4.4502 17.9378 4.62793 17.7646C4.80566 17.5869 4.97884 17.3613 5.14746 17.0879C5.31608 16.8099 5.49154 16.5182 5.67383 16.2129C5.86068 15.9076 6.06803 15.6182 6.2959 15.3447C6.52376 15.0667 6.79036 14.8411 7.0957 14.668C7.4056 14.4948 7.76562 14.4082 8.17578 14.4082C8.75 14.4082 9.24674 14.5449 9.66602 14.8184C10.0853 15.0872 10.4089 15.445 10.6367 15.8916C10.8646 16.3337 10.9785 16.8167 10.9785 17.3408C10.9785 17.8786 10.8896 18.3594 10.7119 18.7832C10.5342 19.207 10.2653 19.542 9.90527 19.7881C9.5498 20.0342 9.10319 20.1572 8.56543 20.1572ZM14.6973 14.2168C15.1484 14.2168 15.5404 14.3216 15.873 14.5312C16.2103 14.7409 16.4928 15.028 16.7207 15.3926C16.9531 15.7526 17.1331 16.1605 17.2607 16.6162C17.3929 17.0674 17.4772 17.5368 17.5137 18.0244H18.0195V20H17.377C17.2038 20.6927 16.9189 21.2852 16.5225 21.7773C16.1305 22.2695 15.6201 22.6751 14.9912 22.9941C14.3623 23.3132 13.6081 23.557 12.7285 23.7256L12.0518 21.9004C12.626 21.7865 13.1569 21.6383 13.6445 21.4561C14.1367 21.2783 14.5514 21.0664 14.8887 20.8203C15.2305 20.5742 15.4583 20.3008 15.5723 20H14.9297C14.0137 20 13.3118 19.8086 12.8242 19.4258C12.3411 19.0384 12.0996 18.4141 12.0996 17.5527C12.0996 17.2109 12.152 16.8486 12.2568 16.4658C12.3617 16.0785 12.5189 15.7161 12.7285 15.3789C12.9427 15.0371 13.2139 14.7591 13.542 14.5449C13.8701 14.3262 14.2552 14.2168 14.6973 14.2168ZM14.9229 18.0244H15.7979C15.7796 17.8285 15.7454 17.6234 15.6953 17.4092C15.6452 17.195 15.5768 16.9945 15.4902 16.8076C15.4036 16.6208 15.2943 16.4681 15.1621 16.3496C15.0299 16.2266 14.8704 16.165 14.6836 16.165C14.4694 16.165 14.2985 16.2425 14.1709 16.3975C14.0479 16.5524 13.959 16.7324 13.9043 16.9375C13.8542 17.1426 13.8291 17.3226 13.8291 17.4775C13.8291 17.7191 13.9294 17.8717 14.1299 17.9355C14.335 17.9948 14.5993 18.0244 14.9229 18.0244ZM17.7598 18.0244H18.2451V20H17.7598V18.0244ZM20.7881 11.0244L21.957 12.1865L20.7881 13.3623L19.6191 12.1865L20.7881 11.0244ZM18.4775 11.0244L19.6533 12.1865L18.4775 13.3623L17.3154 12.1865L18.4775 11.0244ZM18.8262 20H18.0674V18.0244H18.8125C19.2135 18.0244 19.5189 17.9561 19.7285 17.8193C19.9382 17.6781 20.043 17.3955 20.043 16.9717C20.043 16.7165 20.0156 16.3883 19.9609 15.9873C19.9062 15.5817 19.8105 15.1169 19.6738 14.5928L21.4443 14.1143C21.5628 14.5837 21.6517 15.0348 21.7109 15.4678C21.7702 15.9007 21.7998 16.32 21.7998 16.7256C21.7998 17.3864 21.7041 17.9629 21.5127 18.4551C21.3213 18.9427 21.0091 19.3232 20.5762 19.5967C20.1432 19.8656 19.5599 20 18.8262 20Z"
                      fill="black"
                    />
                  </svg>
                </Box>
              </Box>
              <CardMedia
                image={`${API_BASE_URL}/medias/profile/${booking.profile}`}
                sx={{
                  height: 60,
                  width: 60,
                  borderRadius: "10px",
                  my: "auto",
                }}
              />
            </Box>
          </Link>
          {(outdate || booking.used) && !booking.comment ? (
            <div style={{ position: "relative", display: "flex" }}>
              <Typography
                sx={{
                  color: "#f00",
                  position: "absolute",
                  zIndex: 10,
                  bottom: 40,
                  right: 30,
                  px: 1,
                  border: "2px solid #f00",
                }}>
                {"منقضی شد"}
                <Typography variant="body2">{booking.used ? "استفاده شده!" : "استفاده نشد!"}</Typography>
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenCommentModal}
                sx={{
                  mt: 2,
                  mx: "auto",
                  width: "92%",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}>
                افزودن نظر
              </Button>
            </div>
          ) : (outdate || booking.used) && booking.comment ? (
            <Typography sx={{ fontSize: 14, color: "#888", textAlign: "center", mt: 2 }}>
              شما قبلا نظر خود را ثبت کرده اید
            </Typography>
          ) : null}

          {/* Comment Modal */}
          <Dialog
            open={openCommentModal}
            onClose={handleCloseCommentModal}>
            <DialogTitle>
              <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2, textAlign: "right" }}>
                :ثبت نظر شما
              </Typography>
            </DialogTitle>

            <DialogContent>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="...نظر خود را بنویسید"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  textAlign: "right",
                }}
                inputProps={{ style: { textAlign: "right" } }}
              />
              <Rating
                name="simple-controlled"
                value={rate}
                onChange={(event, newValue) => {
                  setRate(newValue);
                }}
                precision={1}
                max={5}
                sx={{
                  mb: 2,
                  direction: "rtl",
                }}
              />
            </DialogContent>
            <DialogActions>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCommentSubmit}
              disabled={loading}
              sx={{
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "ارسال نظر"}
            </Button>
          </DialogActions>
          </Dialog>
        </Box>
        <Box sx={{ height: outdate ? 11 : 20, overflow: "hidden" }}>
          <div className={styles.rip} />
        </Box>
        {!outdate && !booking.used ? (
          <>
            <Box
              sx={{
                bgcolor: "#fff",
                pt: 1,
                borderRadius: "0px 0px 10px 10px",
              }}>
              {/* <Box sx={{ bgcolor: "#000", height: 50, mx: 2 }} /> */}
              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                py={1}>
                {/* <Box
            sx={{
              width: 40,
            }}
          /> */}
                <Typography sx={{ color: "#F95A00", fontWeight: 900, fontSize: 30 }}>
                  {booking.confirmation_code}
                </Typography>
                {/* <IconButton
            sx={{
              bgcolor: "#F4F4F4",
            }}>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.96796 13.4338V18.9161C4.96796 20.2916 6.08497 21.408 7.46129 21.408H18.432C19.8083 21.408 20.9253 20.2916 20.9253 18.9161V13.4338"
                stroke="#A9A9A9"
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                d="M12.9466 4.46289V16.4242"
                stroke="#A9A9A9"
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
              <path
                d="M8.95728 12.9355L12.9466 16.9226L16.9359 12.9355"
                stroke="#A9A9A9"
                strokeWidth="3"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
            </svg>
          </IconButton> */}
              </Box>
            </Box>
          </>
        ) : null}
      </div>
    </Grid>
  );
};

export default ReservationCard;
