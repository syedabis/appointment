"use client";

import React from "react";
import { CheckCircle2, XCircle, Sparkles, Zap } from "lucide-react";

export const WhyMentorship: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-[#080c14] relative overflow-hidden border-t border-slate-200 dark:border-slate-900">
      {/* Glow Effects background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm animate-float">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>The DataCrumbs Mentorship Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            Why Generic Tutorials Fail <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              And 1-on-1 Mentorship Wins
            </span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
            Tutorials teach theory. Mentors inspect your actual GitHub repos, fix hidden bugs, and prepare you for hiring manager questions.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Generic Online Courses */}
          <div className="bg-white dark:bg-slate-950/60 rounded-3xl p-8 border border-rose-200 dark:border-rose-500/20 relative space-y-6 shadow-sm hover:border-rose-400 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                Generic Pre-Recorded Tutorials
              </span>
              <span className="text-xs bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 px-2.5 py-1 rounded font-mono font-bold">
                Low Success
              </span>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Pre-recorded videos with no feedback on your code errors</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Generic cookie-cutter projects that hiring managers ignore</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>No resume roasting or interview practice under pressure</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Stuck on bugs for days with no expert to ask</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>No referrals or industry connections</span>
              </li>
            </ul>
          </div>

          {/* DataCrumbs 1-on-1 Mentorship - Right Box */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-8 border-2 border-emerald-500/50 dark:border-emerald-500/50 relative space-y-6 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-md">
              Recommended
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                DataCrumbs 1-on-1 Mentorship
              </span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 px-2.5 py-1 rounded font-mono font-bold">
                85% Placement
              </span>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  <strong className="text-slate-900 dark:text-white font-extrabold">Line-by-line code refactoring</strong> on your live GenAI & n8n repos
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  <strong className="text-slate-900 dark:text-white font-extrabold">Production architectural advice</strong> for RAG, vector DBs, and FastAPI
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  <strong className="text-slate-900 dark:text-white font-extrabold">Brutal ATS resume roast</strong> & LinkedIn optimization to land interviews
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  <strong className="text-slate-900 dark:text-white font-extrabold">Realistic technical mock interviews</strong> with instant feedback
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  <strong className="text-slate-900 dark:text-white font-extrabold">Direct intros & referrals</strong> to our 1,500+ tech company network
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
