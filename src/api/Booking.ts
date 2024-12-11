const API_BASE_URL = "https://backuser.gyma.app/";

export async function bookGymSession(scheduleCode: number, token: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}booking/book-gym-session/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ schedule_code: scheduleCode }),
  });

  if (!response.ok) {
    throw new Error("Failed to initiate gateway request");
  }

  const result = await response.text(); // The response is an HTML string
  return result; // Return the HTML string directly
}
