import { API_USER_URL } from '../config'; // Assuming this contains your backend base URL
import { GymListResponse } from "../types/gymList";

// Define the type for your response if needed (replace `any` with a more specific type)
export interface Gym {
  gym_id: string;
}

// Function to fetch saved gyms for a user
export async function getSavedGyms(token: string, logoutUser: () => void): Promise<GymListResponse[]> {
  const response = await fetch(`${API_USER_URL}/saved/my_gyms/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Use the JWT token for authentication
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser(); // Call logoutUser on unauthorized
    }
    throw new Error("Failed to fetch saved gyms");
  }

  const data: { gyms: GymListResponse[] } = await response.json();
  return data.gyms;
}
