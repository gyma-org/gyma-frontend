import { GoToGatewayRequest } from "../types/GatewayAdd";

// const API_USER_URL = "http://127.0.0.1:9000/wallet"; // Replace with your actual backend URL
import { API_USER_URL } from '../config';

export async function goToGateway(data: GoToGatewayRequest, token: string): Promise<string> {
  const response = await fetch(`${API_USER_URL}/wallet/go-to-gateway/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Use the JWT token for authentication
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to initiate gateway request");
  }

  const result = await response.text(); // The response is an HTML string
  return result; // Return the HTML string directly
}
