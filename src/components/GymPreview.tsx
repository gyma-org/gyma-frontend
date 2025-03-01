import { Gym } from "@/api/gymMap";
import { API_BASE_URL } from "@/config";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, CardMedia, Divider, Rating, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import React from "react";

import "./gym/ImageSlider/swiper.css";

const GymPreview = ({
  gym,
  handleBack,
  maxWidth = 500,
  onBack
}: {
  gym: Gym;
  handleBack: () => void;
  maxWidth?: number;
  onBack: () => void;
}) => {
  const { name, city, address, rate, profile, gallery } = gym;
  const images = [`${API_BASE_URL}/medias/profile/${profile}`, ...(Array.isArray(gallery) ? gallery.map(img => `${API_BASE_URL}/medias/gallery/${img}`) : [])];
  const onClick = () => {
    window.location.href = `/gyms/${gym.id}`;
  };
  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        px={2}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: "8px",
            fontSize: { xs: 10, md: 14 },
            px: 1,
            py: { xs: 0.1, md: 0.5 },
          }}
          onClick={() => {
            handleBack(); // Close the Gym Preview
            onBack(); // Zoom out the map
          }}
        >
          بازگشت
          <ArrowBack />
        </Button>
      </Box>
      <Box
        sx={{
          // boxShadow: "0px 0px 5px #00000040",
          direction: "rtl",
          borderRadius: "16px",
          maxWidth: maxWidth,
          width: "92vw",
          mx: { xs: "auto", md: 0 },
          p: 1,
          mt: 1,
          display: "flex",
          flexDirection: "column",
        }}>
        <Box
          sx={{
            width: "100%",
            mx: { xs: "auto", md: 0 },
            aspectRatio: "4/1",
            display: "flex",
            mb: 1,
          }}>
          {/* Save button */}
          {/* <Box>
            <IconButton
              sx={{ p: 0.4, ml: 1 }}
              onClick={handleSaveClick}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 13.5C6 9.25736 6 7.13604 7.31802 5.81802C8.63604 4.5 10.7574 4.5 15 4.5H21C25.2426 4.5 27.364 4.5 28.682 5.17157C30 7.13604 30 9.25736 30 13.5V23.7414C30 27.7663 30 29.7788 28.7336 30.3943C27.4671 31.0099 25.8847 29.7665 22.7198 27.2798L21.7069 26.484C19.9274 25.0858 19.0376 24.3867 18 24.3867C16.9624 24.3867 16.0726 25.0858 14.2931 26.484L13.2802 27.2798C10.1153 29.7665 8.53288 31.0099 7.26644 30.3943C6 29.7788 6 27.7663 6 23.7414V13.5Z"
                  fill={isSaved ? "orange" : ""}
                  stroke="black"
                />
              </svg>
            </IconButton>
          </Box> */}

          {/* Card data */}
          <Box
            sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            onClick={onClick}>
            <Box>
              <Typography
                noWrap
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: 16, md: 18 },
                }}>
                {name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.5 8.3C3.5 6.61984 3.5 5.77976 3.82698 5.13803C4.1146 4.57354 4.57354 4.1146 5.13803 3.82698C5.77976 3.5 6.61984 3.5 8.3 3.5H15.7C17.3802 3.5 18.2202 3.5 18.862 3.82698C19.4265 4.1146 19.8854 4.57354 20.173 5.13803C20.5 5.77976 20.5 6.61984 20.5 8.3V15.7C20.5 17.3802 20.5 18.2202 20.173 18.862C19.8854 19.4265 19.4265 19.8854 18.862 20.173C18.2202 20.5 17.3802 20.5 15.7 20.5H8.3C6.61984 20.5 5.77976 20.5 5.13803 20.173C4.57354 19.8854 4.1146 19.4265 3.82698 18.862C3.5 18.2202 3.5 17.3802 3.5 15.7V8.3Z"
                    stroke="#33363F"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.5 9.5H9C10.6569 9.5 12 10.8431 12 12.5V17M6.5 9.5L8 8M6.5 9.5L8 11"
                    stroke="#33363F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 9.5H15C13.3431 9.5 12 10.8431 12 12.5V17M17.5 9.5L16 8M17.5 9.5L16 11"
                    stroke="#33363F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Typography
                  sx={{ fontSize: { xs: 8, md: 9 } }}
                  noWrap>
                  {city}, {address}
                </Typography>
                <Box
            display="flex"
            alignItems="center"
            gap={1}>
          </Box>
              </Box>
              <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "auto",
            }}
          >
            <Box sx={{ flexGrow: 1 }}> {/* Push content to the right */}
              {rate ? (
                <Rating size="small" value={parseFloat(rate)} readOnly />
              ) : (
                <Box
                  sx={{
                    display: "inline-block",
                    backgroundColor: "#E0F7FA",
                    color: "#00796B",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  جدید
                </Box>
              )}
            </Box>
        </Box>
            </Box>
          </Box>

          

        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            // gap: 0.5,
            // overflowX: "auto",
            // width: "100%",
            // borderRadius: "8px",
            // pb: 0.5,
            // maxHeight: "400px",
          }}
        >
          {/* Image Slider using Swiper */}
        <Box
          sx={{
            width: 100,
            height: 100, // Ensure Box has a fixed size
            overflow: "hidden",
            borderRadius: "16px",
            ml: -1, // Move slightly to the left
          }}
        >
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            grabCursor={true}
            modules={[Pagination]}
            style={{ width: 150, height: 150 }} // Fix Swiper size
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: "150px", // Explicitly set width
                    height: "150px", // Explicitly set height
                    objectFit: "contain", // Ensure the whole image fits without cropping
                    borderRadius: "16px",
                  }}
                  image={image}
                  title={`Gallery Image ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        </Box>
        </Box>
       
        <Divider />
        <Button
          variant="outlined"
          sx={{
            borderRadius: "12px",
            mt: 1,
          }}
          color="primary"
          onClick={onClick}>
          رفتن به صفحه باشگاه و رزرو
        </Button>
      </Box>
    </>
  );
};

export default GymPreview;
