import { InputBase, styled } from "@mui/material";
import React from "react";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  borderColor: "#B9B9B9",
  backgroundColor: "#fff",
  border: "1px solid",
  padding: "10px",
  direction: "rtl",
  borderRadius: "18px",
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    backgroundColor: "#fff",
    position: "relative",
    fontSize: 16,
    width: "auto",
  },
}));

const Search = () => {
  return (
    <BootstrapInput
      placeholder="جستجو ..."
      sx={{ width: "100%", maxWidth: 600 }}
      startAdornment={
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14.6666" cy="14.6666" r="9.33333" stroke="#33363F" strokeWidth="2" />
          <path
            d="M14.6667 10.6667C14.1414 10.6667 13.6213 10.7702 13.136 10.9712C12.6507 11.1722 12.2097 11.4668 11.8383 11.8383C11.4668 12.2097 11.1722 12.6507 10.9712 13.136C10.7701 13.6213 10.6667 14.1414 10.6667 14.6667"
            stroke="#33363F"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M26.6667 26.6667L22.6667 22.6667" stroke="#33363F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
    />
  );
};

export default Search;
