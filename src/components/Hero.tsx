"use client";

import React from "react";
import { Sparkles, Calendar, ShieldCheck, Star, Users, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { withBasePath } from "@/lib/basePath";

interface HeroProps {
  onStartBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBooking }) => {
  return (
    <div className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-grid-pattern bg-white dark:bg-[#080c14]">
      {/* Glow Effects background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[300px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold shadow-inner">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>DataCrumbs 1-on-1 Mentorship Hub • Open to All AI Candidates</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Accelerate Your AI Career. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              Turn Projects Into Job Offers & Paid Gigs.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-800 dark:text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed">
            1-on-1 mentorship designed to get you hired. Reserve your session for live ATS resume reviews, custom AI & automation blueprints, and realistic mock interview drills.
          </p>

          {/* Quick Value Highlights Pill Grid */}
          <div className="pt-2 pb-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900/90 px-4 py-2 rounded-xl border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>1. LinkedIn, Resume & Portfolio</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900/90 px-4 py-2 rounded-xl border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>2. Career Advisory, Freelancing & AI Blueprint</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900/90 px-4 py-2 rounded-xl border border-purple-300 dark:border-purple-500/40 text-purple-800 dark:text-purple-300 shadow-md">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>3. Mock Interviews</span>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartBooking}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              Select Session Track & Slot
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#mentors-section"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Meet Your Lead Mentor
            </a>
          </div>

          {/* Social Proof sub-line */}
          <div className="pt-6 flex items-center justify-center space-x-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-[#080c14] object-cover" src={withBasePath("/instructor-image.png")} alt="Syed Abis" />
            </div>
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white ml-1">4.99/5</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">from 480+ 1-on-1 student & candidate sessions</span>
            </div>
          </div>

        </div>

        {/* Metrics Card Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden bg-white dark:bg-slate-900/80">
            <div className="text-3xl sm:text-4xl font-extrabold text-gradient-emerald">900+</div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">Data & AI Placements</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden bg-white dark:bg-slate-900/80">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">85%</div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">Job Offer Rate within 6 Mo</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden bg-white dark:bg-slate-900/80">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400">1:1</div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">Dedicated Mentorship</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden bg-white dark:bg-slate-900/80">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 dark:text-amber-400">100%</div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">Satisfaction Guarantee</div>
          </div>
        </div>

      </div>
    </div>
  );
};
