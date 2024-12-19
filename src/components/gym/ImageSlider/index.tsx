"use client";

import React from "react";
import Grid from "@mui/material/Grid2";
import { CardMedia } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { API_BASE_URL } from "@/config";

import "./swiper.css";

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  return (
    <Grid
      size={{ xs: 12, md: 6 }}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        borderRadius: { xs: 0, md: 8 },
        overflow: "hidden",
      }}>
      <Swiper
        style={{
          position: "absolute",
          width: "100%",
        }}
        pagination={{
          dynamicBullets: true,
        }}
        grabCursor={true}
        effect={"creative"}
        modules={[Pagination]}
        className="mySwiper">
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <CardMedia
              component="img"
              sx={{ width: "100%", objectFit: "cover", aspectRatio: "4 / 3" }}
              image={`${API_BASE_URL}/medias/gallery/${image}`}
              title={`Gallery Image ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Grid>
  );
};

export default ImageSlider;
