"use client";

import React from "react";
import { ALUMNI_COMPANIES } from "@/data/mentorshipData";
import { Building2, Globe2, Briefcase } from "lucide-react";

export const AlumniNetwork: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-[#080c14] border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="max-w-3xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
            Industry Recognition & Hiring Network
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Our Alumni Work at Leading Tech Companies & High-Growth Startups
          </h3>
        </div>

        {/* Logos Marquee / Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          {ALUMNI_COMPANIES.map((company, index) => (
            <div
              key={index}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base tracking-wide hover:border-emerald-500 hover:scale-105 transition-all shadow-sm"
            >
              {company}
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-wrap justify-center items-center gap-8 text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>900+ Total Placements</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>50+ Partner Hiring Employers</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Remote & On-Site Roles Worldwide</span>
          </div>
        </div>

      </div>
    </section>
  );
};
