import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Box,
  InputBase,
  styled,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ListItemButton,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { searchGyms, Gym } from "@/api/Search";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Media query to detect desktop screens
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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
        if (!isDesktop) setSearchOpen(false);
      }
    };

    if (openResults || searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openResults, searchOpen, isDesktop]);

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
  };

  // Ensure search bar is always open on desktop
  useEffect(() => {
    if (isDesktop) {
      setSearchOpen(true);
    }
  }, [isDesktop]);

  return (
    <Box ref={searchRef} sx={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {/* Logo - Fixed to Left Side */}
      <Box
        component="img"
        src="/icons/192x192.png"
        alt="Logo"
        sx={{
          height: 60,
          cursor: "pointer",
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)"
        }}
      />

      {/* Search Button & Input */}
      {!isDesktop && (
          <IconButton 
            onClick={handleSearchOpen} 
            sx={{ 
              display: searchOpen ? "none" : "flex", 
              mr: { xs: 2, sm: 5, md: 10 }, 
              p: 1, // Increase padding to make the button larger
              fontSize: "1rem" // Increase icon size
            }}
          >
            <SearchIcon sx={{ fontSize: "2rem" }} /> {/* Increase icon size */}
          </IconButton>
        )}

      <Slide direction="down" in={searchOpen} mountOnEnter unmountOnExit>
        <Box 
          sx={{
            position: "relative", 
            flexGrow: 1, 
            display: searchOpen ? "block" : "none", 
            width: searchOpen ? "100%" : "0%", 
            transition: "width 0.3s ease-in-out"
          }}
        >
          <BootstrapInput
            ref={inputRef}
            placeholder="جستجو ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setOpenResults(true)}
            sx={{
              width: "100%",
              opacity: searchOpen ? 1 : 0,
              transition: "opacity 0.3s ease-in-out"
            }}
          />
          
          {/* Close button only on mobile */}
          {!isDesktop && (
            <IconButton 
              onClick={() => setSearchOpen(false)} 
              sx={{ position: "absolute", left: 10, top: 5 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Slide>

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
            zIndex: 9999,
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
