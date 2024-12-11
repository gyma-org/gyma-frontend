import { UserProfile } from '../types/profile'; // Import the Profile type from the types file
// const API_USER_URL = 'http://127.0.0.1:9000'; // Adjust your API URL accordingly
import { API_USER_URL } from '../config';


// Fetches the profile data for the authenticated user
export const fetchProfile = async (
  accessToken: string,
  logoutUser: () => void

): Promise<UserProfile> => {
  const response = await fetch(`${API_USER_URL}/user/details/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser(); // Call logoutUser on unauthorized
    }
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data: UserProfile = await response.json(); // Using the Profile type for the response
  return data;
};