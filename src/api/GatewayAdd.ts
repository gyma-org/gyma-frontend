import { GoToGatewayRequest } from "../types/GatewayAdd";

const API_BASE_URL = "https://backuser.gyma.app/wallet"; // Replace with your actual backend URL

export async function goToGateway(data: GoToGatewayRequest, token: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/go-to-gateway/`, {
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
