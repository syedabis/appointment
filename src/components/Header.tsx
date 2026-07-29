"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Menu, X, ChevronRight, UserCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

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
          <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-white dark:bg-[#080c14] rounded-[9px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5 leading-none">
                Data<span className="text-emerald-600 dark:text-emerald-400">Crumbs</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400/90 font-bold mt-0.5">
                Mentorship 1:1 Hub
              </span>
            </div>
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

            <div className="hidden lg:flex items-center space-x-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 px-3 py-1.5 rounded-full text-xs text-slate-800 dark:text-slate-300 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>1-on-1 Sessions Available Now</span>
            </div>

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
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 px-3 py-1.5 rounded-full text-xs text-slate-800 dark:text-slate-300 w-fit font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>1-on-1 Sessions Available Now</span>
          </div>
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
