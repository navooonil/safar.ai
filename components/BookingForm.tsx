"use client";

/**
 * BookingForm – Step 3: Complete Your Booking.
 * Contact form (name, email, phone) and terms; calls onCreateBooking then onBookingConfirmed.
 */

import React, { useState } from "react";
import type { BookingConfirmation, TripData, CandidateOption } from "@/types";

export interface BookingFormProps {
  onBookingConfirmed: (booking: BookingConfirmation) => void;
  onBack: () => void;
  onCreateBooking: (contact: { name: string; email: string; phone: string }) => Promise<BookingConfirmation>;
  loading: boolean;
  selectedCandidate: CandidateOption;
  tripData: TripData;
}

export default function BookingForm({
  onBookingConfirmed,
  onBack,
  onCreateBooking,
  loading,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91-9876543210",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!agreedToTerms) {
      setError("Please agree to terms and conditions");
      return;
    }
    try {
      const booking = await onCreateBooking(formData);
      onBookingConfirmed(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Confirm your trip
          </h1>
          <p className="text-stone-600">
            A few details so we can send your confirmation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ✉️ Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+91-XXXXXXXXXX"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex gap-3">
                <span className="text-xl">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">
                    Demo booking
                  </h4>
                  <p className="text-sm text-amber-800">
                    This is a mock booking. No real payment will be processed.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded cursor-pointer mt-1"
              />
              <label className="text-sm text-gray-700 cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  terms and conditions
                </a>{" "}
                and have reviewed the itinerary details
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="flex-1 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Confirming…</>
                ) : (
                  <>Confirm trip (mock booking)</>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>🔒 Your information is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
}
