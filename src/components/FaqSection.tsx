"use client";

import React, { useState } from "react";
import { FAQS } from "@/data/mentorshipData";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-20 bg-slate-50 dark:bg-[#060911] border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-inner">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium">
            Everything you need to know about booking 1-on-1 mentorship sessions.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900/80 rounded-2xl border transition-all duration-300 shadow-sm ${
                  isOpen
                    ? "border-emerald-500/60 dark:border-emerald-500/50 shadow-md shadow-emerald-500/5"
                    : "border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span className="text-slate-900 dark:text-white font-semibold text-base sm:text-lg tracking-tight">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rotate-180" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </button>

                {/* Animated Accordion Content using CSS Grid */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4 font-medium">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help CTA */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Still have questions? Reach out to our team at{" "}
            <a href="mailto:info@datacrumbs.org" className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold">
              info@datacrumbs.org
            </a>{" "}
            or WhatsApp{" "}
            <a href="https://wa.me/923292020497" target="_blank" className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold">
              +92 329 2020497
            </a>
          </p>
        </div>

      </div>
    </section>
  );
};
