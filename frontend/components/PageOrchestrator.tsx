"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import AuthScreen from "@/components/AuthScreen";
import OnboardingScreen from "@/components/OnboardingScreen";
import TripIntent from "@/components/TripIntent";
import DiscoveryMode from "@/components/DiscoveryMode";
import DestinationJustification from "@/components/DestinationJustification";
import PlanningScreen from "@/components/PlanningScreen";
import BudgetFirst from "@/components/BudgetFirst";
import ItineraryHandbook from "@/components/ItineraryHandbook";
import BookingForm from "@/components/BookingForm";
import BookingConfirmationDisplay from "@/components/BookingConfirmationDisplay";
import { useTripContext } from "@/context/TripContext";
import { useTrip } from "@/hooks/useTrip";
import type { PageStep, TripIntentFormDataMVP, MVPDestination } from "@/types";
import { getHandbookContent } from "@/data/handbookContent";
import { STEP_LABELS } from "@/constants";

function travelStyleToCandidateIndex(style: string): number {
  if (style === "Relaxed") return 2;
  if (style === "Adventure") return 1;
  return 0;
}

export default function PageOrchestrator({ activeRoute }: { activeRoute: string }) {
  const router = useRouter();
  const {
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
  } = useTripContext();

  const {
    loading: apiLoading,
    createTripIntentMVP,
    getBudgetPrediction,
    getItineraryCandidates,
    createBooking,
  } = useTrip();

  // Navigation Helper
  const goTo = (route: string) => {
    if (route === "landing") router.push("/");
    else router.push(`/${route}`);
  };

  const handleIntentSubmit = async (data: TripIntentFormDataMVP) => {
    try {
      const intent = await createTripIntentMVP(data);
      setTripData({
        tripId: intent.tripId,
        destination: data.destination,
        days: data.days,
        people: 1,
        season: "",
        comfortLevel: data.budgetStyle === "Budget" ? "Budget" : "Standard",
        tripType:
          data.travelStyle === "Relaxed"
            ? "Relaxation"
            : data.travelStyle === "Adventure"
              ? "Adventure"
              : "Cultural",
        predictedBudget: {
          totalINR: intent.predictedBudget?.totalINR ?? 0,
          currency: intent.predictedBudget?.currency ?? "INR",
        },
        budgetStyle: data.budgetStyle,
        travelStyle: data.travelStyle,
      });
      setBudgetBreakdown(null);
      setCandidates([]);
      setSelectedCandidate(null);
      goTo("planning");

      const comfort = data.budgetStyle === "Budget" ? "Budget" : "Standard";
      const budgetTotal = intent.predictedBudget?.totalINR ?? data.days * 6000;

      const [budgetRes, candRes] = await Promise.all([
        getBudgetPrediction(intent.tripId, data.days, 1, "Winter", comfort),
        getItineraryCandidates(intent.tripId, budgetTotal, data.days),
      ]);

      const breakdown = budgetRes.budgetBreakdown ?? {
        stay: Math.round(budgetTotal * 0.35),
        travel: Math.round(budgetTotal * 0.25),
        food: Math.round(budgetTotal * 0.25),
        activities: Math.round(budgetTotal * 0.15),
        total: budgetTotal,
        currency: "INR",
      };
      setBudgetBreakdown(breakdown);
      const list = candRes.candidates ?? [];
      setCandidates(list);
      const idx = travelStyleToCandidateIndex(data.travelStyle);
      setSelectedCandidate(list[idx]?.candidate ?? null);
    } catch (err) {
      console.error("Error starting trip plan:", err);
    }
  };

  const handlePlanningComplete = () => goTo("budget");
  const handleBudgetContinue = () => goTo("itinerary");
  const handleItineraryConfirm = () => goTo("booking");

  const handleCreateBooking = async (contact: { name: string; email: string; phone: string; }) => {
    if (!selectedCandidate || !tripData) throw new Error("Missing required data");
    const confirmation = await createBooking(tripData.tripId, selectedCandidate, contact);
    setBooking(confirmation);
    goTo("confirmation");
    return confirmation;
  };

  const handleStartPlanning = () => {
    if (!sessionChecked) {
       goTo("auth");
       return;
    } 
    if (!isLoggedIn) {
      goTo("auth");
    } else if (!isOnboarded) {
      goTo("onboarding");
    } else {
      goTo("intent");
    }
  };

  const handleAuthSuccess = (user: any) => {
    setIsLoggedIn(true);
    setUserProfile({
      name: user.name,
      email: user.email,
      traits: { pace: "Slow", focus: "Nature", planning: "Spontaneous" },
      creatorMode: "None"
    });
    fetch("/api/auth/me").then(res => res.json()).then(data => {
       if (data.session?.onboarded) {
           setIsOnboarded(true);
           goTo("intent");
       } else {
           goTo("onboarding");
       }
    })
  };

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    goTo("intent");
  };

  const handleDiscover = () => goTo("discovery");

  const handleSelectFromDiscovery = (dest: MVPDestination, reason?: string) => {
    setInitialDestination(dest);
    setJustificationReason(reason);
    goTo("justification");
  };

  const handleJustificationContinue = () => goTo("intent");
  
  const handleJustificationBack = () => {
     setInitialDestination(undefined);
     setJustificationReason(undefined);
     goTo("discovery");
  };

  const handleNewTrip = () => {
    clearTrip();
    goTo("intent");
  };

  const stepLabel = STEP_LABELS[activeRoute as PageStep] ?? activeRoute;
  const planningReady = !!tripData && !!budgetBreakdown && candidates.length > 0 && !!selectedCandidate;

  // Immersive screens
  if (activeRoute === "landing") return <LandingPage onStart={handleStartPlanning} />;
  if (activeRoute === "auth") return <AuthScreen onSuccess={handleAuthSuccess} />;
  if (activeRoute === "onboarding") return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  
  if (activeRoute === "discovery") {
    return (
      <DiscoveryMode 
        userProfile={userProfile} 
        onSelectDestination={handleSelectFromDiscovery} 
        onBack={() => goTo("intent")} 
      />
    );
  }

  if (activeRoute === "justification" && initialDestination) {
    return (
      <DestinationJustification
        destination={typeof initialDestination === "string" ? initialDestination : (initialDestination as any).name ?? "India"}
        reason={justificationReason}
        onContinue={handleJustificationContinue}
        onBack={handleJustificationBack}
      />
    );
  }

  // App Layout for core flow
  return (
    <main className="min-h-screen bg-[#FAF9F6] font-[family-name:var(--font-inter)] selection:bg-orange-500/30">
      <header className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-stone-200 text-stone-900 shadow-xs z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => goTo("landing")}>
            <span className="text-xl">✈️</span>
            <h1 className="text-xl font-bold tracking-tight">Safar</h1>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <span className="text-sm font-semibold text-stone-600 hidden sm:inline-block">
                Hi, {userProfile.name}
              </span>
            )}
            <div className="text-sm text-stone-400 font-medium px-3 py-1 bg-stone-100 rounded-full">{stepLabel}</div>
          </div>
        </div>
      </header>

      <div className="pb-12">
        {activeRoute === "intent" && (
          <TripIntent
            onSubmit={handleIntentSubmit}
            onDiscover={handleDiscover}
            initialDestination={initialDestination}
            userProfile={userProfile}
            loading={apiLoading}
            error={null}
          />
        )}

        {activeRoute === "planning" && (
          <PlanningScreen
            onComplete={handlePlanningComplete}
            ready={planningReady}
            minDisplayMs={5000}
          />
        )}

        {activeRoute === "budget" && tripData && budgetBreakdown && (
          <BudgetFirst
            breakdown={budgetBreakdown}
            destination={tripData.destination}
            days={tripData.days}
            onContinue={handleBudgetContinue}
          />
        )}

        {activeRoute === "itinerary" && tripData && (
          <ItineraryHandbook
            handbook={getHandbookContent(tripData.destination as any, tripData.days)}
            destination={tripData.destination}
            days={tripData.days}
            onConfirm={handleItineraryConfirm}
          />
        )}

        {activeRoute === "booking" && tripData && selectedCandidate && (
          <BookingForm
            selectedCandidate={selectedCandidate}
            tripData={tripData}
            onBookingConfirmed={setBooking}
            onBack={() => goTo("itinerary")}
            onCreateBooking={handleCreateBooking}
            loading={apiLoading}
          />
        )}

        {activeRoute === "confirmation" && booking && tripData && (
          <BookingConfirmationDisplay
            booking={booking}
            tripData={tripData}
            selectedCandidate={selectedCandidate}
            onNewTrip={handleNewTrip}
          />
        )}
      </div>

      <footer className="border-t border-stone-200 bg-stone-900/50 text-stone-400">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm">
          <p>
            Planned using real travel data. Designed with safety in mind. Built
            for realistic travel.
          </p>
          <p className="mt-2 text-stone-500">
            © {new Date().getFullYear()} Safar. Mock booking — no real payments.
          </p>
        </div>
      </footer>
    </main>
  );
}
