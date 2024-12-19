import {
  Avatar,
  Box,
  Button,
  CardMedia,
  Container,
  IconButton,
  Typography,
  TextField,
  Modal,
  styled,
  InputBase,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState, useContext } from "react";
import { fetchProfile } from "../../api/profile";
import { fetchUserWallet } from "../../api/UserWallet";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "../../types/profile";
import { UserWallet } from "../../types/UserWallet";
import { UserUpdate } from "../../types/UserUpdate";
import { updateUserProfile } from "../../api/UserUpdate";
import { goToGateway } from "../../api/GatewayAdd";
import { GoToGatewayRequest } from "../../types/GatewayAdd";
import { format, differenceInCalendarDays, parseISO } from "date-fns";
import { faIR } from "date-fns/locale";
import jMoment from "jalali-moment";
import { API_USER_URL } from "@/config";
import { ArrowBack, Edit } from "@mui/icons-material";

const PROFILE_BASE_URL = `${API_USER_URL}/medias/profile/`;
const BANNER_BASE_URL = `${API_USER_URL}/medias/banner/`;

const Profile = () => {
  const { authTokens, logoutUser } = useAuth();
  const [UserProfile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({
    first_name: null,
    last_name: null,
    avatar: "",
    imageUrl: "",
  });

  const [rawAmount, setRawAmount] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState("");
  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => setOpenModal(false);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/,/g, ""); // Remove commas if any
    const numericValue = Number(rawValue);
    const formattedValue = new Intl.NumberFormat().format(numericValue);

    setAmount(formattedValue); // Display the formatted value
    setRawAmount(numericValue); // Store the raw numeric value
  };

  const handleAddBalance = async () => {
    if (!authTokens?.access) {
      setError("No access token found");
      return;
    }

    if (rawAmount === null) {
      setError("Please enter a valid amount.");
      return;
    }

    const data: GoToGatewayRequest = {
      price: rawAmount,
    };

    try {
      setLoading(true);
      const htmlForm = await goToGateway(data, authTokens.access); // Get the HTML response

      // Create a new window to submit the form
      const newWindow = window.open();

      if (newWindow) {
        newWindow.document.write(htmlForm); // Write the form to the new window
        newWindow.document.close(); // Close the document to allow form submission

        // Cast to HTMLFormElement to access the submit method
        const formElement = newWindow.document.getElementById("id_form") as HTMLFormElement;
        formElement?.submit(); // Submit the form to the payment gateway
      }

      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error("Failed to initiate payment:", error);
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the profile data on component mount
  useEffect(() => {
    const getProfile = async () => {
      if (authTokens?.access) {
        // Ensure there's an access token
        try {
          // Fetch profile and wallet in parallel
          const profileData = await fetchProfile(authTokens.access, logoutUser); 
          const walletData = await fetchUserWallet(authTokens.access);  // Get wallet data

          setProfile(profileData);
          setWallet(walletData);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError("No access token found");
        setLoading(false);
      }
    };

    getProfile();
  }, [authTokens, logoutUser]); // Re-run when authTokens change

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Ensure dateJoined is available
  const dateJoined = UserProfile?.date_joined || ""; // Default to empty string if undefined

  // Parse the date and calculate days since joining
  let daysSinceJoined = 0;
  let formattedJoinDate = "";

  if (dateJoined) {
    const joinedDate = parseISO(dateJoined);
    daysSinceJoined = differenceInCalendarDays(new Date(), joinedDate);
    formattedJoinDate = format(joinedDate, "yyyy/MM/dd", { locale: faIR });
    formattedJoinDate = jMoment(joinedDate).locale("fa").format("YYYY/MM/DD"); // Use the appropriate format for your needs
  }

  const handleEdit = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const handleSubmit = async () => {
    if (authTokens?.access) {
      try {
        setLoading(true);
        const formDataToSend = new FormData();
  
        formDataToSend.append("first_name", formData.first_name || UserProfile?.first_name);
        formDataToSend.append("last_name", formData.last_name || UserProfile?.last_name);
  
        if (formData.avatar) {
          formDataToSend.append("profile", formData.avatar); // Attach the file if present
        }
  
        if (formData.coverImage) {
          formDataToSend.append("banner", formData.coverImage); // Attach banner only if available
        }
  
        const response = await updateUserProfile(authTokens.access, formDataToSend);
  
        if (response.success) {
          setError(null);
          await fetchProfile(authTokens.access, logoutUser); // Refresh profile data
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
        setEditMode(false); // Exit edit mode
      }
    } else {
      setError("No access token found");
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrlAvatar = URL.createObjectURL(file);
      setFormData((prevFormData: any) => ({
        ...prevFormData, // Retain other fields
        avatar: file, // Update avatar field
        previewAvatar: previewUrlAvatar, // Add avatar preview
      }));
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrlCover = URL.createObjectURL(file);
      setFormData((prevFormData: any) => ({
        ...prevFormData, // Retain other fields
        coverImage: file, // Update cover image field
        previewCover: previewUrlCover, // Add cover image preview
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "file") {
      // If the input is a file input, handle it differently
      const file = e.target.files?.[0];
      if (file) {
        // Update formData for file (for file inputs)
        setFormData({
          ...formData,
          [e.target.name]: file,
        });
      }
    } else {
      // For regular text inputs
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <Grid
      container
      maxWidth={700}
      mx="auto"
      sx={{ p: 1, pb: 13 }}>
      {/* User Card */}
      <Box
        sx={{
          border: "1px solid #D5E0F6",
          width: "100%",
          borderRadius: "24px",
          boxShadow: "0px 0px 10px #00000040",
          p: 1,
          mt: 3,
          mx: "auto",
          position: "relative",
        }}>
        <Box>
          <CardMedia
            sx={{
              width: "100%",
              aspectRatio: "4 / 1",
              borderRadius: "18px",
              marginTop: 2,
              boxShadow: "0px 0px 10px #00000040",
              position: "relative",
            }}
            image={
              formData.previewCover ||
              `${BANNER_BASE_URL}${UserProfile?.banner}` ||
              "https://placehold.co/600x400/F95A00/F95A00"
            }>
            {editMode && (
              <IconButton
                sx={{
                  position: "absolute",
                  top: "5%",
                  right: "1.5%",
                  fontSize: { xs: 12, md: 20 },
                  padding: { xs: 1, md: 2 },
                  borderRadius: 2,
                  height: { xs: 24, md: 30 },
                  width: { xs: 24, md: 30 },
                  bgcolor: "#F95A00",
                }}
                component="label">
                <Edit sx={{ fontSize: { xs: 12, md: 20 }, color: "#fff" }} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
              </IconButton>
            )}
          </CardMedia>
        </Box>
        <Box sx={{ position: "relative", display: "block", height: { xs: 60, md: 100 } }}>
          <Avatar
            sx={{
              height: { xs: 100, md: 150 },
              width: { xs: 100, md: 150 },
              border: "5px solid #fff",
              position: "absolute",
              right: "5%",
              top: "-60%",
            }}
            src={
              formData.previewAvatar ||
              `${PROFILE_BASE_URL}${UserProfile?.profile}` ||
              "https://placehold.co/600x400/F95A00/F95A00"
            }
          />
          {editMode && (
            <IconButton
              sx={{
                position: "absolute",
                top: { xs: 15, md: 50 },
                right: "5%",
                bgcolor: "#22668D",
                fontSize: { xs: 12, md: 20 },
                padding: { xs: 1, md: 2 },
                height: { xs: 24, md: 30 },
                width: { xs: 24, md: 30 },
                "&:hover": {
                  bgcolor: "#22668D",
                  filter: "brightness(90%)",
                },
              }}
              component="label">
              <Edit sx={{ fontSize: { xs: 12, md: 20 }, color: "#fff" }} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </IconButton>
          )}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: 0,
              mx: 2,
            }}>
            {editMode ? (
              <IconButton
                onClick={handleEdit}
                sx={{
                  height: { xs: "28px", md: "48px" },
                  width: { xs: "28px", md: "48px" },
                  borderRadius: 2,
                  bgcolor: "#F95A00",
                  "&: hover": {
                    bgcolor: "#F95A00",
                    filter: "brightness(90%)",
                  },
                }}>
                <ArrowBack sx={{ color: "#fff" }} />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleEdit}
                sx={{
                  height: { xs: "28px", md: "48px" },
                  width: { xs: "28px", md: "48px" },
                  borderRadius: 2,
                  bgcolor: "#F95A00",
                  "&: hover": {
                    bgcolor: "#F95A00",
                    filter: "brightness(90%)",
                  },
                }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <mask
                    id="path-1-outside-1_258_3674"
                    maskUnits="userSpaceOnUse"
                    x="3"
                    y="4"
                    width="17"
                    height="17"
                    fill="black">
                    <rect
                      fill="white"
                      x="3"
                      y="4"
                      width="17"
                      height="17"
                    />
                    <path d="M13.5858 7.41421L6.39171 14.6083C6.19706 14.8029 6.09974 14.9003 6.03276 15.0186C5.96579 15.1368 5.93241 15.2704 5.86564 15.5374L5.20211 18.1915C5.11186 18.5526 5.06673 18.7331 5.16682 18.8332C5.2669 18.9333 5.44742 18.8881 5.80844 18.7979L5.80845 18.7979L8.46257 18.1344C8.72963 18.0676 8.86316 18.0342 8.98145 17.9672C9.09974 17.9003 9.19706 17.8029 9.39171 17.6083L16.5858 10.4142L16.5858 10.4142C17.2525 9.74755 17.5858 9.41421 17.5858 9C17.5858 8.58579 17.2525 8.25245 16.5858 7.58579L16.4142 7.41421C15.7475 6.74755 15.4142 6.41421 15 6.41421C14.5858 6.41421 14.2525 6.74755 13.5858 7.41421Z" />
                  </mask>
                  <path
                    d="M6.39171 14.6083L7.80593 16.0225L7.80593 16.0225L6.39171 14.6083ZM13.5858 7.41421L12.1716 6L12.1716 6L13.5858 7.41421ZM16.4142 7.41421L15 8.82843L15 8.82843L16.4142 7.41421ZM16.5858 7.58579L18 6.17157L18 6.17157L16.5858 7.58579ZM16.5858 10.4142L18 11.8284L16.5858 10.4142ZM9.39171 17.6083L7.9775 16.1941L7.9775 16.1941L9.39171 17.6083ZM5.86564 15.5374L7.80593 16.0225L7.80593 16.0225L5.86564 15.5374ZM5.20211 18.1915L3.26183 17.7065H3.26183L5.20211 18.1915ZM5.80845 18.7979L5.32338 16.8576L5.23624 16.8794L5.15141 16.9089L5.80845 18.7979ZM8.46257 18.1344L7.97751 16.1941L7.9775 16.1941L8.46257 18.1344ZM5.16682 18.8332L6.58103 17.419L6.58103 17.419L5.16682 18.8332ZM5.80844 18.7979L6.29351 20.7382L6.38065 20.7164L6.46549 20.6869L5.80844 18.7979ZM8.98145 17.9672L7.99605 16.2268L7.99605 16.2268L8.98145 17.9672ZM16.5858 10.4142L18 11.8284L18 11.8284L16.5858 10.4142ZM6.03276 15.0186L4.29236 14.0332L4.29236 14.0332L6.03276 15.0186ZM7.80593 16.0225L15 8.82843L12.1716 6L4.9775 13.1941L7.80593 16.0225ZM15 8.82843L15.1716 9L18 6.17157L17.8284 6L15 8.82843ZM15.1716 9L7.9775 16.1941L10.8059 19.0225L18 11.8284L15.1716 9ZM3.92536 15.0524L3.26183 17.7065L7.1424 18.6766L7.80593 16.0225L3.92536 15.0524ZM6.29352 20.7382L8.94764 20.0746L7.9775 16.1941L5.32338 16.8576L6.29352 20.7382ZM3.26183 17.7065C3.233 17.8218 3.15055 18.1296 3.12259 18.4155C3.0922 18.7261 3.06509 19.5599 3.7526 20.2474L6.58103 17.419C6.84671 17.6847 6.99914 18.0005 7.06644 18.2928C7.12513 18.5478 7.10965 18.7429 7.10358 18.8049C7.09699 18.8724 7.08792 18.904 7.097 18.8631C7.10537 18.8253 7.11788 18.7747 7.1424 18.6766L3.26183 17.7065ZM5.15141 16.9089L5.1514 16.9089L6.46549 20.6869L6.46549 20.6869L5.15141 16.9089ZM5.32338 16.8576C5.22531 16.8821 5.17467 16.8946 5.13694 16.903C5.09595 16.9121 5.12762 16.903 5.19506 16.8964C5.25712 16.8903 5.45223 16.8749 5.70717 16.9336C5.99955 17.0009 6.31535 17.1533 6.58103 17.419L3.7526 20.2474C4.44011 20.9349 5.27387 20.9078 5.58449 20.8774C5.87039 20.8494 6.17822 20.767 6.29351 20.7382L5.32338 16.8576ZM7.9775 16.1941C7.95279 16.2188 7.9317 16.2399 7.91214 16.2593C7.89271 16.2787 7.87671 16.2945 7.86293 16.308C7.84916 16.3215 7.83911 16.3312 7.83172 16.3382C7.82812 16.3416 7.82545 16.3441 7.8236 16.3458C7.82176 16.3475 7.8209 16.3483 7.82092 16.3482C7.82094 16.3482 7.82198 16.3473 7.82395 16.3456C7.82592 16.3439 7.82893 16.3413 7.83291 16.338C7.84086 16.3314 7.85292 16.3216 7.86866 16.3098C7.88455 16.2979 7.90362 16.2843 7.92564 16.2699C7.94776 16.2553 7.97131 16.2408 7.99605 16.2268L9.96684 19.7076C10.376 19.476 10.6864 19.1421 10.8059 19.0225L7.9775 16.1941ZM8.94764 20.0746C9.11169 20.0336 9.55771 19.9393 9.96685 19.7076L7.99605 16.2268C8.02079 16.2128 8.0453 16.2001 8.06917 16.1886C8.09292 16.1772 8.11438 16.1678 8.13277 16.1603C8.15098 16.1529 8.16553 16.1475 8.17529 16.1441C8.18017 16.1424 8.18394 16.1412 8.18642 16.1404C8.1889 16.1395 8.19024 16.1391 8.19026 16.1391C8.19028 16.1391 8.18918 16.1395 8.18677 16.1402C8.18435 16.1409 8.18084 16.1419 8.17606 16.1432C8.16625 16.1459 8.15278 16.1496 8.13414 16.1544C8.11548 16.1593 8.09368 16.1649 8.0671 16.1716C8.04034 16.1784 8.0114 16.1856 7.97751 16.1941L8.94764 20.0746ZM15.1716 9C15.3435 9.17192 15.4698 9.29842 15.5738 9.40785C15.6786 9.518 15.7263 9.57518 15.7457 9.60073C15.7644 9.62524 15.7226 9.57638 15.6774 9.46782C15.6254 9.34332 15.5858 9.18102 15.5858 9H19.5858C19.5858 8.17978 19.2282 7.57075 18.9258 7.1744C18.6586 6.82421 18.2934 6.46493 18 6.17157L15.1716 9ZM18 11.8284L18 11.8284L15.1716 8.99999L15.1716 9L18 11.8284ZM18 11.8284C18.2934 11.5351 18.6586 11.1758 18.9258 10.8256C19.2282 10.4292 19.5858 9.82022 19.5858 9H15.5858C15.5858 8.81898 15.6254 8.65668 15.6774 8.53218C15.7226 8.42362 15.7644 8.37476 15.7457 8.39927C15.7263 8.42482 15.6786 8.482 15.5738 8.59215C15.4698 8.70157 15.3435 8.82807 15.1716 9L18 11.8284ZM15 8.82843C15.1719 8.6565 15.2984 8.53019 15.4078 8.42615C15.518 8.32142 15.5752 8.27375 15.6007 8.25426C15.6252 8.23555 15.5764 8.27736 15.4678 8.32264C15.3433 8.37455 15.181 8.41421 15 8.41421V4.41421C14.1798 4.41421 13.5707 4.77177 13.1744 5.07417C12.8242 5.34136 12.4649 5.70664 12.1716 6L15 8.82843ZM17.8284 6C17.5351 5.70665 17.1758 5.34136 16.8256 5.07417C16.4293 4.77177 15.8202 4.41421 15 4.41421V8.41421C14.819 8.41421 14.6567 8.37455 14.5322 8.32264C14.4236 8.27736 14.3748 8.23555 14.3993 8.25426C14.4248 8.27375 14.482 8.32142 14.5922 8.42615C14.7016 8.53019 14.8281 8.6565 15 8.82843L17.8284 6ZM4.9775 13.1941C4.85793 13.3136 4.52401 13.624 4.29236 14.0332L7.77316 16.0039C7.75915 16.0287 7.7447 16.0522 7.73014 16.0744C7.71565 16.0964 7.70207 16.1155 7.69016 16.1313C7.67837 16.1471 7.66863 16.1591 7.66202 16.1671C7.65871 16.1711 7.65613 16.1741 7.65442 16.1761C7.65271 16.178 7.65178 16.1791 7.65176 16.1791C7.65174 16.1791 7.65252 16.1782 7.65422 16.1764C7.65593 16.1745 7.65842 16.1719 7.66184 16.1683C7.66884 16.1609 7.67852 16.1508 7.692 16.1371C7.7055 16.1233 7.72132 16.1073 7.74066 16.0879C7.76013 16.0683 7.78122 16.0472 7.80593 16.0225L4.9775 13.1941ZM7.80593 16.0225C7.8144 15.9886 7.82164 15.9597 7.82839 15.9329C7.8351 15.9063 7.84068 15.8845 7.84556 15.8659C7.85043 15.8472 7.85407 15.8337 7.8568 15.8239C7.85813 15.8192 7.85914 15.8157 7.85984 15.8132C7.86054 15.8108 7.86088 15.8097 7.86088 15.8097C7.86087 15.8098 7.86046 15.8111 7.85965 15.8136C7.85884 15.8161 7.85758 15.8198 7.85588 15.8247C7.85246 15.8345 7.84713 15.849 7.8397 15.8672C7.8322 15.8856 7.82284 15.9071 7.81141 15.9308C7.79993 15.9547 7.78717 15.9792 7.77316 16.0039L4.29236 14.0332C4.06071 14.4423 3.96637 14.8883 3.92536 15.0524L7.80593 16.0225Z"
                    fill="white"
                    mask="url(#path-1-outside-1_258_3674)"
                  />
                  <path
                    d="M12.5 7.5L15.5 5.5L18.5 8.5L16.5 11.5L12.5 7.5Z"
                    fill="white"
                  />
                </svg>
              </IconButton>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            p: { xs: 1, md: 2 },
          }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}>
            {editMode ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  px: { xs: 1, md: 4 },
                  mb: { xs: 1, md: 2 },
                  width: "100%",
                }}>
                <Input
                  value={formData?.first_name !== null ? formData?.first_name : UserProfile?.first_name}
                  onChange={handleChange}
                  name="first_name"
                  fullWidth
                  placeholder="نام"
                />
                <Input
                  value={formData?.last_name !== null ? formData?.last_name : UserProfile?.last_name}
                  onChange={handleChange}
                  name="last_name"
                  fullWidth
                  placeholder="نام خانوادگی"
                />
                <CustomButton
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    width: "180px",
                  }}>
                  ذخیره تغییرات
                </CustomButton>
              </Box>
            ) : (
              <>
                <Typography
                  align="right"
                  sx={{ fontWeight: 600, fontSize: { xs: 18, md: 28 }, mb: 2 }}>
                  {`${UserProfile?.first_name} ${UserProfile?.last_name}`}
                </Typography>
              </>
            )}
            <Divider />
            <Typography
              align="left"
              sx={{ fontWeight: 700, fontSize: { xs: 13, md: 24 }, color: "#6B7387", mt: { xs: 1, md: 2 } }}>
              {UserProfile?.phone_number}
            </Typography>
            <Typography
              align="left"
              variant="body1">
              {UserProfile?.email || "user@example.com"}
            </Typography>
          </Box>
          {/* <Box sx={{ direction: "rtl", pt: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 12, md: 20 } }}>
              {`از تاریخ ${formattedJoinDate} همراه جیما بودی!`}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: { xs: 12, md: 20 } }}>
              {"تا الان 120 تا رزرو از 13 باشگاه انجام دادی!"}
            </Typography>
          </Box> */}
        </Box>
      </Box>

      {/* User Wallet */}
      <Grid
        size={{ xs: 12, md: 6.9 }}
        sx={{
          mt: 2,
          position: "relative",
          mx: "auto",
          boxShadow: "0px 0px 10px #00000040",
          borderRadius: "24px",
          overflow: "hidden",
        }}>
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 398 233"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect
            width="100%"
            height="232.483"
            rx="20"
            fill="url(#paint0_linear_0_1)"
          />
          <mask
            id="mask0_0_1"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100%"
            height="233">
            <rect
              width="100%"
              height="232.483"
              rx="20"
              fill="#ED713C"
            />
          </mask>
          <g mask="url(#mask0_0_1)">
            <ellipse
              opacity="0.1"
              cx="30.9556"
              cy="269.124"
              rx="202.79"
              ry="142.775"
              fill="black"
            />
            <ellipse
              opacity="0.08"
              cx="367.044"
              cy="-36.6413"
              rx="202.79"
              ry="142.775"
              fill="black"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_0_1"
              x1="69.9931"
              y1="-36.7078"
              x2="111.834"
              y2="289.191"
              gradientUnits="userSpaceOnUse">
              <stop stop-color="#E42C66" />
              <stop
                offset="1"
                stop-color="#F55B46"
              />
            </linearGradient>
          </defs>
        </svg>
        <Typography
          sx={{
            position: "absolute",
            top: "15%",
            right: "10%",
            fontWeight: 600,
            color: "#FFF9",
          }}>
          {"موجودی کیف پول"}
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            position: "absolute",
            direction: "rtl",
            top: "37%",
            // center x
            left: "50%",
            transform: "translateX(-50%)",
          }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="#fff">
            {`${wallet?.balance}`}
          </Typography>
          <svg
            width="26"
            height="26"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.78516 0.546875L6.01562 1.77734L4.78516 3.00098L3.56152 1.77734L4.78516 0.546875ZM4.87402 8.06641C5.53483 8.06641 6.05436 7.96159 6.43262 7.75195C6.81543 7.54232 7.08659 7.25749 7.24609 6.89746C7.4056 6.53743 7.48535 6.12728 7.48535 5.66699C7.48535 5.1748 7.4056 4.66895 7.24609 4.14941C7.09115 3.62988 6.91569 3.13086 6.71973 2.65234L8.54492 1.96875C8.80469 2.65234 8.98698 3.28353 9.0918 3.8623C9.19661 4.43652 9.24902 5.02214 9.24902 5.61914C9.24902 6.52604 9.08268 7.30762 8.75 7.96387C8.41732 8.62467 7.92513 9.13281 7.27344 9.48828C6.6263 9.84375 5.8265 10.0215 4.87402 10.0215C3.89421 10.0215 3.08529 9.83236 2.44727 9.4541C1.8138 9.0804 1.3444 8.56999 1.03906 7.92285C0.733724 7.28027 0.581055 6.55111 0.581055 5.73535C0.581055 5.19303 0.640299 4.63249 0.758789 4.05371C0.877279 3.47038 1.04818 2.8916 1.27148 2.31738L2.93262 2.95312C2.764 3.4362 2.62272 3.90788 2.50879 4.36816C2.39486 4.82845 2.33789 5.25911 2.33789 5.66016C2.33789 6.09766 2.41536 6.4987 2.57031 6.86328C2.72526 7.22786 2.9873 7.51953 3.35645 7.73828C3.72559 7.95703 4.23145 8.06641 4.87402 8.06641ZM0.916016 10.3477H2.78906V16.6641C2.78906 17.1517 2.85514 17.5003 2.9873 17.71C3.12402 17.9196 3.41569 18.0244 3.8623 18.0244H4.02637V20H3.8623C2.84147 20 2.09408 19.7357 1.62012 19.207C1.15072 18.6784 0.916016 17.8854 0.916016 16.8281V10.3477ZM8.2373 16.2881C8.0459 16.2881 7.875 16.3519 7.72461 16.4795C7.57422 16.6025 7.44206 16.7529 7.32812 16.9307C7.21875 17.1038 7.12533 17.2725 7.04785 17.4365C7.18001 17.555 7.30534 17.6576 7.42383 17.7441C7.54688 17.8307 7.66081 17.9036 7.76562 17.9629C7.92969 18.0586 8.0778 18.1247 8.20996 18.1611C8.34668 18.1976 8.46745 18.2158 8.57227 18.2158C8.81836 18.2158 8.99154 18.1292 9.0918 17.9561C9.19661 17.7829 9.24902 17.5824 9.24902 17.3545C9.24902 17.0628 9.15788 16.8122 8.97559 16.6025C8.79785 16.3929 8.55176 16.2881 8.2373 16.2881ZM8.56543 20.1572C8.25098 20.1572 7.9502 20.1094 7.66309 20.0137C7.37598 19.9225 7.09798 19.7972 6.8291 19.6377C6.56022 19.4782 6.29362 19.2982 6.0293 19.0977C5.86523 19.2663 5.69661 19.4189 5.52344 19.5557C5.35482 19.6878 5.1543 19.7949 4.92188 19.877C4.69401 19.959 4.4069 20 4.06055 20H3.77344V18.0244H4.02637C4.24967 18.0244 4.4502 17.9378 4.62793 17.7646C4.80566 17.5869 4.97884 17.3613 5.14746 17.0879C5.31608 16.8099 5.49154 16.5182 5.67383 16.2129C5.86068 15.9076 6.06803 15.6182 6.2959 15.3447C6.52376 15.0667 6.79036 14.8411 7.0957 14.668C7.4056 14.4948 7.76562 14.4082 8.17578 14.4082C8.75 14.4082 9.24674 14.5449 9.66602 14.8184C10.0853 15.0872 10.4089 15.445 10.6367 15.8916C10.8646 16.3337 10.9785 16.8167 10.9785 17.3408C10.9785 17.8786 10.8896 18.3594 10.7119 18.7832C10.5342 19.207 10.2653 19.542 9.90527 19.7881C9.5498 20.0342 9.10319 20.1572 8.56543 20.1572ZM14.6973 14.2168C15.1484 14.2168 15.5404 14.3216 15.873 14.5312C16.2103 14.7409 16.4928 15.028 16.7207 15.3926C16.9531 15.7526 17.1331 16.1605 17.2607 16.6162C17.3929 17.0674 17.4772 17.5368 17.5137 18.0244H18.0195V20H17.377C17.2038 20.6927 16.9189 21.2852 16.5225 21.7773C16.1305 22.2695 15.6201 22.6751 14.9912 22.9941C14.3623 23.3132 13.6081 23.557 12.7285 23.7256L12.0518 21.9004C12.626 21.7865 13.1569 21.6383 13.6445 21.4561C14.1367 21.2783 14.5514 21.0664 14.8887 20.8203C15.2305 20.5742 15.4583 20.3008 15.5723 20H14.9297C14.0137 20 13.3118 19.8086 12.8242 19.4258C12.3411 19.0384 12.0996 18.4141 12.0996 17.5527C12.0996 17.2109 12.152 16.8486 12.2568 16.4658C12.3617 16.0785 12.5189 15.7161 12.7285 15.3789C12.9427 15.0371 13.2139 14.7591 13.542 14.5449C13.8701 14.3262 14.2552 14.2168 14.6973 14.2168ZM14.9229 18.0244H15.7979C15.7796 17.8285 15.7454 17.6234 15.6953 17.4092C15.6452 17.195 15.5768 16.9945 15.4902 16.8076C15.4036 16.6208 15.2943 16.4681 15.1621 16.3496C15.0299 16.2266 14.8704 16.165 14.6836 16.165C14.4694 16.165 14.2985 16.2425 14.1709 16.3975C14.0479 16.5524 13.959 16.7324 13.9043 16.9375C13.8542 17.1426 13.8291 17.3226 13.8291 17.4775C13.8291 17.7191 13.9294 17.8717 14.1299 17.9355C14.335 17.9948 14.5993 18.0244 14.9229 18.0244ZM17.7598 18.0244H18.2451V20H17.7598V18.0244ZM20.7881 11.0244L21.957 12.1865L20.7881 13.3623L19.6191 12.1865L20.7881 11.0244ZM18.4775 11.0244L19.6533 12.1865L18.4775 13.3623L17.3154 12.1865L18.4775 11.0244ZM18.8262 20H18.0674V18.0244H18.8125C19.2135 18.0244 19.5189 17.9561 19.7285 17.8193C19.9382 17.6781 20.043 17.3955 20.043 16.9717C20.043 16.7165 20.0156 16.3883 19.9609 15.9873C19.9062 15.5817 19.8105 15.1169 19.6738 14.5928L21.4443 14.1143C21.5628 14.5837 21.6517 15.0348 21.7109 15.4678C21.7702 15.9007 21.7998 16.32 21.7998 16.7256C21.7998 17.3864 21.7041 17.9629 21.5127 18.4551C21.3213 18.9427 21.0091 19.3232 20.5762 19.5967C20.1432 19.8656 19.5599 20 18.8262 20Z"
              fill="white"
            />
          </svg>
        </Box>
        <Button
          sx={{
            position: "absolute",
            bottom: "4%",
            left: "2%",
            right: "2%",
            borderRadius: 4,
            py: 0.2,
            bgcolor: "#fffa",
            "&: hover": {
              bgcolor: "#fffe",
            },
          }}
          onClick={handleOpenModal}>
          <Typography
            variant="subtitle1"
            color="#000"
            fontWeight={600}>
            {"افزایش موجودی"}
          </Typography>
          <svg
            width="47"
            height="42"
            viewBox="0 0 47 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.79907 17.7894C5.79907 14.6128 5.79907 13.0245 6.92445 12.0377C8.04981 11.0508 9.86108 11.0508 13.4836 11.0508H32.6949C36.3174 11.0508 38.1287 11.0508 39.2541 12.0377C40.3795 13.0245 40.3795 14.6128 40.3795 17.7894V24.5281C40.3795 27.7046 40.3795 29.2929 39.2541 30.2798C38.1287 31.2667 36.3174 31.2667 32.6949 31.2667H13.4836C9.86108 31.2667 8.04981 31.2667 6.92445 30.2798C5.79907 29.2929 5.79907 27.7046 5.79907 24.5281V17.7894Z"
              fill="#F95A00"
            />
            <path
              d="M11.5625 27.8974C12.6235 27.8974 13.4836 27.1431 13.4836 26.2127C13.4836 25.2823 12.6235 24.528 11.5625 24.528C10.5015 24.528 9.64136 25.2823 9.64136 26.2127C9.64136 27.1431 10.5015 27.8974 11.5625 27.8974Z"
              fill="#222222"
            />
            <path
              d="M40.3795 16.1048H5.79907V19.4741H40.3795V16.1048Z"
              fill="#222222"
            />
          </svg>
        </Button>
      </Grid>

      {/* Modal for Adding Balance */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
          }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}>
            مبلغ به ریال اضافه کنید
          </Typography>
          <TextField
            label="مقدار به ریال"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={handleAmountChange}
            type="text"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAddBalance}>
            تایید
          </Button>
        </Box>
      </Modal>

      {/* Buttons */}
      <Grid
        size={{ xs: 12, md: 4.8 }}
        sx={{
          mt: 2,
          ml: { xs: 0, md: 2 },
          position: "relative",
          mx: "auto",
        }}>
        <Button
          variant="contained"
          sx={{
            width: "100%",
            aspectRatio: "5 / 1",
            boxShadow: "0px 0px 10px #00000040",
            borderRadius: "16px",
            bgcolor: "#fff",
            color: "#000",
            my: 1,
            fontWeight: 700,
            fontSize: { xs: 18, md: 20 },
          }}>
          {"پشتیبانی"}
        </Button>
        <Button
          variant="contained"
          sx={{
            my: 1,
            width: "100%",
            aspectRatio: "5 / 1",
            boxShadow: "0px 0px 10px #00000040",
            borderRadius: "16px",
            bgcolor: "#fff",
            color: "#000",
            fontWeight: 700,
            fontSize: { xs: 18, md: 20 },
          }}>
          {"درباره جیما"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Profile;

const CustomButton = styled(Button)({
  borderRadius: "20px",
  border: "1px solid #FF9100",
  backgroundColor: "#FF9100",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "bold",
  padding: "12px 45px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  transition: "transform 80ms ease-in",
  marginTop: "10px",
  "&:active": {
    transform: "scale(0.95)",
  },
  "&:focus": {
    outline: "none",
  },
});

const Input = styled(InputBase)({
  backgroundColor: "#eee",
  borderRadius: "15px",
  border: "none",
  padding: "5px 10px",
  marginTop: "10px",
  width: "100%",
  direction: "rtl",
});