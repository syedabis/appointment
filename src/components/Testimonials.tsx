"use client";

import React from "react";
import { TESTIMONIALS } from "@/data/mentorshipData";
import { Quote, Star, ArrowRight, Sparkles } from "lucide-react";

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-[#060911] border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Student Transformation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
            Graduates Don't Just Learn. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">They Achieve Real Roles.</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
            See how 1-on-1 mentorship sessions helped students land data roles, close freelance clients, and transition careers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900/80 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative shadow-md hover:shadow-xl transition-all"
            >
              <div>
                <Quote className="w-8 h-8 text-emerald-500/40 mb-4" />
                
                {/* Highlight Tag */}
                <div className="inline-block text-[11px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/30 mb-4">
                  {item.highlight}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6 font-medium">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/40 shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Now: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{item.roleAfter}</strong> @ {item.company}
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
