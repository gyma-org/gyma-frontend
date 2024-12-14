// API response interfaces
interface SendOtpResponse {
  success: boolean;
  message?: string;
  remaining_time?: number;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

// Base URL for API requests
// const API_USER_URL = "http://127.0.0.1:9000";
import { API_USER_URL } from "../config";

// Function to send OTP with updated handling for cooldown period
export const sendOtp = async (phoneNumber: string): Promise<SendOtpResponse> => {
  try {
    const response = await fetch(`${API_USER_URL}/verification/send-opt-verification/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_phone_number: phoneNumber,
      }),
    });

    const data = await response.json();

    // Check for different response scenarios
    if (response.ok) {
      if (data.message === "OTP sent successfully") {
        return { success: true, message: data.message };
      }
    } else if (data.remaining_time) {
      return { success: false, message: data.error, remaining_time: data.remaining_time };
    } else {
      throw new Error(data.message || "Failed to send OTP");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Unexpected error occurred." };
  }
  return { success: false, message: "Unexpected error occurred." };
};

export const verifyOtp = async (data: {
  user_phone_number: string;
  otp: string;
}): Promise<VerifyOtpResponse> => {
  try {
    const response = await fetch(`${API_USER_URL}/verification/verify-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    // Check if the response indicates success
    if (response.ok && Array.isArray(responseData) && responseData[0] === "phone verified successfully.") {
      return { success: true, message: responseData[0] };
    }

    // If response is not ok, handle as failure
    return { success: false, message: "OTP verification failed." };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "OTP verification failed." };
  }
};
