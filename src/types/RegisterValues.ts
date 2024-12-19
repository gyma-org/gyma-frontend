export interface RegisterValues {
  // Required fields
  first_name: string; // first_name
  last_name: string; // last_name
  phone_number: string; // phone_number
  password: string;

  // Optional fields
  profile?: File | null; // profile image
  banner?: File; // banner image
  sex: "men" | "women" | ""; // example of fixed values
  height?: number;
  weight?: number;
}
