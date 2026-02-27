"use client";

/**
 * BookingConfirmationDisplay – Step 4: Confirmation.
 * Shows confirmation number, booking details, trip summary, and next steps; print/PDF and plan another trip.
 */

import React from "react";
import type { BookingConfirmation, TripData, CandidateOption } from "@/types";
import { CURRENCY_SYMBOL } from "@/constants";

export interface BookingConfirmationDisplayProps {
  booking: BookingConfirmation;
  tripData: TripData;
  selectedCandidate: CandidateOption | null;
  onNewTrip: () => void;
}

export default function BookingConfirmationDisplay({
  booking,
  tripData,
  onNewTrip,
}: BookingConfirmationDisplayProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert("PDF download feature coming soon!");
  };

  const destination = tripData.destination || booking.tripId.split("_")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">Your adventure awaits!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 text-center">
            <div className="text-sm font-semibold opacity-90 mb-2">
              CONFIRMATION NUMBER
            </div>
            <div className="text-3xl font-bold tracking-wide">
              {booking.confirmationNumber}
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-gray-600 font-semibold mb-1">
                    Booking ID
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {booking.bookingId}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-gray-600 font-semibold mb-1">
                    Trip ID
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {booking.tripId}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-xs text-gray-600 font-semibold mb-1">
                    Status
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {booking.status}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-xs text-gray-600 font-semibold mb-1">
                    Payment
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {booking.paymentStatus}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Trip Details
              </h2>
              <div className="bg-purple-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">📍 Destination</span>
                  <span className="font-bold text-gray-900">{destination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">⏱️ Daily Activity</span>
                  <span className="font-bold text-gray-900">
                    {booking.itinerary.dailyActivityHours}h/day
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">😴 Rest Days</span>
                  <span className="font-bold text-gray-900">
                    {booking.itinerary.restDays} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">😓 Travel Fatigue</span>
                  <span className="font-bold text-gray-900">
                    {booking.itinerary.travelFatigueScore.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
              <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">
                    Locked Budget
                  </span>
                  <span className="text-3xl font-bold text-indigo-600">
                    {CURRENCY_SYMBOL}{booking.lockedBudget.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  Status:{" "}
                  <span className="font-semibold text-indigo-600">LOCKED</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Customer Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">👤 Name</span>
                  <span className="font-bold text-gray-900">
                    {booking.userContact.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">✉️ Email</span>
                  <span className="font-bold text-gray-900">
                    {booking.userContact.email}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">📱 Phone</span>
                  <span className="font-bold text-gray-900">
                    {booking.userContact.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-green-600 rounded-full" />
                    <div className="w-0.5 h-12 bg-gray-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Booking Confirmed
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(booking.bookedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Valid Until
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(booking.validUntil).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📋 Next Steps
              </h2>
              <ol className="space-y-3">
                {booking.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="font-bold text-blue-600 w-6">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">
                    Demo Notice
                  </h4>
                  <p className="text-sm text-yellow-800">
                    This is a mock booking for demonstration. No real payment has
                    been processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-col sm:flex-row">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <span>🖨️</span> Print Confirmation
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <span>📄</span> Download PDF
          </button>
        </div>

        <button
          onClick={onNewTrip}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2 text-lg"
        >
          <span>➕</span> Plan Another Trip
        </button>

        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Thank you for using Safar — your trip is confidently planned.</p>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; }
          button { display: none; }
        }
      `}</style>
    </div>
  );
}
