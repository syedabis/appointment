"use client";

import React from "react";
import { TESTIMONIALS } from "@/data/mentorshipData";
import { Quote, Star, Sparkles } from "lucide-react";

export const Testimonials: React.FC = () => {
  // Duplicate array so marquee seamlessly loops infinitely
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#060911] border-t border-slate-200 dark:border-slate-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Student Transformation • 10 Verified Graduates</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Graduates Don't Just Learn. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              They Achieve Real Roles & High-Ticket Offers.
            </span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
            Hover over any card to pause the continuous marquee & read full graduate stories.
          </p>
        </div>
      </div>

      {/* CONTINUOUS MARQUEE SLIDER */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Gradient Overlays for Smooth Fade Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-[#060911] dark:via-[#060911]/80 dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-[#060911] dark:via-[#060911]/80 dark:to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-continuous flex gap-6 px-4">
          {marqueeItems.map((item, index) => (
            <div
              key={index}
              className="w-[340px] sm:w-[380px] shrink-0 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-md hover:shadow-2xl hover:border-emerald-500 dark:hover:border-emerald-500/50 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Quote className="w-7 h-7 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                    {item.highlight}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6 font-medium">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/40 shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Now: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{item.roleAfter}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex text-amber-400 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
