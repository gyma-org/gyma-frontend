// api/gym.ts
export interface Gym {
    name: string;
    gym_code: string;
    password: string;
    owner_firstname: string;
    owner_lastname: string;
    owner_email: string;
    owner_national_code: string;
    description: string;
    address: string;
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
  }
  
  interface GymNearbyResponse {
    results: Gym[];
  }
  
  export const fetchNearbyGyms = async (lat: number, lon: number, radius: number = 5): Promise<GymNearbyResponse> => {
    const response = await fetch(`https://gyma.app/gym/nearby/?lat=${lat}&lon=${lon}&radius=${radius}`);
    if (!response.ok) {
      throw new Error("Failed to fetch nearby gyms");
    }
    return response.json();
  };
  