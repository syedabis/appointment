"use client";

import React from "react";
import { ALUMNI_COMPANIES, CompanyItem } from "@/data/mentorshipData";
import { Building2, Globe2, Briefcase } from "lucide-react";

type Company = string | CompanyItem;

/** Splits the logos into `count` rows as evenly as possible (31 -> 8,8,8,7). */
function splitIntoRows(items: Company[], count: number): Company[][] {
  const rows: Company[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => rows[i % count].push(item));
  return rows;
}

const LOGO_ROWS = splitIntoRows(ALUMNI_COMPANIES, 4);

/** Logo image with a text fallback, shared by the mobile rows and the grid. */
const LogoMark: React.FC<{ company: Company }> = ({ company }) => {
  const companyName = typeof company === "string" ? company : company.name;
  const logoUrl = typeof company === "object" ? company.logo : undefined;

  if (!logoUrl) {
    return <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{companyName}</span>;
  }

  return (
    <img
      src={logoUrl}
      alt={`${companyName} logo`}
      className="max-h-[42px] max-w-[104px] object-contain"
      onError={(e) => {
        (e.currentTarget as HTMLElement).style.display = "none";
        const parent = e.currentTarget.parentElement;
        if (parent && !parent.querySelector(".fallback-text")) {
          const span = document.createElement("span");
          span.className = "fallback-text text-xs font-bold";
          span.innerText = companyName;
          parent.appendChild(span);
        }
      }}
    />
  );
};

export const AlumniNetwork: React.FC = () => {
  return (
    <section id="alumni-section" className="py-16 bg-slate-50 dark:bg-[#080c14] border-t border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="max-w-3xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
            Industry Recognition & Hiring Network
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Our Alumni Work at Leading Tech Companies & High-Growth Startups
          </h3>
        </div>

        {/* MOBILE: 4 scrolling rows. Desktop keeps the static grid below. */}
        <div className="lg:hidden pt-4 space-y-3 -mx-4 sm:-mx-6 relative">
          {/* Fade the edges so logos slide in and out rather than pop. */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-slate-50 dark:from-[#080c14] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-slate-50 dark:from-[#080c14] to-transparent z-10 pointer-events-none" />

          {LOGO_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="overflow-hidden">
              <div
                className={rowIndex % 2 === 0 ? "animate-logo-row" : "animate-logo-row-reverse"}
              >
                {/* Rendered twice so the -50% shift loops seamlessly. */}
                {[...row, ...row].map((company, index) => (
                  <div
                    key={index}
                    className="mx-1.5 w-[128px] h-[62px] shrink-0 px-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden"
                  >
                    <LogoMark company={company} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP: unchanged static grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6 pt-4 max-w-6xl mx-auto">
          {ALUMNI_COMPANIES.map((company, index) => {
            const companyName = typeof company === "string" ? company : company.name;
            const logoUrl = typeof company === "object" ? company.logo : undefined;

            return (
              <div
                key={index}
                className="w-full h-[84px] sm:h-[92px] px-5 sm:px-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base sm:text-lg tracking-wide hover:border-emerald-500 hover:scale-[1.03] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center text-center overflow-hidden group"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${companyName} logo`}
                    className="max-h-[54px] sm:max-h-[60px] max-w-[190px] object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // If image fails to load, hide image and show text
                      (e.currentTarget as HTMLElement).style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector(".fallback-text")) {
                        const span = document.createElement("span");
                        span.className = "fallback-text";
                        span.innerText = companyName;
                        parent.appendChild(span);
                      }
                    }}
                  />
                ) : (
                  <span>{companyName}</span>
                )}
              </div>
            );
          })}
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
