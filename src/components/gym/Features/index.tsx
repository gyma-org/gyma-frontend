import Image from "next/image";
import { ArrowBackIos } from "@mui/icons-material";
import { Typography, Box, Divider, Chip } from "@mui/material";

type GymFeaturesProps = {
  features: string[];
  equipment: string[];
};

// Define the mapping of feature/equipment names to their icon file paths
const iconMap: Record<string, string> = {
  "دستگاه های وزنه": "/icons/features/weights.svg",
  "تردمیل و هوازی": "/icons/features/treadmill.svg",
  "فضای کراس فیت": "/icons/features/crossfit.svg",
  "حمام": "/icons/features/shower.svg",
  "پک بهداشتی یکبار مصرف": "/icons/features/hygiene-pack.svg",
  "ماساژ": "/icons/features/massage.svg",
  "پارکینگ": "/icons/features/parking.svg",
  "سشوار": "/icons/features/hairdryer.svg",
  "trx": "/icons/features/trx.svg",
  "x_body": "/icons/features/xbody.svg",
  "X-Body": "/icons/features/xbody.svg",
};

const GymFeatures: React.FC<GymFeaturesProps> = ({ features, equipment }) => {
  return (
    <Box sx={{ p: 2 }}>
      {/* Equipment Section */}
      <Typography variant="h6" fontWeight={600}>
        <ArrowBackIos sx={{ ml: 2 }} />
        {"تجهیزات :"}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, px: { xs: 1, sm: 4 } }}>
        {equipment.length > 0 ? (
          equipment.map((item, index) => (
            <Chip
              key={index}
              label={item}
              variant="filled"
              color="default"
              icon={
                iconMap[item] ? (
                  <Image src={iconMap[item]} alt={item} width={40} height={40} style={{ marginLeft: "-7px" }} />
                ) : undefined
              }
              sx={{
                direction: "rtl",
                border: "none",
                backgroundColor: "transparent",
                fontWeight: 500,
              }}
            />
          ))
        ) : (
          <Typography variant="subtitle1" fontWeight={500} color="textSecondary">
            {"لیست تجهیزات موجود نیست."}
          </Typography>
        )}
      </Box>

      {/* Features Section */}
      <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
        <ArrowBackIos sx={{ ml: 2 }} />
        {"امکانات :"}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, px: { xs: 1, sm: 4 }, mb: 4 }}>
        {features.length > 0 ? (
          features.map((item, index) => (
            <Chip
              key={index}
              label={item}
              variant="filled"
              color="default"
              icon={
                iconMap[item] ? (
                  <Image src={iconMap[item]} alt={item} width={40} height={40} style={{ marginLeft: "-7px" }} />
                ) : undefined
              }
              sx={{
                direction: "rtl",
                border: "none",
                backgroundColor: "transparent",
                fontWeight: 500,
              }}
            />
          ))
        ) : (
          <Typography variant="subtitle1" fontWeight={500} color="textSecondary">
            {"امکانات باشگاه درج نشده است."}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default GymFeatures;
