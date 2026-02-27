"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, MoveRight, Bookmark, Compass, Leaf } from "lucide-react";

export interface LandingPageProps {
  onStart: () => void;
}

// Simple IntersectionObserver hook for fade-in animations
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  
  return ref;
}

function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = useFadeIn();
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out opacity-0 translate-y-8 ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

// Very slow fade resembling ink seeping into paper
function InkFadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100");
          entry.target.classList.remove("opacity-0");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-opacity duration-[2000ms] ease-in-out opacity-0 ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

// Quick drop down and slight rotate to mimic a photo dropped on a desk
function ImageDropSection({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "scale-100", "translate-y-0", "rotate-0");
          entry.target.classList.remove("opacity-0", "scale-110", "-translate-y-12", "rotate-3");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] opacity-0 scale-110 -translate-y-12 rotate-3 ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="w-full bg-[#F7F6F2] text-[#2C2A26] font-serif selection:bg-[#E86B3D]/20 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen min-h-[700px] flex flex-col justify-between overflow-hidden bg-[#1A1815]">
        {/* Background Image - Cinematic mountain/road fading to distance */}
        <div className="absolute inset-0 z-0">
          {/* Desktop Background */}
          <img 
            src="https://res.cloudinary.com/dooekcvv0/image/upload/v1771852834/mosyqdnz3czwmhb3vzqy.jpg" 
            alt="Nomadic landscape with yurts and mountains"
            className="hidden md:block w-full h-full object-cover object-[center_65%] opacity-90"
          />
          {/* Mobile Background */}
          <img 
            src="https://res.cloudinary.com/dooekcvv0/image/upload/v1771853875/jv4sq8ntzohbwib65b9g.jpg" 
            alt="Nomadic landscape with yurts and mountains (Vertical)"
            className="block md:hidden w-full h-full object-cover object-center opacity-90"
          />
          {/* Film grain layer / Vignette */}
          <div className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>
          {/* Subtle gradient overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Minimal Nav Layer */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-8 w-full mx-auto">
           <span className="text-[#F7F6F2]/60 font-sans tracking-[0.2em] text-xs uppercase cursor-pointer hover:text-white transition">safar.ai</span>
           <button className="text-[#F7F6F2]/60 font-sans tracking-wider text-xs uppercase hover:text-white transition-colors flex items-center gap-2">
              Menu
              <div className="w-5 flex flex-col gap-1 items-end ml-1">
                 <span className="block w-full h-px bg-current"></span>
                 <span className="block w-2/3 h-px bg-current"></span>
              </div>
           </button>
        </nav>

        {/* Central Content */}
        <FadeSection className="relative z-10 text-center px-4 -mt-24 sm:-mt-12 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/20 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E86B3D] animate-pulse"></span>
            <span className="text-white/90 text-xs font-sans tracking-[0.2em] uppercase">Built for slow travel</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[7rem] lg:text-[8.5rem] font-serif font-normal tracking-tight text-[#F7F6F2] drop-shadow-lg leading-[1.1] mb-2 max-w-6xl mx-auto">
            Travel <span className="italic text-white/80">deep,</span> not far.
          </h1>
          
          <p className="font-[family-name:var(--font-caveat)] text-3xl md:text-5xl text-[#F7F6F2]/90 max-w-2xl mx-auto drop-shadow-md -rotate-2 origin-left mt-[-0.5rem] md:mb-6">
            We don't plan trips. We craft journeys.
          </p>
        </FadeSection>

        {/* Bottom Actions & Torn Paper Edge */}
        <div className="relative z-20 w-full flex flex-col items-center">
          <div className="flex flex-col items-center mb-16 space-y-6">
            <span className="text-[#F7F6F2]/60 font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase opacity-80">
              Planned with care, by safar.ai
            </span>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
              <button onClick={onStart} className="px-8 py-3.5 rounded-sm border border-[#F7F6F2]/20 text-[#F7F6F2]/90 hover:bg-[#F7F6F2]/10 backdrop-blur-sm transition-all duration-300 font-sans text-xs tracking-[0.15em] uppercase w-[220px] sm:w-auto">
                Explore Journeys
              </button>
              <button onClick={onStart} className="px-8 py-3.5 rounded-sm bg-[#F7F6F2]/5 border border-transparent hover:border-[#F7F6F2]/20 text-[#F7F6F2]/90 backdrop-blur-sm transition-all duration-300 font-sans text-xs tracking-[0.15em] uppercase w-[220px] sm:w-auto">
                Design Your Trip
              </button>
            </div>
          </div>
          
          {/* Ripped Paper Edge overlapping the background to transition to the off-white section below */}
          <div className="absolute bottom-0 w-full translate-y-px pointer-events-none">
             <svg viewBox="0 0 1440 28" preserveAspectRatio="none" className="w-full h-6 md:h-10 text-[#F7F6F2] fill-current">
               <path d="M0,28 L1440,28 L1440,6.0264104 C1320,18.6937968 1200,3.02641038 1080,9.02641038 C960,15.9735896 840,-0.97358962 720,8.0264104 C600,17.0264104 480,-0.97358962 360,5.02641038 C240,11.0264104 120,4.35974372 0,9.0264104 L0,28 Z"></path>
             </svg>
          </div>
        </div>
      </section>

      {/* 2. THE TRAVELOGUE: WHAT IS SAFARNAAMA */}
      <section className="relative w-full min-h-[120vh] bg-[#F7F6F2] flex items-center py-32 md:py-48 px-6 md:px-12 lg:px-24">
        {/* Subtle Journal Margins/Lines */}
        <div className="absolute left-6 md:left-12 lg:left-24 top-0 bottom-0 w-px bg-red-900/10 pointer-events-none"></div>
        <div className="absolute right-6 md:right-12 lg:right-24 top-0 bottom-0 w-px bg-black/5 pointer-events-none"></div>

        {/* Paper texture overlay for the section */}
        <div className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"1.5\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>

        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
          
          {/* TEXT - Left Side (The Journal Entry) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-12 max-w-xl mx-auto lg:mx-0 lg:pl-12">
             <InkFadeSection delay={100} className="flex items-center gap-4 mb-4">
               <span className="font-[family-name:var(--font-caveat)] text-3xl text-[#E86B3D] -rotate-2">Prologue</span>
               <span className="h-px bg-[#DEDBD2] flex-grow"></span>
             </InkFadeSection>

             <InkFadeSection delay={500}>
               <p className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#1A1815] leading-tight font-serif drop-shadow-sm">
                 We believe journeys are found in the quiet moments.
               </p>
             </InkFadeSection>
             
             <InkFadeSection delay={900}>
               <p className="text-[#4A463F] text-lg md:text-xl font-light leading-relaxed">
                 Beyond the itineraries, the rushed flights, and the crowded sites, there is the simple, honest act of being present.
               </p>
             </InkFadeSection>

             <InkFadeSection delay={1300}>
               <p className="text-[#4A463F] text-lg md:text-xl font-light leading-relaxed">
                 <span className="font-semibold text-[#1A1815]">Safarnaama</span> — meaning a travelogue, a chronicle of journeys — was created to return travel to its untamed pace. We spend time listening to places, understanding their history, and mapping their rhythms before asking you to step foot there.
               </p>
             </InkFadeSection>
             
             <InkFadeSection delay={1700}>
               <p className="text-[#4A463F] text-lg md:text-xl font-light leading-relaxed">
                 Every path we scribe is crafted with profound intention.
               </p>
             </InkFadeSection>

             <InkFadeSection delay={2100}>
               <p className="text-xl md:text-2xl font-serif text-[#1A1815] leading-relaxed pt-8 drop-shadow-sm">
                 Because true travel isn't about moving faster. <br />
                 <span className="italic">It’s about seeing deeper.</span>
               </p>
             </InkFadeSection>
          </div>

          {/* IMAGE - Right Side (The Attached Polaroid) */}
          <div className="lg:col-span-6 h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full relative [perspective:1000px]">
            <ImageDropSection delay={700} className="w-full h-full flex justify-center lg:justify-end items-center">
              <div className="w-[95%] md:w-[85%] h-[95%] relative bg-[#FCFBF8] p-3 pb-16 md:p-5 md:pb-24 shadow-[20px_20px_60px_rgba(0,0,0,0.08)] -rotate-2 hover:rotate-1 hover:scale-[1.02] transition-transform duration-700 ease-out origin-center rounded-sm border border-black/5">
                
                {/* Vintage Tape details */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/50 backdrop-blur-md shadow-sm rotate-1 z-20 border border-white/40 mix-blend-screen"></div>
                <div className="absolute top-4 -left-4 w-16 h-6 bg-stone-300/40 backdrop-blur-sm -rotate-[35deg] z-20 mix-blend-multiply"></div>
                <div className="absolute bottom-6 -right-5 w-16 h-6 bg-stone-300/40 backdrop-blur-sm -rotate-[40deg] z-20 mix-blend-multiply"></div>

                <div className="w-full h-full relative overflow-hidden bg-stone-200">
                  <img 
                    src="https://res.cloudinary.com/dooekcvv0/image/upload/v1771908036/lmru6j7rrisnj7m7da1b.jpg" 
                    alt="Two people observing a vast mountain landscape"
                    className="w-full h-full object-cover object-bottom sepia-[0.1] contrast-[1.05]"
                  />
                  {/* Subtle grain/overlay on the photo */}
                  <div className="absolute inset-0 bg-[#544D42]/10 mix-blend-multiply pointer-events-none" />
                </div>
                
                {/* Polaroid Caption using the handwriting font */}
                <div className="absolute bottom-4 md:bottom-8 w-full text-center left-0 font-[family-name:var(--font-caveat)] text-2xl md:text-3xl text-[#2C2A26] pointer-events-none opacity-80 -rotate-1">
                  Somewhere quiet
                </div>
              </div>
            </ImageDropSection>
          </div>
          
        </div>

        {/* The Thread (Exit Line) leading to the next section */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-[#C2BCB0] to-transparent z-10"></div>
      </section>

      {/* 3 & 4 & 5. THE TRAVELOGUE CONTINUES: THE ARCHITECTURE OF A QUIET MIND */}
      <section className="relative w-full min-h-screen bg-[#F7F6F2] py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-black/5">
        {/* Subtle Journal Margins/Lines (Continued) */}
        <div className="absolute left-6 md:left-12 lg:left-24 top-0 bottom-0 w-px bg-red-900/10 pointer-events-none"></div>
        <div className="absolute right-6 md:right-12 lg:right-24 top-0 bottom-0 w-px bg-black/5 pointer-events-none"></div>
        
        {/* Paper texture overlay */}
        <div className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"1.5\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%\" height=\"100%\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>

        <div className="max-w-[1400px] w-full mx-auto relative z-10">
          
          <div className="max-w-2xl mx-auto text-center mb-32 lg:pl-12">
            <InkFadeSection delay={100} className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-[#1A1815] font-serif">
                The Architecture of a Quiet Mind
              </h2>
              <div className="space-y-6 text-[#4A463F] text-lg md:text-xl font-light leading-relaxed">
                <p>
                  Planning has become as exhausting as the noise we seek to leave behind. The magic of anticipation is lost in the anxiety of logistics.
                </p>
                <p>
                  Behind Safarnaama is <span className="font-semibold text-[#1A1815]">safar.ai</span>—a quiet intelligence designed to bear the weight of planning. An experienced friend who knows the roads, the history, and the reality of the places you wish to see.
                </p>
              </div>
            </InkFadeSection>
          </div>

          {/* Three Pillars (Editorial / Journal Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:pl-12 max-w-5xl mx-auto">
             
             <InkFadeSection delay={300} className="relative group">
                {/* Hand-drawn circle effect */}
                <div className="w-16 h-16 rounded-[45%_55%_40%_60%] border border-[#E86B3D] flex items-center justify-center mb-6 group-hover:rounded-[60%_40%_55%_45%] transition-all duration-700">
                  <span className="font-[family-name:var(--font-caveat)] text-[#E86B3D] text-2xl">01.</span>
                </div>
                <h3 className="text-2xl font-serif text-[#1A1815] mb-4">Understanding Before Suggesting</h3>
                <p className="text-[#4A463F] font-light leading-relaxed text-lg">
                  We don't do checklists. We learn the pace you prefer and map the exact emotional topography you wish to explore.
                </p>
             </InkFadeSection>

             <InkFadeSection delay={500} className="relative group">
                {/* Hand-drawn circle effect */}
                <div className="w-16 h-16 rounded-[50%_40%_60%_50%] border border-[#E86B3D] flex items-center justify-center mb-6 group-hover:rounded-[40%_60%_45%_55%] transition-all duration-700">
                  <span className="font-[family-name:var(--font-caveat)] text-[#E86B3D] text-2xl">02.</span>
                </div>
                <h3 className="text-2xl font-serif text-[#1A1815] mb-4">Context-Rich Itineraries</h3>
                <p className="text-[#4A463F] font-light leading-relaxed text-lg">
                  Every landscape has a story. Your itinerary connects you to a place’s true history and culture, avoiding surface-level tourism.
                </p>
             </InkFadeSection>

             <InkFadeSection delay={700} className="relative group">
                {/* Hand-drawn circle effect */}
                <div className="w-16 h-16 rounded-[55%_45%_50%_40%] border border-[#E86B3D] flex items-center justify-center mb-6 group-hover:rounded-[45%_55%_40%_50%] transition-all duration-700">
                  <span className="font-[family-name:var(--font-caveat)] text-[#E86B3D] text-2xl">03.</span>
                </div>
                <h3 className="text-2xl font-serif text-[#1A1815] mb-4">Honest Boundaries</h3>
                <p className="text-[#4A463F] font-light leading-relaxed text-lg">
                  We respect math. Budgets reflect grounded reality, and timelines leave room to breathe. No false promises.
                </p>
             </InkFadeSection>

          </div>
        </div>
      </section>

      {/* 6. FOR THE CONFUSED TRAVELLER */}
      <section className="py-32 md:py-48 px-6 bg-[#FCFBF8]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeSection className="space-y-10">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-[#1A1815]">
              When You Seek A Place, But Lack A Name
            </h2>
            <div className="space-y-6 text-[#4A463F] text-lg md:text-xl font-light leading-relaxed text-left md:text-center">
              <p>
                Sometimes you don’t need a destination; you just need a feeling. 
              </p>
              <p>
                From the isolation of high altitudes to the chaos of a spiritual city—tell us what you are carrying, and we will find the landscape that matches it.
              </p>
            </div>
            <div className="pt-8">
              <button 
                onClick={onStart} 
                className="group inline-flex items-center gap-3 text-[#1A1815] font-light text-lg border-b border-transparent hover:border-[#1A1815] transition-all pb-1 tracking-wide"
              >
                Let us find your direction
                <MoveRight strokeWidth={1} className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* 7. SAFARNAAMA JOURNEYS */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <FadeSection className="mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-[#1A1815]">
            Journeys Grounded in Reality
          </h2>
        </FadeSection>
        
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
           <div className="w-full md:w-1/2 space-y-6 text-[#4A463F] text-lg md:text-xl font-light leading-relaxed">
             <FadeSection>
               <p>
                 Our curated paths are not built for speed; they are engineered for depth.
               </p>
               <p>
                 From high Himalayan passes to the complex rhythm of the Ghats, these are journeys that require presence. We handle the friction, so you can focus on the experience.
               </p>
             </FadeSection>
           </div>
           
           <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
             <div className="aspect-[4/5] rounded-sm overflow-hidden translate-y-8">
               <img src="https://images.unsplash.com/photo-1544634076-a1014cc676b5?auto=format&fit=crop&q=80&w=600" alt="Monks in Sikkim" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out" />
             </div>
             <div className="aspect-[4/5] rounded-sm overflow-hidden">
               <img src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=600" alt="Varanasi sunrise" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out" />
             </div>
           </div>
        </div>
      </section>

      {/* 8. CLOSING SECTION */}
      <section className="relative py-48 px-6 bg-[#1A1815] text-[#F7F6F2] overflow-hidden">
        {/* Subtle texture or dark image in background */}
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none">
          <img src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=2000" alt="Dark forest texture" className="w-full h-full object-cover grayscale" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <FadeSection className="space-y-12">
            <h2 className="text-3xl md:text-5xl font-normal tracking-wide">
              The Departure
            </h2>
            <div className="space-y-6 text-[#C2BCB0] text-lg md:text-xl font-light leading-relaxed">
              <p>
                When you are ready to leave the noise behind, we are here to craft the path.
              </p>
            </div>
            
            <div className="pt-12">
              <button 
                onClick={onStart}
                className="group relative inline-flex items-center gap-4 text-[#F7F6F2] font-light text-xl md:text-2xl tracking-wide px-8 py-4 border border-[#F7F6F2]/30 hover:border-[#F7F6F2] hover:bg-[#F7F6F2]/5 transition-all duration-500 rounded-sm overflow-hidden"
              >
                <span className="relative z-10">Begin your Safarnaama</span>
                <MoveRight strokeWidth={1} className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </div>
          </FadeSection>
        </div>
      </section>

    </div>
  );
}
