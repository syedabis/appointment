import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "1-on-1 AI & Data Science Mentorship | DataCrumbs",
  description: "Select your time slot and mentor for 1-on-1 AI, Machine Learning, n8n automation, and resume roasting sessions. Engineered by DataCrumbs.",
  keywords: ["DataCrumbs mentorship", "AI 1-on-1", "Data Science slot booking", "n8n automation review", "resume roast AI", "mock interview AI"],
  authors: [{ name: "DataCrumbs Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light scroll-smooth ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body className={`${plusJakartaSans.className} bg-white dark:bg-[#080c14] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-black`}>
        {/* Restore the saved theme before first paint so there is no flash of
            the wrong theme, and so the toggle never depends on hydration.
            Light is the default; only an explicit "dark" preference overrides it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("datacrumbs-theme")==="dark"?"dark":"light";var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
