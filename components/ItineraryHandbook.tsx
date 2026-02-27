"use client";

/**
 * ItineraryHandbook – Hero moment: clean, skimmable travel handbook.
 * Best time, day-by-day, sightseeing, food, what to carry, do's & don'ts, safety.
 * Single CTA: "Confirm Trip (Mock Booking)"
 */

import React, { useRef, useState } from "react";
import type { HandbookItinerary } from "@/types";
import { Share2, Download, ShieldCheck, Sparkles, MapPin, Loader2, BookOpen } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ItineraryHandbookProps {
  handbook: HandbookItinerary;
  destination: string;
  days: number;
  onConfirm: () => void;
}

export default function ItineraryHandbook({
  handbook,
  destination,
  days,
  onConfirm,
}: ItineraryHandbookProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `My ${destination} Trip Blueprint`,
      text: `Check out our ${days}-day AI-crafted trip plan to ${destination} via safar.ai!`,
      url: window.location.href, // Or a mock shared URL if built
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(`Check out my safar.ai trip to ${destination}: ${window.location.href}`);
      alert("Link copied to clipboard!");
    }
  };

  const handleExportPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    
    setIsExporting(true);
    try {
      // Temporarily stash the action buttons to avoid putting them in the PDF
      const actionToolbar = document.getElementById("action-toolbar");
      const conversionCard = document.getElementById("safarnama-card");
      if (actionToolbar) actionToolbar.style.display = "none";
      if (conversionCard) conversionCard.style.display = "none";

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`safar.ai_${destination.replace(/\s+/g, '_')}_Itinerary.pdf`);

      if (actionToolbar) actionToolbar.style.display = "flex";
      if (conversionCard) conversionCard.style.display = "block";
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-[family-name:var(--font-inter)] selection:bg-orange-500/30 p-4 pb-20 pt-12">
      <div 
        ref={printRef}
        className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-[family-name:var(--font-caveat)] text-2xl text-[#E86B3D]">Your Blueprint</span>
            <h1 className="text-4xl font-extrabold text-stone-900 mt-1 tracking-tight">
              {destination}
            </h1>
            <p className="text-stone-500 font-medium mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-stone-400" /> {days}-Day AI-Crafted Plan
            </p>
          </div>
          
          {/* Action Toolbar */}
          <div id="action-toolbar" className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:text-stone-900 hover:border-stone-300 transition shadow-sm font-semibold text-sm"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:text-stone-900 hover:border-stone-300 transition shadow-sm font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* Dynamic Context: Culture, History, Blogs */}
        <div className="mb-8 space-y-4">
           {/* Culture & History */}
           <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-5 h-5 text-[#E86B3D]" />
               <h3 className="font-bold text-lg">Cultural Significance & History</h3>
             </div>
             <p className="text-stone-300 text-sm leading-relaxed">
               {destination} stands as a testament to centuries of evolving human history and natural splendor. 
               Whether you're exploring its ancient architectural wonders, tasting the complex spices of its generational recipes, 
               or simply walking roads carved out by early settlers, there is an undeniable energy here. 
               The local philosophy heavily emphasizes community and respect for the natural environment, 
               creating a vibrant, deeply rooted cultural fabric that contrasts beautifully with modern influences.
             </p>
           </div>

           {/* Blogs & Reading */}
           <div className="bg-white border text-stone-900 border-stone-200 p-6 rounded-2xl shadow-sm">
             <div className="flex items-center gap-2 mb-4">
               <BookOpen className="w-5 h-5 text-stone-400" />
               <h3 className="font-bold text-lg">Curated Travel Blogs & Reading</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="#" onClick={(e) => e.preventDefault()} className="block p-4 rounded-xl border border-stone-100 bg-stone-50 hover:border-orange-200 transition group cursor-pointer">
                   <h4 className="font-semibold text-sm group-hover:text-orange-600 transition">Locals' Guide to {destination}</h4>
                   <p className="text-xs text-stone-500 mt-1">Nomadic Matt • 5 min read</p>
                   <p className="text-xs text-stone-600 mt-2 line-clamp-2">Discovering the hidden cafes, quiet streets, and lesser-known historical markers that most tourists completely miss...</p>
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} className="block p-4 rounded-xl border border-stone-100 bg-stone-50 hover:border-orange-200 transition group cursor-pointer">
                   <h4 className="font-semibold text-sm group-hover:text-orange-600 transition">What to pack for {destination}</h4>
                   <p className="text-xs text-stone-500 mt-1">The Blonde Abroad • 3 min read</p>
                   <p className="text-xs text-stone-600 mt-2 line-clamp-2">A comprehensive checklist ensuring you are prepared for the unpredictable weather and cultural modesty requirements...</p>
                </a>
             </div>
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
          {/* Best time */}
          <section className="p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-2">Best time to visit</h2>
            <p className="text-stone-700">{handbook.bestTimeToVisit}</p>
          </section>

          {/* Day by day */}
          <section className="p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Day-by-day</h2>
            <div className="space-y-6">
              {handbook.dayByDay.map((d) => (
                <div key={d.day} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                  <div className="font-semibold text-stone-900 mb-3">Day {d.day}</div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-stone-700">Morning:</span> {d.morning}</p>
                    <p><span className="font-medium text-stone-700">Afternoon:</span> {d.afternoon}</p>
                    <p><span className="font-medium text-stone-700">Evening:</span> {d.evening}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sightseeing */}
          <section className="p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-2">Sightseeing</h2>
            <ul className="list-disc list-inside text-stone-700 space-y-1">
              {handbook.sightseeing.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>

          {/* Food to try */}
          <section className="p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-2">Food to try</h2>
            <ul className="list-disc list-inside text-stone-700 space-y-1">
              {handbook.foodToTry.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </section>

          {/* What to carry */}
          <section className="p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-2">What to carry</h2>
            <ul className="list-disc list-inside text-stone-700 space-y-1">
              {handbook.whatToCarry.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </section>

          {/* Do's & Don'ts */}
          <section className="p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-3">Do&apos;s & Don&apos;ts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="font-semibold text-green-800 mb-2">Do</div>
                <ul className="list-disc list-inside text-green-800/90 text-sm space-y-1">
                  {handbook.dosAndDonts.do.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="font-semibold text-amber-900 mb-2">Don&apos;t</div>
                <ul className="list-disc list-inside text-amber-900/90 text-sm space-y-1">
                  {handbook.dosAndDonts.dont.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Safety */}
          <section className="p-6 bg-stone-50">
            <h2 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Safety Notes
            </h2>
            <ul className="list-disc list-inside text-stone-700 space-y-1.5 text-sm leading-relaxed">
              {handbook.safetyNotes.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* -----------------------------
            SAFARNAMA PACKAGES (MONETIZATION)
            ----------------------------- */}
        <div id="safarnama-card" className="mt-12 mb-8 relative">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
             </div>
             <div>
                <h3 className="text-2xl font-extrabold tracking-tight">Safarnama Recommended Packages</h3>
                <p className="text-stone-500 text-sm">Done-for-you alternatives to your DIY plan above.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Standard Package */}
            <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 shadow-sm hover:border-[#E86B3D]/50 transition flex flex-col">
               <div className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit">
                 Essential Logistics
               </div>
               <h4 className="text-xl font-bold mb-1">Seamless Explorer</h4>
               <p className="text-stone-500 text-sm mb-4">Focus on the experience, we handle the friction.</p>

               <div className="space-y-3 mb-6 text-sm flex-1">
                 <div>
                   <span className="font-semibold text-stone-900 block mb-1">What Safarnama Handles:</span>
                   <p className="text-stone-600">All stays (3-star+ verified), internal transit (cabs/buses), and necessary regional permits.</p>
                 </div>
                 <div>
                   <span className="font-semibold text-stone-900 block mb-1">Better than DIY:</span>
                   <p className="text-stone-600">No haggling with taxis or decoding outdated permit portals.</p>
                 </div>
                 <div>
                   <span className="font-semibold text-stone-900 block mb-1">Who this is for:</span>
                   <p className="text-stone-600">Independent travelers who want safety nets without a strict tour guide.</p>
                 </div>
               </div>

               <div className="mt-auto border-t border-stone-100 pt-4 flex items-center justify-between">
                 <div>
                   <span className="text-xs text-stone-400 block font-semibold uppercase">Pricing</span>
                   <span className="text-xl font-extrabold text-stone-900">₹{Math.round(days * 4500).toLocaleString()}+ <span className="text-sm font-medium text-stone-400">/person</span></span>
                 </div>
                 <button onClick={onConfirm} className="bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 px-6 rounded-xl transition text-sm">
                   Book Standard
                 </button>
               </div>
            </div>

            {/* Premium Package */}
            <div className="bg-stone-900 border-2 border-stone-900 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col group hover:shadow-xl transition">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition duration-1000">
                  <Sparkles className="w-48 h-48 rotate-12" />
               </div>

               <div className="relative z-10">
                 <div className="inline-flex items-center gap-1.5 bg-[#E86B3D]/20 text-[#E86B3D] px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit border border-[#E86B3D]/30">
                   Full Immersion
                 </div>
                 <h4 className="text-xl font-bold mb-1">The Curated Journey</h4>
                 <p className="text-stone-400 text-sm mb-4">Premium execution of your safar.ai blueprint.</p>

                 <div className="space-y-3 mb-6 text-sm flex-1">
                   <div>
                     <span className="font-semibold text-white block mb-1">What Safarnama Handles:</span>
                     <p className="text-stone-400">Boutique 4/5-star stays, private chauffeur, curated local dining reservations, and an on-call concierge.</p>
                   </div>
                   <div>
                     <span className="font-semibold text-white block mb-1">Better than DIY:</span>
                     <p className="text-stone-400">Zero decision fatigue. VIP access and guaranteed comfort everywhere.</p>
                   </div>
                   <div>
                     <span className="font-semibold text-white block mb-1">Who this is for:</span>
                     <p className="text-stone-400">Couples and families looking for a stress-free, deeply memorable vacation.</p>
                   </div>
                 </div>
                 
                 <div className="mt-auto border-t border-stone-800 pt-4 flex items-center justify-between">
                   <div>
                     <span className="text-xs text-stone-500 block font-semibold uppercase">Pricing</span>
                     <span className="text-xl font-extrabold text-white">₹{Math.round(days * 8500).toLocaleString()}+ <span className="text-sm font-medium text-stone-500">/person</span></span>
                   </div>
                   <button onClick={onConfirm} className="bg-[#E86B3D] hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl transition text-sm shadow-sm shadow-[#E86B3D]/20">
                     Book Premium
                   </button>
                 </div>
               </div>
            </div>
            
          </div>
          <p className="mt-4 text-xs text-stone-400 text-center">
            No commitment. We'll verify availability and follow up within 2 hours. Pricing is approximate based on seasonality.
          </p>
        </div>
        
      </div>
    </div>
  );
}
