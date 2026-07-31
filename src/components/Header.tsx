"use client";

import React, { useState } from "react";
import { Calendar, Menu, X, ChevronRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { withBasePath } from "@/lib/basePath";

interface HeaderProps {
  onBookClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToBooking = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      const element = document.getElementById("booking-section");
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#080c14]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 w-full gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* Both variants ship and are swapped by CSS off the html.dark class,
                so the right one is correct from the very first paint. The white
                wordmark is unreadable on the light header, and vice versa. */}
            <img
              src={withBasePath("/datacrumbs-white.png")}
              alt="DataCrumbs"
              width={608}
              height={125}
              className="hidden dark:block h-8 sm:h-10 w-auto object-contain object-left"
            />
            <img
              src={withBasePath("/datacrumbs-light.png")}
              alt="DataCrumbs"
              width={200}
              height={61}
              className="block dark:hidden h-8 sm:h-10 w-auto object-contain object-left"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            <a href="#booking-section" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Session Tracks
            </a>
            <a href="#why-section" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Why Mentorship
            </a>
            <a href="#faq-section" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Live Indicator, Theme Toggle & CTA */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            <ThemeToggle />

            <button
              onClick={scrollToBooking}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-[1px] font-semibold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 shrink-0"
            >
              <span className="flex items-center gap-1.5 rounded-[11px] bg-white dark:bg-[#080c14] px-4 py-2 transition-all duration-300 group-hover:bg-transparent text-slate-900 dark:text-white group-hover:text-slate-950 font-bold">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-slate-950 transition-colors" />
                Book Session
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-slate-950 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center space-x-2 shrink-0">
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white border border-slate-300 dark:border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-800 dark:text-slate-300">
            <a href="#booking-section" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-600 dark:hover:text-emerald-400 py-1">
              Session Tracks
            </a>
            <a href="#why-section" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-600 dark:hover:text-emerald-400 py-1">
              Why Mentorship
            </a>
            <a href="#faq-section" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-600 dark:hover:text-emerald-400 py-1">
              FAQ
            </a>
          </nav>
          <button
            onClick={scrollToBooking}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Calendar className="w-5 h-5" />
            Book 1-on-1 Session Now
          </button>
        </div>
      )}
    </header>
  );
};
