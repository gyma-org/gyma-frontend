import React from "react";
import Grid from "@mui/material/Grid2";
import { getGymDetails } from "@/api/gymDetails";
import { GymDetails } from "@/types/gymDetails"; 
import { Address, Comments, Description, GYMHeader, ImageSlider, Specifications } from "@/components/gym";

interface GymPageProps {
  params: {
    id: number; // Gym code from the URL
  };
}

const GymPage: React.FC<GymPageProps> = async ({ params }) => {
  const { id } = params; // Get gym code from the URL (dynamic param)

  // Fetch gym details using the gym code
  const gymDetails = await getGymDetails(id);

  console.log("Fetched Gym Details:", gymDetails);

  if (!gymDetails) {
    return <p>No gym details found for gym code: {id}</p>;
  }

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
      }}
    >
      <GYMHeader/>
      <ImageSlider images={gymDetails.gallery} />
      <Specifications 
        features={gymDetails.features}
        gymName={gymDetails.name}
        location={gymDetails.address}
        gymId={gymDetails.id}
        gymSex={gymDetails.sex}
      />
      <Description text={gymDetails.description} />
      <Address
        location={gymDetails.address} 
      />
      <Comments />
    </Grid>
  );
};

export default GymPage;