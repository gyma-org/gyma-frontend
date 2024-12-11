import { UserUpdateResponse } from "../types/UserUpdate";

const API_URL = "https://backuser.gyma.app"; // Adjust your API URL accordingly

// Helper function to update the user profile with FormData
export const updateUserProfile = async (
  authToken: string,
  formData: FormData
): Promise<UserUpdateResponse> => {
  const response = await fetch(`${API_URL}/user/update/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
      // 'Content-Type': 'multipart/form-data' // Do NOT set Content-Type with FormData
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }

  return response.json();
};
