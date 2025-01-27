import { GymDetails } from '../types/gymDetails';
import { API_BASE_URL } from '../config';

// Function to get gym details by gym code
export const getGymDetails = async (
  gym_id: string, 
  options?: RequestInit // Allow optional fetch options
): Promise<GymDetails | null> => {
  const response = await fetch(
    `${API_BASE_URL}/gym/details_user/${gym_id}/`,
    {
      ...options, // Spread options if provided
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch gym details');
  }

  const data: GymDetails = await response.json();
  return data;
};
