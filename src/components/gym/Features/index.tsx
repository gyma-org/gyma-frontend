import { ArrowBackIos, Face, SportsGymnastics } from "@mui/icons-material";
import { Typography, Grid2, Box, Divider, Chip } from "@mui/material";

type GymFeaturesProps = {
  features: string[];
  equipment: string[];
};

const index: React.FC<GymFeaturesProps> = ({ features, equipment }) => {
  return (
    <Grid2
      size={12}
      sx={{
        p: 2,
      }}>
      <Typography
        variant="h6"
        fontWeight={600}>
        <ArrowBackIos sx={{ ml: 2 }} />
        {"تجهیزات :"}
      </Typography>
      <Divider
        sx={{
          my: 1,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          px: { xs: 1, sm: 4 },
        }}>
        {equipment.length > 0 ? (
          equipment.map((feature, index) => (
            <Chip
              key={index}
              label={feature}
              variant="outlined"
              color="primary"
              sx={{
                direction: "ltr",
              }}
              icon={<SportsGymnastics />}
            />
          ))
        ) : (
          <Typography
            variant="subtitle1"
            fontWeight={500}
            color="textSecondary">
            {"لیست تجهیزات موجود نیست."}
          </Typography>
        )}
      </Box>

      <Typography
        variant="h6"
        fontWeight={600}>
        <ArrowBackIos sx={{ ml: 2 }} />
        {"امکانات :"}
      </Typography>
      <Divider
        sx={{
          my: 1,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          px: { xs: 1, sm: 4 },
          mb: 4,
        }}>
        {features.length > 0 ? (
          features.map((feature, index) => (
            <Chip
              key={index}
              label={feature}
              variant="outlined"
              color="primary"
            />
          ))
        ) : (
          <Typography
            variant="subtitle1"
            fontWeight={500}
            color="textSecondary">
            {"امکانات باشگاه درج نشده است."}
          </Typography>
        )}
      </Box>
    </Grid2>
  );
};

export default index;

//["دستگاه های وزنه", "تردمیل و هوازی", "فضای فانکشنال", "فضای کراس فیت", "trx", "x_body"]
