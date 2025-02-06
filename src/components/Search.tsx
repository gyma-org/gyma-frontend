import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Box, InputBase, styled, Paper, List, ListItem, ListItemText, CircularProgress, ListItemButton  } from "@mui/material";
import { searchGyms, Gym } from "@/api/Search";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  borderColor: "#B9B9B9",
  backgroundColor: "#fff",
  border: "1px solid",
  padding: "10px",
  direction: "rtl",
  borderRadius: "18px",
  width: "100%",
  maxWidth: 600,
  "& .MuiInputBase-input": {
    backgroundColor: "#fff",
    position: "relative",
    fontSize: 16,
    width: "100%",
  },
}));

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSearchResults = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await searchGyms(query);
      setSearchResults(results.gyms_by_name);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length >= 3) {
        fetchSearchResults(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchSearchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpenResults(false);
      }
    };

    if (openResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openResults]);

  return (
    <Box ref={searchRef} sx={{ position: "relative", width: "100%", maxWidth: 600 }}>
      <BootstrapInput
        placeholder="جستجو ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setOpenResults(true)}
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

      {/* Dropdown Results */}
      {openResults && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: "100%",
            maxHeight: 200,
            overflowY: "auto",
            borderRadius: "10px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
            zIndex: 9999, // Ensures dropdown stays above other elements
          }}
        >
          <List>
            {loading ? (
              <ListItem>
                <CircularProgress size={24} sx={{ mx: "auto" }} />
              </ListItem>
            ) : hasSearched && searchResults.length === 0 ? (
              <ListItem>
                <ListItemText primary="نتیجه‌ای یافت نشد" />
              </ListItem>
            ) : (
              searchResults.map((gym) => (
                <ListItem key={gym.id} disablePadding>
                  <Link href={`/gyms/${gym.id}`} passHref legacyBehavior>
                    <ListItemButton component="a" sx={{ textAlign: "right", width: "100%" }}>
                      <ListItemText primary={gym.name} secondary={gym.address} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Search;
