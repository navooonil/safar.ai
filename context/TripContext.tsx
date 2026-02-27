"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { 
  UserProfile, 
  MVPDestination, 
  TripData, 
  BudgetBreakdown 
} from "@/types";
import type { 
  ItineraryCandidate, 
  BookingConfirmation, 
  CandidateOption 
} from "@/hooks/useTrip";

interface TripContextType {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  sessionChecked: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isOnboarded: boolean;
  setIsOnboarded: React.Dispatch<React.SetStateAction<boolean>>;
  initialDestination: MVPDestination | undefined;
  setInitialDestination: React.Dispatch<React.SetStateAction<MVPDestination | undefined>>;
  justificationReason: string | undefined;
  setJustificationReason: React.Dispatch<React.SetStateAction<string | undefined>>;
  tripData: TripData | null;
  setTripData: React.Dispatch<React.SetStateAction<TripData | null>>;
  budgetBreakdown: BudgetBreakdown | null;
  setBudgetBreakdown: React.Dispatch<React.SetStateAction<BudgetBreakdown | null>>;
  candidates: ItineraryCandidate[];
  setCandidates: React.Dispatch<React.SetStateAction<ItineraryCandidate[]>>;
  selectedCandidate: CandidateOption | null;
  setSelectedCandidate: React.Dispatch<React.SetStateAction<CandidateOption | null>>;
  booking: BookingConfirmation | null;
  setBooking: React.Dispatch<React.SetStateAction<BookingConfirmation | null>>;
  clearTrip: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  
  const [initialDestination, setInitialDestination] = useState<MVPDestination | undefined>(undefined);
  const [justificationReason, setJustificationReason] = useState<string | undefined>(undefined);
  
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown | null>(null);
  const [candidates, setCandidates] = useState<ItineraryCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateOption | null>(null);
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.session) {
          setIsLoggedIn(true);
          setUserProfile({
             name: data.session.name,
             email: data.session.email,
             traits: {
                 pace: data.session.traits?.inferred_pace || "Slow",
                 focus: "Nature",
                 planning: "Spontaneous"
             },
             creatorMode: "None"
          });
          setIsOnboarded(data.session.onboarded);
        }
      })
      .catch(err => console.error("Session check failed", err))
      .finally(() => setSessionChecked(true));
  }, []);

  const clearTrip = () => {
    setTripData(null);
    setBudgetBreakdown(null);
    setCandidates([]);
    setSelectedCandidate(null);
    setBooking(null);
    setInitialDestination(undefined);
    setJustificationReason(undefined);
  };

  return (
    <TripContext.Provider value={{
      userProfile, setUserProfile,
      sessionChecked,
      isLoggedIn, setIsLoggedIn,
      isOnboarded, setIsOnboarded,
      initialDestination, setInitialDestination,
      justificationReason, setJustificationReason,
      tripData, setTripData,
      budgetBreakdown, setBudgetBreakdown,
      candidates, setCandidates,
      selectedCandidate, setSelectedCandidate,
      booking, setBooking,
      clearTrip
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTripContext must be used within a TripProvider");
  }
  return context;
}
