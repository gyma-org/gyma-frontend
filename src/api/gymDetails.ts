import { GymDetails } from '../types/gymDetails';
import { API_BASE_URL } from '../config';
// export const API_BASE_URL = 'http://127.0.0.1:8080';

// Function to get gym details by gym code
export const getGymDetails = async (gym_id: string): Promise<GymDetails | null> => {
  const response = await fetch(`${API_BASE_URL}/gym/details_user/${gym_id}/`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch gym details');
    return null
  }
  
  const data: GymDetails = await response.json();
  return data;
};