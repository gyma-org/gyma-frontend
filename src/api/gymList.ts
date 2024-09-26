import { GymListResponse } from '../types/gymList';
import { API_BASE_URL } from '../config';

export const listGyms = async (): Promise<GymListResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/gym/list-gyms/`);

  if (!res.ok) throw new Error('Failed to list gyms');
  return res.json();
};