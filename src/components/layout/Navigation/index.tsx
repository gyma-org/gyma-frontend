import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper, Typography } from "@mui/material";
import CustomBottomNavigationAction from "./CustomBottomNavigationAction";

const Navigation = ({
  value,
  setValue,
}: {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 1,
        boxShadow: "0px -7px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 40,
      }}
      elevation={3}>
      <BottomNavigation
        sx={{
          height: {
            xs: 70,
            md: 80,
          },
          gap: 1,
          px: 2,
        }}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}>
        <CustomBottomNavigationAction
          label={
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: 14, md: 18 },
              }}
            >
              {"نقشه"}
            </Typography>
          }
          icon={
            <img
              src="/icons/nav/map.svg"
              alt="map icon"
              width={38}
              height={38}
              style={{
                filter: value === 0 ? 'brightness(0) invert(1)' : 'none', // Optional styling for active state
              }}
            />
          }
        />
        <CustomBottomNavigationAction
          label={
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: 14, md: 18 },
              }}
            >
              {"موردعلاقه ها"}
            </Typography>
          }
          icon={
            <img
              src="/icons/nav/favorites.svg"
              alt="favorites icon"
              width={32}
              height={32}
              style={{
                filter: value === 1 ? 'brightness(0) invert(1)' : 'none', // Optional: mimic active/inactive visual style
              }}
            />
          }
        />
        <CustomBottomNavigationAction
          label={
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: 14, md: 18 },
              }}
            >
              {"رزرو ها"}
            </Typography>
          }
          icon={
            <img
              src="/icons/nav/reservations.svg"
              alt="reservations icon"
              width={32}
              height={32}
              style={{
                filter: value === 2 ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          }
        />
        <CustomBottomNavigationAction
          label={
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: 14, md: 18 },
              }}
            >
              {"پروفایل"}
            </Typography>
          }
          icon={
            <img
              src="/icons/nav/profile.svg"
              alt="profile icon"
              width={32}
              height={32}
              style={{
                filter: value === 3 ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          }
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation;