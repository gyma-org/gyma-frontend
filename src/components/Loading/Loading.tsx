import { Box } from "@mui/material";
import "./style.css";

const Loading = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 10,
      }}>
      <div className="loader"></div>
    </Box>
  );
};

export default Loading;
