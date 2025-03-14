// const API_USER_URL = "http://127.0.0.1:9000";
import { API_USER_URL } from "../config";

export interface VerificationData {
  user_phone_number: string;
  otp: string;
}

export const verifyOtp = async (data: VerificationData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_USER_URL}/verification/verify-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: result.message || "هویت با شماره تایید شد." };
    } else {
      return { success: false, message: result.message || "کد اشتباه وارد شده است." };
    }
  } catch (error) {
    console.error("مشکلی پیش آمد دوباره تلاش کنید.", error);
    return { success: false, message: "An error occurred during verification. Please try again." };
  }
};
