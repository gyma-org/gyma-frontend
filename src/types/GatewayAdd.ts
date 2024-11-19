// types.ts
export interface GoToGatewayRequest {
    price: number;
    schedule_code?: string; // Optional, only if required
  }
  
  export interface GoToGatewayResponse {
    url: string; // Assuming the API response redirects to a URL for the bank gateway
  }
  