"use client";

import React from "react";
import { Sparkles, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-[#04060d] text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-900 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-white dark:bg-[#080c14] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Data<span className="text-emerald-600 dark:text-emerald-400">Crumbs</span>
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Our mission is to make tech skills accessible to everyone. DataCrumbs bridges skill gaps and drives data-driven decisions through industry-aligned mentorship.
            </p>

            <div className="pt-2">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-500/15 px-3.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-500/40">
                2k+ professionals trained
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Programs & Solutions</h4>
            <ul className="space-y-2.5 font-semibold">
              <li><a href="https://www.datacrumbs.org/ai-and-datascience" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI & Data Science Bootcamp</a></li>
              <li><a href="#booking-section" className="text-emerald-700 dark:text-emerald-400 font-extrabold hover:underline">1-on-1 Mentorship Booking</a></li>
              <li><a href="https://www.datacrumbs.org/enterprise-solutions" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Enterprise Solutions</a></li>
              <li><a href="https://www.easyhire.lt/" target="_blank" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">EasyHire Talent <ExternalLink className="w-3 h-3 opacity-80" /></a></li>
              <li><a href="https://www.datacrumbs.org/nexusbot" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">NexusBot Agentic AI</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Company & Impact</h4>
            <ul className="space-y-2.5 font-semibold">
              <li><a href="https://www.datacrumbs.org/" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</a></li>
              <li><a href="https://www.datacrumbs.org/about" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="https://www.datacrumbs.org/hall-of-fame" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Hall of Fame</a></li>
              <li><a href="https://www.datacrumbs.org/job-portal" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Careers & Job Portal</a></li>
              <li><a href="https://www.datacrumbs.org/contact" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Get In Touch</h4>
            <ul className="space-y-3 font-semibold">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <a href="tel:+923292020497" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">+92 329 2020497</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <a href="mailto:info@datacrumbs.org" className="text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">info@datacrumbs.org</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Room #105, Shahrah-e-Faisal, Karachi</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-600 dark:text-slate-400 font-semibold text-[11px] gap-4">
          <p>© 2026 DataCrumbs.org. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for student success & AI career transformation.
          </p>
        </div>

      </div>
    </footer>
  );
};
