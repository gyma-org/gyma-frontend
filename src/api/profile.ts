import { UserProfile } from "../types/profile"; // Import the Profile type from the types file

const API_URL = "https://backuser.gyma.app"; // Adjust your API URL accordingly
import { API_BASE_URL } from "../config";

// Fetches the profile data for the authenticated user
export const fetchProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/user/details/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data: UserProfile = await response.json(); // Using the Profile type for the response
  return data;
};
