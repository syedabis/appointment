"use client";

import React from "react";
import { MENTORS, Mentor } from "@/data/mentorshipData";
import { Star, Clock, CheckCircle2, Award, Zap, Code2, ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";

interface MentorsGridProps {
  onSelectMentor: (mentor: Mentor) => void;
}

export const MentorsGrid: React.FC<MentorsGridProps> = ({ onSelectMentor }) => {
  const mentor = MENTORS[0]; // Syed Abis

  return (
    <section id="mentors-section" className="py-16 bg-white dark:bg-[#060911] border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Dedicated Lead Mentor</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
            Meet Your Principal Mentor: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">Syed Abis</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
            Get direct 1-on-1 guidance for resume roasting, portfolio optimization, AI architecture blueprints, and technical mock interviews.
          </p>
        </div>

        {/* Featured Single Mentor Banner Card */}
        <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/80 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar & Badges */}
            <div className="flex flex-col items-center shrink-0 space-y-3">
              <div className="relative">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-4 border-emerald-500/50 shadow-2xl"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-2 rounded-full shadow-lg">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-slate-900 dark:text-white">{mentor.rating}</span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">({mentor.reviewsCount}+ sessions)</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
                  DataCrumbs Lead AI Engineer & Principal Mentor
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{mentor.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">{mentor.company} • {mentor.experienceYears}+ Years Experience</p>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {mentor.bio}
              </p>

              {/* Specialties Grid */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Specialized 1-on-1 Focus Areas</span>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {mentor.specialties.map((spec, i) => (
                    <span key={i} className="text-xs font-bold bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
                {mentor.stack.map((st, i) => (
                  <span key={i} className="text-xs font-mono font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
                    {st}
                  </span>
                ))}
              </div>

              {/* Action bar */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left font-medium">
                  <span>Next Available Slot: </span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold block sm:inline">{mentor.nextAvailable}</strong>
                </div>

                <button
                  onClick={() => onSelectMentor(mentor)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Select Mentor & Reserve
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
