// import { API_USER_URL } from "../config";
const API_USER_URL = "http://127.0.0.1:8000";

export interface ResetPasswordData {
  user_phone_number: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}

export const resetPassword = async (data: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_USER_URL}/verification/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: result.message || "Password reset successful" };
    } else {
      return { success: false, message: result.message || "Password reset failed" };
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    return { success: false, message: "An error occurred during password reset. Please try again." };
  }
};
