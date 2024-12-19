// types/booked.ts

export interface booked {
    gym_session: number;
    booking_date: string;
    gym_name: string;
    gym_address: string;
    user_name: string;
    profile: string;
    final_price: number;
    confirmation_code: string;
    used: boolean;
    use_date: string | null;
  }
  
  export interface BookingListResponse {
    current_bookings: booked[];
    past_bookings: booked[];
  }