import React from "react";
import Grid from "@mui/material/Grid2";
import { getGymDetails } from "@/api/gymDetails";
import { GymDetails } from "@/types/gymDetails"; 
import { useParams } from "react-router-dom";
import { Address, Comments, Description, GYMHeader, ImageSlider, Specifications } from "@/components/gym";

const GymPage = () => {
  const { id } = useParams(); // Get the gym code from the URL
  const [gymDetails, setGymDetails] = useState<GymDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        const data = await getGymDetails(id); // Fetch gym details by gym code
        setGymDetails(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGymDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Grid
      container
      spacing={2}
      sx={{
        direction: "rtl",
        p: { xs: 0, md: 2 },
        bgcolor: "#f3f3f3",
        minHeight: "100vh",
        pb: 8,
      }}>
      <GYMHeader/>
      <ImageSlider gym={gymDetails} />
      <Specifications gym={gymDetails} />
      <Description gym={gymDetails} />
      <Address gym={gymDetails} />
      <Comments gym={gymDetails} />
    </Grid>
  );
};

export default GymPage;
