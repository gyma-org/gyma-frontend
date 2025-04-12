import { API_USER_URL } from '../config';
// import { API_USER_URL } from "../config";

interface SendOtpResponse {
    success: boolean;
    message?: string;
    remaining_time?: number;
  }

export const sendOtp = async (phone_number: string): Promise<SendOtpResponse> => {
    try {
        const response = await fetch(`${API_USER_URL}/verification/send-opt-forget/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_phone_number: phone_number.toString(), // Ensure the phone number is a string
          }),
        });
    
        const result = await response.json();
    
        if (response.ok) {
          return { success: true, message: result.message || "OTP sent successfully." };
        } else {
          return { success: false, message: result.message || "Failed to send OTP." };
        }
      } catch (error) {
        console.error("Error during OTP sending:", error);
        return { success: false, message: "An error occurred. Please try again." };
      }
};
