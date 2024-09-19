import { AddGymRequest } from '../types/gym';
import { API_BASE_URL } from '../config';

export const addGym = async (gymData: AddGymRequest) => {
  const formData = new FormData();

  Object.entries(gymData).forEach(([key, value]) => {
    if (key === 'gallery' && Array.isArray(value)) {
      value.forEach((file, index) => formData.append(`gallery[${index}]`, file));
    } else if (key === 'profile' && value) {
      formData.append(key, value);  // Append the profile image file
    } else {
      formData.append(key, value.toString());
    }
  });

  const res = await fetch(`${API_BASE_URL}/gym/add-gym/`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to add gym');
  }

  return await res.json();
};