import { API_USER_URL } from '../config';

export async function saveGym(gymId: string, token: string): Promise<void> {
  const response = await fetch(`${API_USER_URL}/saved/add_gym/${gymId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to save gym with ID ${gymId}`);
  }
}
