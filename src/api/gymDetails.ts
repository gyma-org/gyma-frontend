import { GymDetails } from "../types/gymDetails";
import { API_BASE_URL } from "../config";

// Function to get gym details by gym code
export const getGymDetails = async (gymCode: string): Promise<GymDetails> => {
  const response = await fetch(`${API_BASE_URL}/gym/gyms/${gymCode}/`);

  if (!response.ok) {
    return {
      id: "sdfkjfjdskl",
      name: "sdfkjfjdskl",
      gym_code: "sdfkjfjdskl",
      owner_firstname: "sdfkjfjdskl",
      owner_lastname: "sdfkjfjdskl",
      owner_email: "sdfkjfjdskl",
      owner_national_code: "sdfkjfjdskl",
      description: "sdfkjfjdskl",
      address: "sdfkjfjdskl",
      lat: 2,
      lon: 3,
      city: "sdfkjfjdskl",
      phone_number: "sdfkjfjdskl",
      profile: "sdfkjfjdskl",
      gallery: ["sdfkjfjdskl"],
      video: "sdfkjfjdskl",
      email_verified: true,
      phone_verified: true,
      features: ["sdfkjfjdskl"],
      sex: "dskjflk",
    };
  }

  const data: GymDetails = await response.json();
  return data;
};
