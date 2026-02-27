"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTripContext } from "@/context/TripContext";
import PageOrchestrator from "@/components/PageOrchestrator";

export default function ItineraryPage() {
  return <PageOrchestrator activeRoute="itinerary" />;
}
