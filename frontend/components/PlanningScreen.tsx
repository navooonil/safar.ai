"use client";

/**
 * PlanningScreen – "We Are Planning Your Trip".
 * Trust-building system messages. No tech jargon.
 */

import React, { useState, useEffect } from "react";
import { PLANNING_MESSAGES } from "@/constants";

export interface PlanningScreenProps {
  /** Called when planning is done (e.g. after messages have been shown and data is ready) */
  onComplete?: () => void;
  /** If true, call onComplete when ready (parent controls timing) */
  ready?: boolean;
  /** Minimum time to show messages (ms) before allowing completion */
  minDisplayMs?: number;
}

const MESSAGE_INTERVAL_MS = 1800;

export default function PlanningScreen({
  onComplete,
  ready = false,
  minDisplayMs = 5000,
}: PlanningScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % PLANNING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), minDisplayMs);
    return () => clearTimeout(t);
  }, [minDisplayMs]);

  useEffect(() => {
    if (onComplete && ready && minTimeElapsed) {
      onComplete();
    }
  }, [onComplete, ready, minTimeElapsed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex h-14 w-14 rounded-full bg-amber-100 items-center justify-center mb-6">
            <span className="text-2xl">✈️</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            We’re planning your trip
          </h1>
          <p className="text-stone-600">
            This usually takes a few seconds.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 min-h-[120px] flex flex-col justify-center">
          <p className="text-stone-800 font-medium">
            {PLANNING_MESSAGES[messageIndex]}
          </p>
          <div className="mt-4 flex justify-center gap-1">
            {PLANNING_MESSAGES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === messageIndex ? "bg-amber-500" : "bg-stone-200"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-stone-500">
          Planned using real travel data. Designed with safety in mind.
        </p>
      </div>
    </div>
  );
}
