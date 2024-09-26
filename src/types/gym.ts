export interface AddGymRequest {
    name: string;
    gym_code: string;
    password: string;
    owner_firstname: string;
    owner_lastname: string;
    owner_email: string;
    owner_national_code: string;
    address: string;
    lat: number;
    lon: number;
    city: 'ALB' | 'ARD' | 'BUS' | 'CHB' | 'EAZ' | 'ESH' | 'FAR' | 'GIL' | 'GLS' | 'HMD' | 'HRZ' | 'ILM' | 'KRN' | 'KRD' | 'KBD' | 'KRM' | 'KHS' | 'NKH' | 'RKH' | 'SKH' | 'QOM' | 'QAZ' | 'SMN' | 'SBN' | 'TEH' | 'WAZ' | 'YZD' | 'ZAN' | 'LOR' | 'MAZ' | 'MRK';
    phone_number: string;
    profile: File;  // Handling file uploads
    gallery?: string[]; // Optional
    features?: string[]; // Optional
    sex: 'men' | 'women' | 'both';
  }
  
  export interface GymResponse {
    // Define response fields according to your schema
  }