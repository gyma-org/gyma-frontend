import { GymDetails } from '../types/gymDetails';
import { API_BASE_URL } from '../config';

// Function to get gym details by gym code
export const getGymDetails = async (gymCode: string): Promise<GymDetails> => {
  const response = await fetch(`${API_BASE_URL}/gym/gyms/${gymCode}/`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch gym details');
  }
  
  const data: GymDetails = await response.json();
  return data;
};