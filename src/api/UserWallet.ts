import { UserWallet } from '../types/UserWallet';

// const API_USER_URL = 'http://127.0.0.1:9000';  // Adjust your API URL accordingly
import { API_USER_URL } from '../config';

// Function to fetch the wallet data for the authenticated user
export const fetchUserWallet = async (accessToken: string): Promise<UserWallet> => {
  const response = await fetch(`${API_USER_URL}/user/read-wallet/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data: UserWallet = await response.json();
  return data;
};