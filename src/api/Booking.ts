// const API_BASE_URL = "http://127.0.0.1:9000/";
import { API_USER_URL } from '../config';

export async function bookGymSession(scheduleCode: number, token: string): Promise<string | { redirect_url: string }> {
    const response = await fetch(`${API_USER_URL}/booking/book-gym-session/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ schedule_code: scheduleCode }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      // Throw a new error with the message from the response
      throw new Error(errorResponse?.message || "Failed to initiate gateway request");
    }
    
      const result = await response.json(); // The response is an HTML string
      return result; // Return the HTML string directly
};
