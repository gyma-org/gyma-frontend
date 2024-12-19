import { API_USER_URL } from '../config';
import { BookingListResponse } from '../types/booked';

export async function getBookingList(token: string, logoutUser: () => void): Promise<BookingListResponse> {
  const response = await fetch(`${API_USER_URL}/booked/booked`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser(); // Call logoutUser on unauthorized
    }
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const result: BookingListResponse = await response.json();
  return result;
}