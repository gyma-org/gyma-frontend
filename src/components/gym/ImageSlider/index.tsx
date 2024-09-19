"use client";

import React from "react";
import Grid from "@mui/material/Grid2";
import { CardMedia } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "./swiper.css";

const ImageSlider = () => {
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
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "100%", objectFit: "cover", aspectRatio: "4 / 3" }}
            image="https://placehold.co/600x400"
            title="place holder"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "100%", objectFit: "cover", aspectRatio: "4 / 3" }}
            image="https://placehold.co/600x400"
            title="place holder"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "100%", objectFit: "cover", aspectRatio: "4 / 3" }}
            image="https://placehold.co/600x400"
            title="place holder"
          />
        </SwiperSlide>
      </Swiper>
    </Grid>
  );
};

export default ImageSlider;
