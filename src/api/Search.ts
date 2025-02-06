import { API_BASE_URL } from "../config";

export interface Gym {
  id: string;
  name: string;
  address: string;
}

export interface SearchResponse {
  gyms_by_name: Gym[];
}

export async function searchGyms(query: string): Promise<SearchResponse> {
  if (query.length < 3) {
    return { gyms_by_name: [] }; // Return empty if query is too short
  }

  const response = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}