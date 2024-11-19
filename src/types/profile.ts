// Define the structure of the profile data returned by the API
export interface UserProfile {
    id: number;
    username: string;
    email: string;
    name: string;
    profile: string;
    banner: string;
    first_name: string;
    last_name: string;
    phone_number: number;
    date_joined: string;
    // Add other fields that are relevant to your profile data
  }
  
  // Define the structure of the API response
  export interface ApiResponse {
    // Example fields, adjust these according to your API response
    success: boolean;
    data: UserProfile;
    error?: string;
  }