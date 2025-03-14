export interface GymDetails {
  id: string;
  gym_id: string;
  name: string;
  gym_code: string;
  owner_firstname: string;
  owner_lastname: string;
  owner_email: string;
  owner_national_code: string;
  description: string | null;
  address: string;
  lat: number;
  lon: number;
  city: string;
  phone_number: string;
  price: number;
  profile: string;
  gallery: string[];
  video: string;
  email_verified: boolean;
  phone_verified: boolean;
  features: string[];
  equipment: string[];
  sex: string;
  rate: string;
  working_hours_men: {
    off_days: { open: string; close: string };
    odd: { open: string; close: string };
    even: { open: string; close: string };
    odd_even: string;
  };
  working_hours_women: {
    off_days: { open: string; close: string };
    odd: { open: string; close: string };
    even: { open: string; close: string };
    odd_even: string;
  };
  structure: { // ✅ Added structure field
    area: number | null;
    floor: number | null;
    height: number | null;
    parking: number;
    elevator: number | null;
  };
  min_price: number
}

export interface Structure {
  area: number | null;
  floor: number | null;
  height: number | null;
  parking: number | null;
  elevator: number | null;
}

export interface WorkingHours {
  off_days: { open: string; close: string };
  odd: { open: string; close: string };
  even: { open: string; close: string };
  odd_even: string;
}