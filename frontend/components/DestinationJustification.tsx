import React, { useEffect, useState } from "react";
import { ArrowRight, Globe, PlayCircle, BookOpen, Quote, ShieldCheck } from "lucide-react";

export interface DestinationJustificationProps {
  destination: string;
  reason?: string;
  onContinue: () => void;
  onBack: () => void;
}

export default function DestinationJustification({
  destination,
  reason,
  onContinue,
  onBack
}: DestinationJustificationProps) {
  
  // Simulated ML pipeline contextual fetching
  const contentMap: Record<string, any> = {
    "Varanasi": {
       culture: "The spiritual capital of India. It's not just a city, it's a living timeline of human faith dating back over 3,000 years. The rituals along the Ghats provide a chaotic but profound stillness.",
       blogs: [
         { title: "Varanasi: Beyond the Chaos", author: "Nomadic Matt", summary: "A deep dive into why the initial overwhelm of the city slowly gives way to an undeniable spiritual energy." },
         { title: "Best Ghats to Visit at Sunrise", author: "The Shooting Star", summary: "Photographic journey along the Ganges, highlighting Assi Ghat and Dashashwamedh Ghat." }
       ],
       video: "https://www.youtube.com/embed/1vRzN2P0Xj0?autoplay=0&controls=1", // Placeholder mock link
       image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=1200"
    },
    "Hampta Pass": {
       culture: "A dramatic crossover trek connecting the lush green valleys of Kullu to the stark, barren landscapes of Lahaul. It perfectly captures the geological duality of the Himalayas in a condensed timeframe.",
       blogs: [
         { title: "Why Hampta Pass is the Perfect First Trek", author: "Indiahikes", summary: "Outlining the moderate difficulty curve and the unmatched visual rewards of crossing the pass." },
         { title: "Packing for the Himalayan Monsoon", author: "Trek The Himalayas", summary: "Essential gear list for staying dry while experiencing the dramatic cloud formations." }
       ],
       video: "https://www.youtube.com/embed/placeholder2?autoplay=0",
       image: "https://images.unsplash.com/photo-1622308644420-a7d031952a22?auto=format&fit=crop&q=80&w=1200"
    },
    "Sikkim": {
       culture: "A pristine former kingdom nestled in the Himalayas. It fuses Tibetan Buddhism with Indian culture, boasting the cleanest views of Kangchenjunga and a deeply ingrained eco-conscious mindset.",
       blogs: [
         { title: "The Quiet Monasteries of Rumtek", author: "Outlook Traveller", summary: "Finding silence and perspective away from the main tourist hubs." },
         { title: "Sikkim's Organic Revolution", author: "Conde Nast", summary: "How this state became 100% organic and how it impacts local cuisine." }
       ],
       video: "https://www.youtube.com/embed/placeholder3?autoplay=0",
       image: "https://images.unsplash.com/photo-1544634076-a1014cc676b5?auto=format&fit=crop&q=80&w=1200"
    }
  };

  const getFallback = (dest: string) => ({
    culture: `${dest} is a fascinating blend of regional history and evolving modern culture. From its ancient roots to its current status, it offers a deeply layered travel experience.`,
    blogs: [
         { title: `A Weekend Guide to ${dest}`, author: "Travel Triangle", summary: `The must-see locations and hidden gems scattered across ${dest}.` },
         { title: `Local Cuisine in ${dest}`, author: "Eater India", summary: "Exploring the street food and traditional recipes passed down through generations." }
    ],
    video: "https://www.youtube.com/embed/placeholder-default",
    image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&q=80&w=1200"
  });

  const content = Object.keys(contentMap).find(k => destination.toLowerCase().includes(k.toLowerCase())) 
      ? contentMap[Object.keys(contentMap).find(k => destination.toLowerCase().includes(k.toLowerCase()))!] 
      : getFallback(destination);

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-[family-name:var(--font-inter)] selection:bg-orange-500/30 p-4 pb-20 pt-8 sm:pt-16">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header & Hero Image */}
        <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 mb-8 border border-stone-200">
           <img src={content.image} alt={destination} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <span className="font-[family-name:var(--font-caveat)] text-2xl text-[#E86B3D] mb-1">Destination Unlocked</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{destination}</h1>
           </div>
        </div>

        {/* Reason Match */}
        {reason && (
           <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
             <div className="flex items-start gap-4">
               <ShieldCheck className="w-8 h-8 text-[#E86B3D] shrink-0 mt-1" />
               <div>
                 <h3 className="text-lg font-bold mb-2">Why safar.ai chose this for you</h3>
                 <p className="text-stone-300 leading-relaxed">{reason}</p>
               </div>
             </div>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Cultural Context */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
               <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                 <Globe className="w-5 h-5 text-stone-400" /> Cultural & Historical Context
               </h3>
               <p className="text-stone-600 leading-relaxed text-sm">
                 {content.culture}
               </p>
            </div>

            {/* Video Vlog */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
               <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                 <PlayCircle className="w-5 h-5 text-stone-400" /> Travel Vlog Perspective
               </h3>
               <div className="w-full aspect-video bg-stone-100 rounded-xl overflow-hidden relative flex items-center justify-center border border-stone-200 group cursor-pointer" onClick={() => alert("External Video Frame Mock. YouTube API would embed here safely without tracking cookies.")}>
                 {/* Visual Mock of video */}
                 <div className="absolute inset-0 bg-stone-800/20 group-hover:bg-stone-800/40 transition"></div>
                 <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition z-10" />
                 <span className="absolute bottom-2 left-2 text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded">Visual Journey of {destination}</span>
               </div>
            </div>
        </div>

        {/* Public Curations */}
        <div className="mb-12">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                 <BookOpen className="w-5 h-5 text-stone-400" /> Insights from Public Travel Blogs
            </h3>
            <p className="text-xs text-stone-500 mb-4 px-1 uppercase tracking-wider font-semibold">Sourced transparently & ethically</p>
            
            <div className="space-y-4">
               {content.blogs.map((blog: any, i: number) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm hover:border-orange-200 transition">
                     <div className="flex gap-4">
                        <Quote className="w-6 h-6 text-[#E86B3D]/50 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-bold text-stone-900">{blog.title}</h4>
                           <span className="text-xs text-orange-600 font-semibold mb-2 block">By {blog.author}</span>
                           <p className="text-stone-600 text-sm leading-relaxed">{blog.summary}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
        </div>

        {/* Action Belt */}
        <div className="flex gap-4 border-t border-stone-200 pt-8 pb-4">
           <button onClick={onBack} className="px-6 py-4 rounded-xl font-semibold border border-stone-200 hover:bg-stone-50 text-stone-700 transition">
              Back
           </button>
           <button onClick={onContinue} className="flex-1 bg-[#E86B3D] hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 text-lg">
              Looks perfect, start planning <ArrowRight className="w-5 h-5" />
           </button>
        </div>

      </div>
    </div>
  );
}
