// Define the request body type for updating the user profile
export interface UserUpdate {
    first_name: string;
    last_name: string;
    profile: string;
    banner: string;
  }
  
  // Define the response type if needed (example placeholder)
  export interface UserUpdateResponse {
    message: string;
    success: boolean;
    user: UserUpdate;
  }
  