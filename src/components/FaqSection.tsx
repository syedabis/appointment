"use client";

import React, { useState } from "react";
import { FAQS } from "@/data/mentorshipData";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
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
                className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800/90 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm sm:text-base"
                >
                  <span className="text-slate-900 dark:text-white font-extrabold text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-800 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/60 pt-4 animate-fadeIn font-medium">
                    {faq.a}
                  </div>
                )}
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
