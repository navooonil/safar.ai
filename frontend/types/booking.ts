/**
 * Booking and user contact types.
 */

export interface UserContact {
  name: string;
  email: string;
  phone: string;
}

/** Itinerary summary stored on a booking */
export interface BookingItinerary {
  dailyActivityHours: number;
  restDays: number;
  travelFatigueScore: number;
}

/** Full booking confirmation returned after createBooking */
export interface BookingConfirmation {
  bookingId: string;
  confirmationNumber: string;
  tripId: string;
  status: string;
  paymentStatus: string;
  lockedBudget: number;
  userContact: UserContact;
  itinerary: BookingItinerary;
  bookedAt: string;
  validUntil: string;
  nextSteps: string[];
}
