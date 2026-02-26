"use client";

import React, { useState } from "react";
import { ArrowRight, Compass, Sparkles, MapPin } from "lucide-react";
import type { DiscoverySuggestion, MVPDestination, UserProfile } from "@/types";
import { MVP_DESTINATIONS } from "@/constants";

export interface DiscoveryModeProps {
  userProfile?: UserProfile | null;
  onSelectDestination: (destination: MVPDestination) => void;
  onBack: () => void;
}

export default function DiscoveryMode({ userProfile, onSelectDestination, onBack }: DiscoveryModeProps) {
  const [vibe, setVibe] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<DiscoverySuggestion[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe.trim()) return;

    setIsSearching(true);

    try {
      const isSlow = userProfile?.traits.pace === "Slow";
      const focus = userProfile?.traits.focus || "Nature";
      const season = "Winter"; // Default
      
      const payload = {
        vibe,
        pace: isSlow ? "Slow" : "Fast",
        focus: focus,
        season,
        budget: 45000, // standard baseline
        numDays: 5
      };

      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (data.recommendations) {
        const results: DiscoverySuggestion[] = data.recommendations.map((r: any) => ({
          destination: r.destination,
          reason: r.reason,
          imageUrl: `https://images.unsplash.com/photo-1544634076-a1014cc676b5?w=500&auto=format&fit=crop` // Default fallback image
        }));
        
        // Let's add specific images for specific outputs
        results.forEach(r => {
           if (r.destination.includes("Varanasi")) r.imageUrl = "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&auto=format&fit=crop";
           if (r.destination.includes("Hampta Pass") || r.destination.includes("Manali")) r.imageUrl = "https://images.unsplash.com/photo-1622308644420-a7d031952a22?w=500&auto=format&fit=crop";
           if (r.destination.includes("Goa")) r.imageUrl = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop";
           if (r.destination.includes("Sikkim")) r.imageUrl = "https://images.unsplash.com/photo-1544634076-a1014cc676b5?w=500&auto=format&fit=crop";
        });
        
        setSuggestions(results.slice(0, 2));
      } else {
        throw new Error("Invalid ML Response");
      }
    } catch(e) {
       console.error(e);
       // Fallback for safety
       setSuggestions([{
          destination: "Varanasi",
          reason: "Fallback: While chaotic outside, the early morning boat rides offer profound stillness.",
          imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&auto=format&fit=crop"
       }]);
    }

    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 flex items-center justify-center font-[family-name:var(--font-inter)] selection:bg-orange-500/30">
      <div className="max-w-xl w-full">
        
        {!suggestions ? (
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-stone-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-orange-100 text-[#E86B3D] rounded-full flex items-center justify-center mx-auto mb-6">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-2">Feeling Lost?</h2>
            <p className="text-stone-500 mb-8 leading-relaxed">
              Don't force a destination. Tell us what you're craving right now—peace, mountains, culture, or just an escape. We'll cross-reference it with your Travel DNA.
            </p>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  placeholder="e.g. 'I just want quiet mountains' or 'Vibrant culture'"
                  className="w-full pl-6 pr-12 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-base"
                />
                <button 
                  type="submit"
                  disabled={isSearching || !vibe}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-stone-900 text-white rounded-xl flex items-center justify-center hover:bg-stone-800 disabled:bg-stone-300 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <button onClick={onBack} className="mt-8 text-sm text-stone-400 hover:text-stone-600 font-medium transition">
              Nevermind, I know where I'm going
            </button>

            {isSearching && (
              <div className="mt-8 text-sm text-orange-600 flex items-center justify-center gap-2 animate-pulse font-medium">
                <Sparkles className="w-4 h-4" />
                Analyzing your traits to find the perfect fit...
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <span className="font-[family-name:var(--font-caveat)] text-2xl text-[#E86B3D]">Your Matches</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-stone-900 mt-1 mb-2">Based on your vibe</h2>
              <p className="text-stone-500">Here's where we think you belong.</p>
            </div>

            <div className="space-y-4">
              {suggestions.map((s, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col md:flex-row p-4 gap-6 group hover:border-[#E86B3D] transition">
                  <div className="w-full md:w-40 aspect-video md:aspect-square bg-stone-100 rounded-2xl overflow-hidden shrink-0">
                    <img src={s.imageUrl} alt={s.destination} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 py-2 pr-2">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <h3 className="text-xl font-bold text-stone-900">{s.destination}</h3>
                    </div>
                    
                    <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100/50 mb-4">
                      <p className="text-sm text-stone-700 leading-relaxed font-medium">
                        <strong className="text-orange-800 mr-1">Why this fits you:</strong> 
                        {s.reason}
                      </p>
                    </div>

                    <button 
                      onClick={() => onSelectDestination(s.destination)}
                      className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 px-6 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                    >
                      Plan this trip <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button 
                onClick={() => setSuggestions(null)} 
                className="text-stone-500 hover:text-stone-800 font-semibold px-6 py-2.5 rounded-xl border border-stone-200 hover:border-stone-400 bg-white transition"
              >
                Try a different vibe
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
