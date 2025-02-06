
export interface Gym {
  id: number;
  name: string;
  gym_code: string;
  owner_firstname: string;
  owner_lastname: string;
  owner_email: string;
  address: string;
  lat: number;
  lon: number;
  city: 'ALB' | 'ARD' | 'BUS' | 'CHB' | 'EAZ' | 'ESH' | 'FAR' | 'GIL' | 'GLS' | 'HMD' | 'HRZ' | 'ILM' | 'KRN' | 'KRD' | 'KBD' | 'KRM' | 'KHS' | 'NKH' | 'RKH' | 'SKH' | 'QOM' | 'QAZ' | 'SMN' | 'SBN' | 'TEH' | 'WAZ' | 'YZD' | 'ZAN' | 'LOR' | 'MAZ' | 'MRK';
  phone_number: string;
  profile: string; // URL or path to profile image
  gallery: string[]; // Array of URLs or paths to gallery images
  features: string[];
  sex: 'men' | 'women' | 'both';
}

export interface GymListResponse {
  id: number;
  gym_id: string;
  name: string;
  price: number;
  gym_code: string;
  owner_firstname: string;
  owner_lastname: string;
  owner_email: string;
  address: string;
  lat: number;
  lon: number;
  city: 'ALB' | 'ARD' | 'BUS' | 'CHB' | 'EAZ' | 'ESH' | 'FAR' | 'GIL' | 'GLS' | 'HMD' | 'HRZ' | 'ILM' | 'KRN' | 'KRD' | 'KBD' | 'KRM' | 'KHS' | 'NKH' | 'RKH' | 'SKH' | 'QOM' | 'QAZ' | 'SMN' | 'SBN' | 'TEH' | 'WAZ' | 'YZD' | 'ZAN' | 'LOR' | 'MAZ' | 'MRK';
  phone_number: string;
  profile?: string; // URL or path to profile image
  gallery: string[]; // Array of URLs or paths to gallery images
  features: string[];
  sex: 'men' | 'women' | 'both';
}
