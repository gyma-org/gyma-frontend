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
  profile: string;
  gallery: string[];
  video: string;
  email_verified: boolean;
  phone_verified: boolean;
  features: string[];
  sex: string;
  working_hours_men: {
    off_days: { open: string; close: string };
    working_days: { open: string; close: string };
  };
  working_hours_women: {
    off_days: { open: string; close: string };
    working_days: { open: string; close: string };
  };
}