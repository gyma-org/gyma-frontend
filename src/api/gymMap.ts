// api/gym.ts
export interface Gym {
    id: string;
    name: string;
    gym_code: string;
    password: string;
    owner_firstname: string;
    owner_lastname: string;
    owner_email: string;
    owner_national_code: string;
    description: string;
    address: string;
    price: number;
    lat: number;
    lon: number;
    city: string;
    phone_number: string;
    profile?: string;
    gallery?: string[][];
    video?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    features?: string[][];
    sex: string;
    rate: string;
    min_price?: number
  }
  
  interface GymNearbyResponse {
    results: Gym[];
  }
  // const API_BASE_URL = "http://127.0.0.1:8000";
  import { API_BASE_URL } from '../config';
  
  export const fetchNearbyGyms = async (lat: number, lon: number, radius: number = 5): Promise<GymNearbyResponse> => {
    const response = await fetch(`${API_BASE_URL}/gym/nearby/?lat=${lat}&lon=${lon}&radius=${radius}`);
    if (!response.ok) {
      throw new Error("Failed to fetch nearby gyms");
    }
    return response.json();
  };
  