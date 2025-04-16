import React from "react";
import Grid from "@mui/material/Grid2";
import { getGymDetails } from "@/api/gymDetails";
import {
  Address,
  Comments,
  Description,
  Features,
  GYMHeader,
  ImageSlider,
  Specifications,
} from "@/components/gym";

// Defining the props with parameters for gym id
interface GymPageProps {
  params: {
    id: string; // Gym code from the URL
  };
}

// Static paths generation for dynamic routes (gym pages)
export async function generateStaticParams() {
  // Sample data for static paths generation; replace this with actual data fetching logic
  const gymCodes = ["e086ba93-9c6f-4d11-8f52-ee152654abcf"]; // Replace this with actual gym codes from your data source

  return gymCodes.map((id) => ({
    id: id.toString(),
  }));
}

const GymPage: React.FC<GymPageProps> = async ({ params }) => {
  const { id } = params; // Get gym code from the URL (dynamic param)

  // Fetch gym details using the gym code
  const gymDetails = await getGymDetails(id, { cache: "no-store" });


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
      }}>
      <GYMHeader gymId={gymDetails.id} />
      <ImageSlider images={gymDetails.gallery} />
      <Specifications
        features={gymDetails.features}
        gymName={gymDetails.name}
        location={gymDetails.address}
        gymId={gymDetails.id}
        gymSex={gymDetails.sex}
        working_hours_men={gymDetails.working_hours_men}
        working_hours_women={gymDetails.working_hours_women}
        rate={gymDetails.rate}
        structure={gymDetails.structure}
      />
      <Features
        features={gymDetails.features}
        equipment={gymDetails.equipment}
      />
      <Description text={gymDetails.description} />
      <Address
        location={gymDetails.address}
        lat={gymDetails.lat}
        lon={gymDetails.lon}
      />
      <Comments gymid={gymDetails.id} />
    </Grid>
  );
};

export default GymPage;
