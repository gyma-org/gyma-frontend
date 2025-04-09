// types/booked.ts

export interface booked {
    gym_session: number;
    booking_date: string;
    gym_name: string;
    gym_address: string;
    user_name: string;
    profile: string;
    final_price: number;
    gym_session_date: string | Date;
    confirmation_code: string;
    used: boolean;
    use_date: string | null;
    start_time: string;
    end_time: string;
    gym_id: string;
    comment: number | null;
    id: number;

  }
  
  export interface BookingListResponse {
    current_bookings: booked[];
    past_bookings: booked[];
  }