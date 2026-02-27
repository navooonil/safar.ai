"use client";

import React, { useState } from "react";
import { ArrowRight, Lock, Loader2, Compass, Wallet, Users, LayoutList } from "lucide-react";

export interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    travel_style: "",
    budget_comfort: "",
    group_type: "",
    interests: [] as string[]
  });

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/onboarding", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save traits");
      onComplete(); // move forward in the app
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = !!formData.travel_style && !!formData.budget_comfort;
  const isStep2Valid = !!formData.group_type && formData.interests.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-[family-name:var(--font-inter)] selection:bg-orange-500/30 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-stone-100 relative">
        
        {error && (
           <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-200">
             {error}
           </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
            <span className="font-[family-name:var(--font-caveat)] text-2xl text-[#E86B3D]">Your Travel DNA</span>
            <h2 className="text-3xl font-extrabold tracking-tight mb-8 mt-1">Setup your profile</h2>
            
            <div className="space-y-8">
              {/* Travel Style */}
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2"><Compass className="w-4 h-4 text-stone-400"/> Travel Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["relaxed", "balanced", "adventure"].map(style => (
                    <button 
                      key={style}
                      onClick={() => setFormData({...formData, travel_style: style})} 
                      className={`p-3 rounded-xl border-2 text-center text-sm font-semibold capitalize transition ${formData.travel_style === style ? "border-orange-500 bg-orange-50 text-orange-700" : "border-stone-100 bg-white hover:border-stone-200 text-stone-600"}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Comfort */}
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2"><Wallet className="w-4 h-4 text-stone-400" /> Default Budget Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["budget", "mid", "premium"].map(b => (
                    <button 
                      key={b}
                      onClick={() => setFormData({...formData, budget_comfort: b})} 
                      className={`p-3 rounded-xl border-2 text-center text-sm font-semibold capitalize transition ${formData.budget_comfort === b ? "border-orange-500 bg-orange-50 text-orange-700" : "border-stone-100 bg-white hover:border-stone-200 text-stone-600"}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!isStep1Valid}
              className="mt-10 w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
            <span className="font-[family-name:var(--font-caveat)] text-2xl text-[#E86B3D]">Almost Done</span>
            <h2 className="text-3xl font-extrabold tracking-tight mb-8 mt-1">Flesh out the details</h2>
            
            <div className="space-y-8">
              {/* Group Type */}
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-stone-400"/> Typical Group Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {["solo", "couple", "friends", "family"].map(g => (
                    <button 
                      key={g}
                      onClick={() => setFormData({...formData, group_type: g})} 
                      className={`p-3 rounded-xl border-2 text-center text-sm font-semibold capitalize transition ${formData.group_type === g ? "border-orange-500 bg-orange-50 text-orange-700" : "border-stone-100 bg-white hover:border-stone-200 text-stone-600"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

               {/* Interests */}
               <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2"><LayoutList className="w-4 h-4 text-stone-400"/> Core Interests (Select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {["nature", "food", "culture", "history", "nightlife", "spirituality"].map(interest => (
                    <button 
                      key={interest}
                      onClick={() => handleInterestToggle(interest)} 
                      className={`px-4 py-2 rounded-full border-2 text-sm font-semibold capitalize transition ${formData.interests.includes(interest) ? "border-orange-500 bg-orange-50 text-orange-700" : "border-stone-100 bg-white hover:border-stone-200 text-stone-600"}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

            </div>

             <div className="mt-8 flex items-center gap-3 text-xs text-stone-400 bg-stone-50 p-3 rounded-lg border border-stone-100">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              <p>These traits only inform the safar.ai engine locally. No generic scraping is used to model your profile.</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleBack} disabled={loading} className="px-6 py-3.5 rounded-xl font-semibold border border-stone-200 hover:bg-stone-50 transition">
                Back
              </button>
              <button 
                 onClick={handleSubmit} 
                 disabled={!isStep2Valid || loading}
                 className="flex-1 bg-[#E86B3D] hover:bg-orange-600 disabled:bg-stone-300 disabled:text-stone-500 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
