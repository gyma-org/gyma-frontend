import { BottomNavigationAction } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: "#007AFF",
    color: "#fff",
    transform: "translateY(-20px)",
    borderRadius: "24px",
  },
  "&.MuiBottomNavigationAction-root": {
    padding: 1,
  },
}));

export default CustomBottomNavigationAction;
